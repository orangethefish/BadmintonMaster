import { TournamentModel } from '@/data-models/tournament.model';
import { FormatModel } from '@/data-models/format.model';

export interface CreateTournamentRequest {
  tournament: TournamentModel;
  formats: FormatModel[];
} 