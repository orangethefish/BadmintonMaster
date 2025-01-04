import { TournamentService } from './tournament/tournament.service';
import { AuthService } from './auth/auth.service';
import { MatchService } from './match/match.service';

export class ServiceFactory {
  private static tournamentService: TournamentService;
  private static authService: AuthService;
  private static matchService: MatchService;

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

  static getMatchService(): MatchService {
    if (!this.matchService) {
      this.matchService = new MatchService();
    }
    return this.matchService;
  }
}