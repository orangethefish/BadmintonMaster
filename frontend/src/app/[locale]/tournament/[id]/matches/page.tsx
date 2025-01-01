'use client'

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { NotificationService } from '@/services/notification/notification.service';
import { ServiceFactory } from '@/services/service.factory';
import { FormatMatchModel, GroupMatchModel, MatchStatus } from '@/data-models/match.model';
import { FormatType } from '@/enums/tournament.enum';
import Link from 'next/link';

export default function TournamentMatchesPage() {
  const t = useTranslations('Tournament');
  const params = useParams();
  const [formatMatches, setFormatMatches] = useState<FormatMatchModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFormatIndex, setActiveFormatIndex] = useState(0);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const tournamentService = ServiceFactory.getTournamentService();
        const response = await tournamentService.getMatches(Number(params.id));
        setFormatMatches(response);
      } catch (error) {
        NotificationService.error(t('errors.fetchFailed'));
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#39846d]"></div>
      </div>
    );
  }

  if (!formatMatches.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">{t('errors.noMatches')}</div>
      </div>
    );
  }

  const activeFormat = formatMatches[activeFormatIndex];

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-[#39846d] text-white px-8 py-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">{t('sections.matches')}</h1>
              <Link
                href={`/tournament/${params.id}/overview`}
                className="inline-flex items-center px-4 py-2 border border-white rounded-md text-sm font-medium hover:bg-white hover:text-[#39846d] transition-colors duration-200"
              >
                {t('backToOverview')}
              </Link>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Format Tabs */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                {formatMatches.map((formatMatch, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setActiveFormatIndex(index)}
                    className={`
                      whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                      ${activeFormatIndex === index
                        ? 'border-[#39846d] text-[#39846d]'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    {formatMatch.format.formatType === FormatType.MEN_SINGLES ? t('formats.MEN_SINGLES') :
                     formatMatch.format.formatType === FormatType.WOMEN_SINGLES ? t('formats.WOMEN_SINGLES') :
                     formatMatch.format.formatType === FormatType.MEN_DOUBLES ? t('formats.MEN_DOUBLES') :
                     formatMatch.format.formatType === FormatType.WOMEN_DOUBLES ? t('formats.WOMEN_DOUBLES') :
                     t('formats.MIXED_DOUBLES')}
                  </button>
                ))}
              </nav>
            </div>

            {/* Matches Grid */}
            <div className="space-y-8">
              {activeFormat.groupMatches.map((groupMatch: GroupMatchModel, groupIndex: number) => (
                <div key={groupIndex} className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900">{groupMatch.groupAndTeam.group.groupName}</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {groupMatch.matches.map((match, matchIndex) => {
                      const team1 = groupMatch.groupAndTeam.teams.find(t => t.teamId === match.team1Id);
                      const team2 = groupMatch.groupAndTeam.teams.find(t => t.teamId === match.team2Id);
                      
                      return (
                        <div key={matchIndex} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="text-lg font-medium text-gray-900">
                                {team1?.player1Name}
                                {team1?.player2Name && ` & ${team1.player2Name}`}
                              </div>
                            </div>
                            <div className="px-4 flex items-center space-x-4">
                              <span className={`text-2xl font-bold ${match.status >= MatchStatus.TEAM1_WINS ? 'text-gray-900' : 'text-gray-400'}`}>
                                {match.team1Score ?? '-'}
                              </span>
                              <span className="text-gray-400">vs</span>
                              <span className={`text-2xl font-bold ${match.status >= MatchStatus.TEAM1_WINS ? 'text-gray-900' : 'text-gray-400'}`}>
                                {match.team2Score ?? '-'}
                              </span>
                            </div>
                            <div className="flex-1 text-right">
                              <div className="text-lg font-medium text-gray-900">
                                {team2?.player1Name}
                                {team2?.player2Name && ` & ${team2.player2Name}`}
                              </div>
                            </div>
                          </div>
                          {match.startTime && (
                            <div className="mt-2 text-sm text-gray-500">
                              {new Date(match.startTime).toLocaleString()}
                            </div>
                          )}
                          <div className="mt-2">
                            <span className={`
                              inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                              ${match.status === MatchStatus.PENDING ? 'bg-gray-100 text-gray-800' :
                                match.status === MatchStatus.IN_PROGRESS ? 'bg-blue-100 text-blue-800' :
                                match.status >= MatchStatus.TEAM1_WINS ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                              }
                            `}>
                              {match.status === MatchStatus.PENDING ? t('matchStatus.pending') :
                               match.status === MatchStatus.IN_PROGRESS ? t('matchStatus.inProgress') :
                               match.status >= MatchStatus.TEAM1_WINS ? t('matchStatus.completed') :
                               t('matchStatus.cancelled')}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 