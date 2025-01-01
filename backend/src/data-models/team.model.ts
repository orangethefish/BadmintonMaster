export interface TeamModel {
  teamId?: number;
  groupId: number;
  player1Name: string;
  player2Name?: string;
  deleted?: boolean;
  dateCreated?: string;
  dateModified?: string;
  dateDeleted?: string | null;
} 