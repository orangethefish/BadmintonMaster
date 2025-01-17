import { Request, Response, Router } from 'express';
import { MatchService } from '../services/match.service';
import { FormatService } from '../services/format.service';
import { TeamService } from '../services/team.service';
import { verifyToken } from '../middleware/auth.middleware';
import { MatchStatus } from '../enums/match.enum';
import { TeamModel } from '../data-models/team.model';
import { MatchModel } from '../data-models/match.model';

interface UpdateMatchScoreRequest {
  team1Score: number;
  team2Score: number;
  result: MatchStatus;
}

interface MatchDetails {
  match: MatchModel;
  team1: TeamModel;
  team2: TeamModel;
}

export class MatchController {
  private matchService: MatchService;
  private formatService: FormatService;
  private teamService: TeamService;
  public router: Router;

  constructor() {
    this.matchService = new MatchService();
    this.formatService = new FormatService();
    this.teamService = new TeamService();
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // Assign umpire to match
    this.router.post('/:matchId', verifyToken, this.assignUmpire.bind(this));
    
    // Get match format
    this.router.get('/:matchId/format', verifyToken, this.getMatchFormat.bind(this));

    // Get match details
    this.router.get('/:matchId/details', verifyToken, this.getMatchDetails.bind(this));

    // Update match score
    this.router.put('/:matchId/score', verifyToken, this.updateMatchScore.bind(this));
  }

  public async assignUmpire(req: Request, res: Response): Promise<void> {
    try {
      const matchId = req.params.matchId;
      const { umpireId } = req.body;

      if (!umpireId) {
        res.status(400).json({ error: 'Umpire ID is required' });
        return;
      }

      // Get current match state
      const match = await this.matchService.getMatchById(matchId);

      // Check if match already has an umpire
      if (match.umpireId) {
        res.status(200).json(false);
        return;
      }

      // Update match with umpire and change status to in progress
      const updatedMatch = await this.matchService.updateMatch({
        ...match,
        umpireId,
        result: MatchStatus.IN_PROGRESS
      });

      res.status(200).json(true);
    } catch (error) {
      console.error('Error assigning umpire to match:', error);
      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  public async getMatchFormat(req: Request, res: Response): Promise<void> {
    try {
      const matchId = req.params.matchId;

      // Get match details
      const match = await this.matchService.getMatchById(matchId);

      // Get format details
      const format = await this.formatService.getFormatById(match.formatId);

      // Include format in match response
      const matchWithFormat = {
        ...match,
        format
      };

      res.status(200).json(matchWithFormat);
    } catch (error) {
      console.error('Error getting match format:', error);
      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  public async getMatchDetails(req: Request, res: Response): Promise<void> {
    try {
      const matchId = req.params.matchId;

      // Get match details
      const match = await this.matchService.getMatchById(matchId);

      // Get team details
      const [team1, team2] = await Promise.all([
        match.team1Id ? this.teamService.getTeamById(match.team1Id) : null,
        match.team2Id ? this.teamService.getTeamById(match.team2Id) : null
      ]);

      if (!team1 || !team2) {
        res.status(404).json({ error: 'One or both teams not found' });
        return;
      }

      const matchDetails: MatchDetails = {
        match,
        team1,
        team2
      };

      res.status(200).json(matchDetails);
    } catch (error) {
      console.error('Error getting match details:', error);
      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  public async updateMatchScore(req: Request, res: Response): Promise<void> {
    try {
      const matchId = req.params.matchId;
      const { team1Score, team2Score, result } = req.body as UpdateMatchScoreRequest;

      // Validate request body
      if (team1Score === undefined || team2Score === undefined || !result) {
        res.status(400).json({ error: 'Team scores and result are required' });
        return;
      }

      // Get current match state
      const match = await this.matchService.getMatchById(matchId);

      // Verify the user is the assigned umpire
      if (match.umpireId !== req.user!.userId) {
        res.status(403).json({ error: 'Only the assigned umpire can update match scores' });
        return;
      }

      // Verify match is in progress
      if (match.result !== MatchStatus.IN_PROGRESS) {
        res.status(400).json({ error: 'Can only update scores for matches that are in progress' });
        return;
      }

      // Validate result matches the scores
      if ((result === MatchStatus.TEAM1_WINS && team1Score <= team2Score) ||
          (result === MatchStatus.TEAM2_WINS && team2Score <= team1Score)) {
        res.status(400).json({ error: 'Match result does not match the scores' });
        return;
      }

      // Determine winner based on result
      const winnerId = result === MatchStatus.TEAM1_WINS ? match.team1Id : 
                      result === MatchStatus.TEAM2_WINS ? match.team2Id : 
                      undefined;

      // Update match with scores and result
      const updatedMatch = await this.matchService.updateMatch({
        ...match,
        team1FinalScore: team1Score,
        team2FinalScore: team2Score,
        result,
        winnerId
      });

      res.status(200).json(updatedMatch);
    } catch (error) {
      console.error('Error updating match score:', error);
      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
}
