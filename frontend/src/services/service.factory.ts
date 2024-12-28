import { TournamentService } from './tournament/tournament.service';

export class ServiceFactory {
  private static tournamentService: TournamentService;

  static getTournamentService(): TournamentService {
    if (!this.tournamentService) {
      this.tournamentService = new TournamentService();
    }
    return this.tournamentService;
  }
} 