import { BaseApiService } from '../api/base.service';
import { TournamentModel } from '@/data-models/tournament.model';
import { CreateTournamentRequest } from '@/types/tournament.types';

export class TournamentService extends BaseApiService {
  private readonly endpoint = '/tournaments';

  async createTournament(request: CreateTournamentRequest): Promise<TournamentModel> {
    return this.post<TournamentModel>(this.endpoint, request);
  }

  async getTournament(id: number): Promise<TournamentModel> {
    return this.get<TournamentModel>(`${this.endpoint}/${id}`);
  }

  async updateTournament(id: number, tournament: Partial<TournamentModel>): Promise<TournamentModel> {
    return this.put<TournamentModel>(`${this.endpoint}/${id}`, tournament);
  }

  async deleteTournament(id: number): Promise<void> {
    return this.delete<void>(`${this.endpoint}/${id}`);
  }

  async joinTournament(code: string): Promise<TournamentModel> {
    return this.post<TournamentModel>(`${this.endpoint}/join`, { code });
  }
} 