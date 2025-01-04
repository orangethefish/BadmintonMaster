'use client'

import { useTranslations } from 'next-intl';
import { ServiceFactory } from '@/services/service.factory';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { NotificationService } from '@/services/notification/notification.service';
import { MatchStatus } from '@/data-models/match.model';
import { MatchModel } from '@/data-models/match.model';
import { TeamModel } from '@/data-models/team.model';

interface MatchListProps {
  matches: MatchModel[];
  teams: TeamModel[];
}

export function MatchList({ matches, teams }: MatchListProps) {
  const t = useTranslations('Tournament');
  const tournamentService = ServiceFactory.getTournamentService();
  const authService = ServiceFactory.getAuthService();
  const [user, setUser] = useState(authService.getUser());
  const router = useRouter();

  useEffect(() => {
    const user = authService.getUser();
    setUser(user);
  }, []);

  const getTeamName = (teamId: number) => {
    const team = teams.find(team => team.teamId === teamId);
    let res = "Unknown"
    if (team) {
      res = `${team?.player1Name} ${team?.player2Name}`;
    }
    return res.trim();
  };

  const handleOperateMatch = async (matchId: string) => {
    if (user) {
      const response = await tournamentService.assignUmpireToMatch(Number(matchId), user?.userId);
      if (response) {
        NotificationService.success('Umpire assigned successfully');
        router.push(`/match/${matchId}`);
      } else {
        NotificationService.error('An umpire is already assigned to this match');
        router.refresh();
      }
    } else {
      NotificationService.error('Please login to assign umpire');
    }
  };

  return (
    <div className="overflow-hidden bg-white shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
              Teams
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Score
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Status
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {matches.map((match) => (
            <tr key={match.matchId}>
              <td className="py-4 pl-4 pr-3 text-sm sm:pl-6">
                <div className="font-medium text-gray-900">{getTeamName(match.team1Id)}</div>
                <div className="font-medium text-gray-900 mt-1">{getTeamName(match.team2Id)}</div>
              </td>
              <td className="px-3 py-4 text-sm text-gray-500">
                {match.team1Score !== undefined && match.team2Score !== undefined ? (
                  <div>
                    <div>{match.team1Score}</div>
                    <div>{match.team2Score}</div>
                  </div>
                ) : (
                  '-'
                )}
              </td>
              <td className="px-3 py-4 text-sm text-gray-500">
                {match.result === MatchStatus.PENDING ? t('matchStatus.pending') :
                  match.result === MatchStatus.IN_PROGRESS ? t('matchStatus.inProgress') :
                    match.result >= MatchStatus.TEAM1_WINS ? t('matchStatus.completed') :
                      t('matchStatus.cancelled')}
              </td>
              {match.result === MatchStatus.PENDING && <td className="px-3 py-4 text-sm text-black">
                <button onClick={() => handleOperateMatch(match.matchId ?? "")} className='bg-emerald-500 rounded p-3'>{t(`operateMatch`)}</button>
              </td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 