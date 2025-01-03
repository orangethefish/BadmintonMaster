import { Request, Response, Router } from 'express';
import { TournamentModel, TournamentInfoModel } from '../data-models/tournament.model';
import { FormatModel } from '../data-models/format.model';
import { GroupModel, GroupTeamModel } from '../data-models/group.model';
import { TeamModel } from '../data-models/team.model';
import { FormatMatchModel, GroupMatchModel } from '../data-models/match.model';
import { TournamentService } from '../services/tournament.service';
import { FormatService } from '../services/format.service';
import { GroupService } from '../services/group.service';
import { TeamService } from '../services/team.service';
import { MatchService } from '../services/match.service';
import { MatchGeneratorService } from '../services/match-generator.service';
import { handleDates } from '../middleware/dateHandler.middleware';
import { verifyToken } from '../middleware/auth.middleware';
import { OwnerMiddleware } from '../middleware/owner.middleware';

interface CreateTournamentRequest {
  tournament: TournamentModel;
  formats: FormatModel[];
}

export class TournamentController {
  private tournamentService: TournamentService;
  private formatService: FormatService;
  private groupService: GroupService;
  private teamService: TeamService;
  private matchService: MatchService;
  private matchGeneratorService: MatchGeneratorService;
  private ownerMiddleware: OwnerMiddleware;
  public router: Router;

  constructor() {
    this.tournamentService = new TournamentService();
    this.formatService = new FormatService();
    this.groupService = new GroupService();
    this.teamService = new TeamService();
    this.matchService = new MatchService();
    this.matchGeneratorService = new MatchGeneratorService();
    this.ownerMiddleware = new OwnerMiddleware();
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // Create/Update tournament with formats
    this.router.post('/', [verifyToken, handleDates], this.add.bind(this));
    
    // Create/Update groups and teams
    this.router.post('/:tournamentId/groups', [verifyToken, this.ownerMiddleware.verifyTournamentOwner, handleDates], this.saveGroups.bind(this));

    // Get tournament info
    this.router.get('/:tournamentId', verifyToken, this.getTournamentInfo.bind(this));

    // Get tournament matches
    this.router.get('/:tournamentId/matches', verifyToken, this.getTournamentMatches.bind(this));
  }

  public async getTournamentInfo(req: Request, res: Response): Promise<void> {
    try {
      const tournamentId = parseInt(req.params.tournamentId);

      // Get tournament details
      const tournament = await this.tournamentService.getTournamentById(tournamentId);

      // Get formats for this tournament
      const formats = await this.formatService.getFormatsByTournamentId(tournamentId);

      // Get groups and teams for each format
      const formatInfos = await Promise.all(
        formats.map(async format => {
          const groups = await this.groupService.getGroupsByFormatId(format.formatId!);
          
          // Get teams for each group
          const groupTeams = await Promise.all(
            groups.map(async group => {
              const teams = await this.teamService.getTeamsByGroupId(group.groupId!);
              return {
                group,
                teams
              } as GroupTeamModel;
            })
          );

          return {
            format,
            groupsAndTeams: groupTeams
          };
        })
      );

      const tournamentInfo: TournamentInfoModel = {
        tournament,
        formats: formatInfos
      };

      res.status(200).json(tournamentInfo);
    } catch (error) {
      console.error('Error getting tournament info:', error);
      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  public async add(req: Request, res: Response): Promise<void> {
    try {
      const { tournament, formats } = req.body as CreateTournamentRequest;
      
      // Set owner ID from authenticated user
      tournament.ownerId = req.user!.userId;
      
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
      const groupTeamModels = req.body as GroupTeamModel[];

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

          // Generate and save matches for this group
          const groupTeamModel = {
            group: createdGroup,
            teams: createdTeams
          };
          const matches = await this.matchGeneratorService.generateAndSaveGroupMatches(groupTeamModel);

          return {
            group: createdGroup,
            teams: createdTeams,
            matches
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

  public async getTournamentMatches(req: Request, res: Response): Promise<void> {
    try {
      const tournamentId = parseInt(req.params.tournamentId);

      // Get formats for this tournament
      const formats = await this.formatService.getFormatsByTournamentId(tournamentId);

      // Get matches for each format
      const formatMatches = await Promise.all(
        formats.map(async format => {
          const groups = await this.groupService.getGroupsByFormatId(format.formatId!);
          
          // Get teams and matches for each group
          const groupMatches = await Promise.all(
            groups.map(async group => {
              const teams = await this.teamService.getTeamsByGroupId(group.groupId!);
              const matches = await this.matchService.getMatchesByGroupId(group.groupId!);
              
              return {
                groupAndTeam: {
                  group,
                  teams
                },
                matches
              } as GroupMatchModel;
            })
          );

          return {
            format,
            groupMatches
          } as FormatMatchModel;
        })
      );

      res.status(200).json(formatMatches);
    } catch (error) {
      console.error('Error getting tournament matches:', error);
      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
} 