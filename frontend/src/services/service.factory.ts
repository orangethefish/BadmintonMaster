import { TournamentService } from './tournament/tournament.service';
import { AuthService } from './auth/auth.service';

export class ServiceFactory {
  private static tournamentService: TournamentService;
  private static authService: AuthService;

  static getTournamentService(): TournamentService {
    if (!this.tournamentService) {
      this.tournamentService = new TournamentService();
    }
    return this.tournamentService;
  }

  static getAuthService(): AuthService {
    if (!this.authService) {
      this.authService = new AuthService();
    }
    return this.authService;
  }
} 