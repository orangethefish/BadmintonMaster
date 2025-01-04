'use client'

import { useTranslations } from 'next-intl';
import { MatchModel, TeamModel } from '@/data-models/tournament.model';

interface MatchListProps {
  matches: MatchModel[];
  teams: TeamModel[];
}

export function MatchList({ matches, teams }: MatchListProps) {
  const t = useTranslations('Tournament');

  const getTeamName = (teamId: string) => {
    return teams.find(team => team.id === teamId)?.name || 'Unknown Team';
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
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {matches.map((match) => (
            <tr key={match.id}>
              <td className="py-4 pl-4 pr-3 text-sm sm:pl-6">
                <div className="font-medium text-gray-900">{getTeamName(match.team1Id)}</div>
                <div className="font-medium text-gray-900 mt-1">{getTeamName(match.team2Id)}</div>
              </td>
              <td className="px-3 py-4 text-sm text-gray-500">
                {match.score1 !== undefined && match.score2 !== undefined ? (
                  <div>
                    <div>{match.score1}</div>
                    <div>{match.score2}</div>
                  </div>
                ) : (
                  '-'
                )}
              </td>
              <td className="px-3 py-4 text-sm text-gray-500">
                {t(`matchStatus.${match.status}`)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 