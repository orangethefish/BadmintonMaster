import { TournamentModel } from '@/data-models/tournament.model';
import { FormatModel } from '@/data-models/format.model';
import { GroupModel } from '@/data-models/group.model';
import { TeamModel } from '@/data-models/team.model';

export interface TournamentRequest {
  tournament: TournamentModel;
  formats: FormatModel[];
  groups: GroupModel[];
  teams: TeamModel[];
} 