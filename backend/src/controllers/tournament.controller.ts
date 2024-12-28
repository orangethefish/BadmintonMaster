import { Request, Response } from 'express';
import { TournamentModel } from '../data-models/tournament.model';
import { FormatModel } from '../data-models/format.model';
import { TournamentService } from '../services/tournament.service';
import { FormatService } from '../services/format.service';

interface CreateTournamentRequest {
  tournament: TournamentModel;
  formats: FormatModel[];
}

export class TournamentController {
  private tournamentService: TournamentService;
  private formatService: FormatService;

  constructor() {
    this.tournamentService = new TournamentService();
    this.formatService = new FormatService();
  }

  public async add(req: Request, res: Response): Promise<void> {
    try {
      const { tournament, formats } = req.body as CreateTournamentRequest;
      
      // Create tournament first
      const createdTournament = await this.tournamentService.addTournament(tournament);

      // Create formats with the tournament ID
      const createdFormats = await Promise.all(
        formats.map(format => {
          format.tournamentId = createdTournament.tournamentId!;
          return this.formatService.addFormat(format);
        })
      );

      // Return tournament with its formats
      res.status(201).json({
        ...createdTournament,
        formats: createdFormats
      });
    } catch (error) {
      console.error('Error in add tournament:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
} 