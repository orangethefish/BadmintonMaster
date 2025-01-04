'use client'

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { ServiceFactory } from '@/services/service.factory';
import { NotificationService } from '@/services/notification/notification.service';
import { FormatMatchModel } from '@/data-models/match.model';
import { MatchList } from '@/app/[locale]/components/match/MatchList';
import { FormatType } from '@/enums/tournament.enum';
import { MatchModel as UIMatchModel, TeamModel as UITeamModel } from '@/data-models/tournament.model';

function mapToUITeams(teams: { teamId?: number; player1Name: string; player2Name?: string; }[]): UITeamModel[] {
  return teams.map(t => ({
    id: t.teamId?.toString() || '',
    name: t.player2Name ? `${t.player1Name} & ${t.player2Name}` : t.player1Name,
    players: [t.player1Name, ...(t.player2Name ? [t.player2Name] : [])]
  }));
}

function mapToUIMatches(matches: { matchId?: number; team1Id: number; team2Id: number; team1Score?: number; team2Score?: number; result: number; startTime?: string; endTime?: string; }[]): UIMatchModel[] {
  return matches.map(m => ({
    id: m.matchId?.toString() || '',
    team1Id: m.team1Id.toString(),
    team2Id: m.team2Id.toString(),
    score1: m.team1Score,
    score2: m.team2Score,
    status: m.result === 0 ? 'pending' :
           m.result === 1 ? 'inProgress' :
           m.result >= 3 ? 'completed' : 'cancelled',
    startTime: m.startTime,
    endTime: m.endTime
  }));
}

export default function TournamentJoinDetailsPage() {
  const t = useTranslations('Tournament');
  const router = useRouter();
  const params = useParams();
  const invitationCode = params.invitationCode as string;
  const [formatMatches, setFormatMatches] = useState<FormatMatchModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const authService = ServiceFactory.getAuthService();
  const tournamentService = ServiceFactory.getTournamentService();

  useEffect(() => {
    const user = authService.getUser();
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    const fetchMatches = async () => {
      try {
        const data = await tournamentService.getMatchesByInvitationCode(invitationCode);
        setFormatMatches(data);
      } catch (error) {
        NotificationService.error(t('errors.fetchFailed'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatches();
  }, [invitationCode]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-2 border-[#39846d]"></div>
      </div>
    );
  }

  return (
    <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('sections.matches')}</h1>
        </div>

        {formatMatches.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">{t('errors.noMatches')}</p>
          </div>
        ) : (
          <div className="space-y-8">
            {formatMatches.map((formatMatch, index) => (
              <div key={index} className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {formatMatch.format.formatType === FormatType.MEN_SINGLES ? t('formats.MEN_SINGLES') :
                   formatMatch.format.formatType === FormatType.WOMEN_SINGLES ? t('formats.WOMEN_SINGLES') :
                   formatMatch.format.formatType === FormatType.MEN_DOUBLES ? t('formats.MEN_DOUBLES') :
                   formatMatch.format.formatType === FormatType.WOMEN_DOUBLES ? t('formats.WOMEN_DOUBLES') :
                   t('formats.MIXED_DOUBLES')}
                </h2>
                {formatMatch.groupMatches.map((groupMatch, groupIndex) => (
                  <div key={groupIndex} className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {groupMatch.groupAndTeam.group.groupName}
                    </h3>
                    <MatchList 
                      matches={mapToUIMatches(groupMatch.matches)} 
                      teams={mapToUITeams(groupMatch.groupAndTeam.teams)} 
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
} 