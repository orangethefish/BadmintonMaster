'use client'

import { useEffect, useState } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import { NotificationService } from '@/services/notification/notification.service';
import { ServiceFactory } from '@/services/service.factory';
import { TournamentInfoModel, FormatInfoModel } from '@/data-models/tournament.model';
import { GroupTeamModel } from '@/data-models/group.model';
import { FormatType } from '@/enums/tournament.enum';
import Link from 'next/link';

export default function TournamentOverviewPage() {
  const t = useTranslations('Tournament');
  const params = useParams();
  const searchParams = useSearchParams();
  const invitationCode = searchParams.get('invitationCode');
  const [tournamentInfo, setTournamentInfo] = useState<TournamentInfoModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeFormatIndex, setActiveFormatIndex] = useState(0);
  let hasDisplayedNotification = false;

  useEffect(() => {
    const fetchTournamentInfo = async () => {
      try {
        const tournamentService = ServiceFactory.getTournamentService();
        const response = await tournamentService.getTournamentInfo(Number(params.id));
        setTournamentInfo(response);
      } catch (error) {
        NotificationService.error(t('errors.fetchFailed'));
      } finally {
        setLoading(false);
      }
    };

    fetchTournamentInfo();
  }, [params.id]);

  useEffect(() => {
    if (invitationCode && !hasDisplayedNotification) {
      hasDisplayedNotification = true;
      toast.custom(
        <div className="bg-[#39846d] text-white px-6 py-4 rounded-lg shadow-lg">
          <div className="flex flex-col">
            <span className="font-semibold text-lg">{t('notifications.tournamentCreated')}</span>
            <div className="mt-3 flex items-center space-x-2">
              <span className="font-mono bg-white/20 px-3 py-1.5 rounded text-lg">{invitationCode}</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(invitationCode);
                  toast.success(t('notifications.codeCopied'));
                }}
                className="ml-2 p-2 hover:bg-white/20 rounded transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
              </button>
            </div>
          </div>
        </div>,
        {
          duration: 5000,
          position: 'top-right',
        }
      );
    }
  }, [invitationCode, t]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#39846d]"></div>
      </div>
    );
  }

  if (!tournamentInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">{t('errors.notFound')}</div>
      </div>
    );
  }

  const { tournament, formats } = tournamentInfo;
  const activeFormat = formats[activeFormatIndex];

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-[#39846d] text-white px-8 py-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">{tournament.name}</h1>
              <Link
                href={`/tournament/${params.id}/matches`}
                className="inline-flex items-center px-4 py-2 border border-white rounded-md text-sm font-medium hover:bg-white hover:text-[#39846d] transition-colors duration-200"
              >
                {t('viewMatches')}
              </Link>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Tournament Info Section */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">{t('sections.basicInfo')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">{t('fields.description')}</h3>
                  <p className="mt-1 text-lg text-gray-900">{tournament.description}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">{t('fields.dates')}</h3>
                  <p className="mt-1 text-lg text-gray-900">
                    {new Date(tournament.startDate).toLocaleDateString()} - {new Date(tournament.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </section>

            {/* Formats Section */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">{t('sections.formats')}</h2>
              <div className="grid grid-cols-1 gap-6">
                {formats.map((formatInfo: FormatInfoModel, index: number) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-xl font-medium text-gray-900 mb-4">
                      {formatInfo.format.formatType === FormatType.MEN_SINGLES ? t('formats.MEN_SINGLES') :
                       formatInfo.format.formatType === FormatType.WOMEN_SINGLES ? t('formats.WOMEN_SINGLES') :
                       formatInfo.format.formatType === FormatType.MEN_DOUBLES ? t('formats.MEN_DOUBLES') :
                       formatInfo.format.formatType === FormatType.WOMEN_DOUBLES ? t('formats.WOMEN_DOUBLES') :
                       t('formats.MIXED_DOUBLES')}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">{t('fields.numOfGroups')}</h4>
                        <p className="mt-1 text-lg text-gray-900">{formatInfo.format.numOfGroups}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">{t('fields.groupScore')}</h4>
                        <p className="mt-1 text-lg text-gray-900">{formatInfo.format.groupScore}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">{t('fields.playOffScore')}</h4>
                        <p className="mt-1 text-lg text-gray-900">{formatInfo.format.playOffScore}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Groups and Teams Section */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">{t('sections.groupsAndTeams')}</h2>
              
              {/* Format Tabs */}
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                  {formats.map((formatInfo: FormatInfoModel, index: number) => (
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
                      {formatInfo.format.formatType === FormatType.MEN_SINGLES ? t('formats.MEN_SINGLES') :
                       formatInfo.format.formatType === FormatType.WOMEN_SINGLES ? t('formats.WOMEN_SINGLES') :
                       formatInfo.format.formatType === FormatType.MEN_DOUBLES ? t('formats.MEN_DOUBLES') :
                       formatInfo.format.formatType === FormatType.WOMEN_DOUBLES ? t('formats.WOMEN_DOUBLES') :
                       t('formats.MIXED_DOUBLES')}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Groups Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeFormat.groupsAndTeams.map((groupTeam: GroupTeamModel, index: number) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-xl font-medium text-gray-900 mb-4">{groupTeam.group.groupName}</h3>
                    <div className="space-y-4">
                      {groupTeam.teams.map((team, teamIndex: number) => (
                        <div key={teamIndex} className="flex items-center space-x-4 p-2 bg-white rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{team.player1Name}</p>
                            {team.player2Name && (
                              <p className="text-gray-600">{team.player2Name}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
} 