import { Request, Response, Router } from 'express';
import { TournamentModel } from '../data-models/tournament.model';
import { FormatModel } from '../data-models/format.model';
import { GroupModel } from '../data-models/group.model';
import { TeamModel } from '../data-models/team.model';
import { TournamentService } from '../services/tournament.service';
import { FormatService } from '../services/format.service';
import { GroupService } from '../services/group.service';
import { TeamService } from '../services/team.service';
import { handleDates } from '../middleware/dateHandler.middleware';

interface CreateTournamentRequest {
  tournament: TournamentModel;
  formats: FormatModel[];
}

interface GroupTeamModel{
    group: GroupModel,
    teams: TeamModel[]
}

export class TournamentController {
  private tournamentService: TournamentService;
  private formatService: FormatService;
  private groupService: GroupService;
  private teamService: TeamService;
  public router: Router;

  constructor() {
    this.tournamentService = new TournamentService();
    this.formatService = new FormatService();
    this.groupService = new GroupService();
    this.teamService = new TeamService();
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // Create/Update tournament with formats
    this.router.post('/', handleDates, this.add.bind(this));
    
    // Create/Update groups and teams
    this.router.post('/:tournamentId/groups', handleDates, this.saveGroups.bind(this));
  }

  public async add(req: Request, res: Response): Promise<void> {
    try {
      const { tournament, formats } = req.body as CreateTournamentRequest;
      
      // Create or update tournament
      const createdTournament = await this.tournamentService.addOrUpdateTournament(tournament);

      // Create or update formats with the tournament ID
      const createdFormats = await Promise.all(
        formats.map(format => {
          format.tournamentId = createdTournament.tournamentId!;
          return this.formatService.addOrUpdateFormat(format);
        })
      );

      // Return tournament with its formats
      res.status(201).json({
        tournament: createdTournament,
        formats: createdFormats
      } as CreateTournamentRequest);
    } catch (error) {
      console.error('Error in add tournament:', error);
      if (error instanceof Error && error.message.includes('Invitation code')) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  public async saveGroups(req: Request, res: Response): Promise<void> {
    try {
      const tournamentId = parseInt(req.params.tournamentId);
      const groupTeamModels = req.body;

      // Validate tournament exists
      await this.tournamentService.getTournamentById(tournamentId);

      // Process each group and its teams sequentially
      const results = await Promise.all(
        groupTeamModels.map(async (groupTeam) => {
          // Create or update group first
          const createdGroup = await this.groupService.addOrUpdateGroup(groupTeam.group);

          // Bind the new group ID to each team and create/update them
          const createdTeams = await Promise.all(
            groupTeam.teams.map(team => {
              team.groupId = createdGroup.groupId!;
              return this.teamService.addOrUpdateTeam(team);
            })
          );

          return {
            group: createdGroup,
            teams: createdTeams
          };
        })
      );

      res.status(201).json(results);
    } catch (error) {
      console.error('Error in save groups:', error);
      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
} 