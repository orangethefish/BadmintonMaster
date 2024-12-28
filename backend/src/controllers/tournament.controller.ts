import { Request, Response } from 'express';
import { TournamentModel } from '../data-models/tournament.model';
import { TournamentService } from '../services/tournament.service';

export class TournamentController {
  private tournamentService: TournamentService;

  constructor() {
    this.tournamentService = new TournamentService();
  }

  public async add(req: Request, res: Response): Promise<void> {
    try {
      const tournament: TournamentModel = req.body;
      const createdTournament = await this.tournamentService.addTournament(tournament);
      res.status(201).json(createdTournament);
    } catch (error) {
      console.error('Error in add tournament:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
} 