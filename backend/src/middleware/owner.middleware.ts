import { Request, Response, NextFunction } from 'express';
import { TournamentService } from '../services/tournament.service';

export class OwnerMiddleware {
  private tournamentService: TournamentService;

  constructor() {
    this.tournamentService = new TournamentService();
  }

  public verifyTournamentOwner = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tournamentId = parseInt(req.params.tournamentId);
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const tournament = await this.tournamentService.getTournamentById(tournamentId);
      
      if (tournament.ownerId !== userId) {
        return res.status(403).json({ error: 'Access denied. You are not the owner of this tournament.' });
      }

      next();
    } catch (error) {
      console.error('Error verifying tournament owner:', error);
      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  };
} 