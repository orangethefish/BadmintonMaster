import { BestOf, WinningCondition, PlayOffFormat } from '../enums/tournament.enum';
import { FormatModel } from './format.model';
import { GroupTeamModel } from './group.model';

export interface TournamentModel {
  tournamentId?: number;
  ownerId: string;
  name: string;
  description: string;
  deleted?: boolean;
  dateCreated?: string;
  dateModified?: string;
  dateDeleted?: string | null;
  startDate: string;
  endDate: string;
  invitationCode?: number;
}

export interface FormatInfoModel{
  format: FormatModel,
  groupsAndTeams: GroupTeamModel[],
}

export interface TournamentInfoModel{
    tournament: TournamentModel,
    formats: FormatInfoModel[]
}