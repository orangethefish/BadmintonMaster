'use client'

import { useEffect, useState } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import { NotificationService } from '@/services/notification/notification.service';
import { ServiceFactory } from '@/services/service.factory';
import { TournamentInfoModel } from '@/data-models/tournament.model';
import { FormatModel } from '@/data-models/format.model';
import { GroupTeamModel } from '@/data-models/group.model';
import { FormatType } from '@/enums/tournament.enum';

export default function TournamentDetailPage() {
  const t = useTranslations('Tournament');
  const params = useParams();
  const searchParams = useSearchParams();
  const invitationCode = searchParams.get('invitationCode');
  const [tournamentInfo, setTournamentInfo] = useState<TournamentInfoModel | null>(null);
  const [loading, setLoading] = useState(true);

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
    if (invitationCode) {
      toast(
        () => (
          <div className="flex flex-col text-white">
            <span>{t('notifications.tournamentCreated')}</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(invitationCode);
                NotificationService.success(t('notifications.codeCopied'));
              }}
              className="mt-2 text-left text-sm hover:text-white/80"
            >
              {t('notifications.clickToCopy')}: <span className="font-mono bg-white/20 px-2 py-1 rounded">{invitationCode}</span>
            </button>
          </div>
        ),
        {
          duration: 10000,
          className: 'bg-[#39846d]',
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

  const { tournament, formats, groupTeams } = tournamentInfo;

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-[#39846d] text-white px-8 py-6">
            <h1 className="text-3xl font-bold text-center">{tournament.name}</h1>
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
                {formats.map((format: FormatModel, index: number) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-xl font-medium text-gray-900 mb-4">
                      {format.formatType === FormatType.MEN_SINGLES ? t('formats.MEN_SINGLES') :
                       format.formatType === FormatType.WOMEN_SINGLES ? t('formats.WOMEN_SINGLES') :
                       format.formatType === FormatType.MEN_DOUBLES ? t('formats.MEN_DOUBLES') :
                       format.formatType === FormatType.WOMEN_DOUBLES ? t('formats.WOMEN_DOUBLES') :
                       t('formats.MIXED_DOUBLES')}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">{t('fields.numOfGroups')}</h4>
                        <p className="mt-1 text-lg text-gray-900">{format.numOfGroups}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">{t('fields.groupScore')}</h4>
                        <p className="mt-1 text-lg text-gray-900">{format.groupScore}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">{t('fields.playOffScore')}</h4>
                        <p className="mt-1 text-lg text-gray-900">{format.playOffScore}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Groups and Teams Section */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">{t('sections.groupsAndTeams')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {groupTeams.map((groupTeam: GroupTeamModel, index: number) => (
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