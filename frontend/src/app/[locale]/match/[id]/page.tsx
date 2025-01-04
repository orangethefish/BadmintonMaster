'use client'

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ServiceFactory } from '@/services/service.factory';
import { NotificationService } from '@/services/notification/notification.service';
import { MatchModel, MatchStatus } from '@/data-models/match.model';
import { TeamModel } from '@/data-models/team.model';
import { FormatModel } from '@/data-models/format.model';
import { BestOf, WinningCondition } from '@/enums/tournament.enum';

interface Player {
  id: number;
  name: string;
}

interface MatchState {
  team1Players: Player[];
  team2Players: Player[];
  server?: Player;
  receiver?: Player;
  team1Score: number;
  team2Score: number;
  history: {
    team1Score: number;
    team2Score: number;
    server?: Player;
    receiver?: Player;
  }[];
}

export default function MatchOperationPage() {
  const t = useTranslations('Tournament');
  const router = useRouter();
  const params = useParams();
  const matchId = params.id as string;
  const [match, setMatch] = useState<MatchModel | null>(null);
  const [team1, setTeam1] = useState<TeamModel | null>(null);
  const [team2, setTeam2] = useState<TeamModel | null>(null);
  const [format, setFormat] = useState<FormatModel | null>(null);
  const [matchState, setMatchState] = useState<MatchState>({
    team1Players: [],
    team2Players: [],
    team1Score: 0,
    team2Score: 0,
    history: []
  });

  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        const tournamentService = ServiceFactory.getTournamentService();
        const [matchDetails, formatDetails] = await Promise.all([
          tournamentService.getMatchDetails(matchId),
          tournamentService.getMatchFormat(matchId)
        ]);

        setMatch(matchDetails.match);
        setTeam1(matchDetails.team1);
        setTeam2(matchDetails.team2);
        setFormat(formatDetails);

        // Initialize players and scores
        if (matchDetails.team1 && matchDetails.team2) {
          const team1Players: Player[] = [
            { id: 1, name: matchDetails.team1.player1Name },
            ...(matchDetails.team1.player2Name ? [{ id: 2, name: matchDetails.team1.player2Name }] : [])
          ];
          const team2Players: Player[] = [
            { id: 3, name: matchDetails.team2.player1Name },
            ...(matchDetails.team2.player2Name ? [{ id: 4, name: matchDetails.team2.player2Name }] : [])
          ];
          setMatchState(prev => ({
            ...prev,
            team1Players,
            team2Players,
            team1Score: matchDetails.match.team1Score || 0,
            team2Score: matchDetails.match.team2Score || 0
          }));
        }
      } catch (error) {
        NotificationService.error(t('errors.fetchFailed'));
      }
    };

    fetchMatchDetails();
  }, [matchId]);

  const handleSelectServer = (player: Player) => {
    setMatchState(prev => ({
      ...prev,
      server: player
    }));
  };

  const handleSelectReceiver = (player: Player) => {
    setMatchState(prev => ({
      ...prev,
      receiver: player
    }));
  };

  const checkWinningCondition = (team1Score: number, team2Score: number): MatchStatus | null => {
    if (!format) return null;

    const maxScore = format.groupMaxScore;
    const targetScore = format.groupScore;
    const winningCondition = format.groupWinningCondition;

    // Check if either team has reached the maximum score
    if (team1Score >= maxScore || team2Score >= maxScore) {
      return team1Score > team2Score ? MatchStatus.TEAM1_WINS : MatchStatus.TEAM2_WINS;
    }

    // For exact score winning condition
    if (winningCondition === WinningCondition.EXACT) {
      if (team1Score === targetScore) return MatchStatus.TEAM1_WINS;
      if (team2Score === targetScore) return MatchStatus.TEAM2_WINS;
    }
    // For two points difference winning condition
    else if (winningCondition === WinningCondition.TWO_POINTS_DIFFERENCE) {
      if (team1Score >= targetScore && team1Score - team2Score >= 2) return MatchStatus.TEAM1_WINS;
      if (team2Score >= targetScore && team2Score - team1Score >= 2) return MatchStatus.TEAM2_WINS;
    }

    return null;
  };

  const handleScore = async (team: 'team1' | 'team2') => {
    if (!matchState.server || !matchState.receiver) {
      NotificationService.error('Please select server and receiver first');
      return;
    }

    try {
      const newTeam1Score = team === 'team1' ? matchState.team1Score + 1 : matchState.team1Score;
      const newTeam2Score = team === 'team2' ? matchState.team2Score + 1 : matchState.team2Score;

      const matchResult = checkWinningCondition(newTeam1Score, newTeam2Score);

      const newState = {
        ...matchState,
        team1Score: newTeam1Score,
        team2Score: newTeam2Score,
        history: [
          ...matchState.history,
          {
            team1Score: matchState.team1Score,
            team2Score: matchState.team2Score,
            server: matchState.server,
            receiver: matchState.receiver
          }
        ]
      };

      const tournamentService = ServiceFactory.getTournamentService();
      await tournamentService.updateMatchScore(matchId, {
        team1Score: newTeam1Score,
        team2Score: newTeam2Score,
        result: matchResult || MatchStatus.IN_PROGRESS
      });

      setMatchState(newState);

      if (matchResult) {
        NotificationService.success(
          matchResult === MatchStatus.TEAM1_WINS
            ? 'Team 1 wins the match!'
            : 'Team 2 wins the match!'
        );
      }
    } catch (error) {
      NotificationService.error(t('errors.updateFailed'));
    }
  };

  const handleUndo = async () => {
    if (matchState.history.length === 0) return;

    try {
      const lastState = matchState.history[matchState.history.length - 1];
      const tournamentService = ServiceFactory.getTournamentService();
      await tournamentService.updateMatchScore(matchId, {
        team1Score: lastState.team1Score,
        team2Score: lastState.team2Score,
        result: MatchStatus.IN_PROGRESS
      });

      setMatchState({
        ...matchState,
        team1Score: lastState.team1Score,
        team2Score: lastState.team2Score,
        server: lastState.server,
        receiver: lastState.receiver,
        history: matchState.history.slice(0, -1)
      });
    } catch (error) {
      NotificationService.error(t('errors.updateFailed'));
    }
  };

  if (!match || !team1 || !team2 || !format) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-2 border-[#39846d]"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-[#39846d] text-white px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Match Operation</h1>
                <div className="mt-2 text-sm">
                  {format.groupBestOf === BestOf.ONE ? 'Best of 1' :
                   format.groupBestOf === BestOf.THREE ? 'Best of 3' :
                   format.groupBestOf === BestOf.FIVE ? 'Best of 5' : 'Unknown format'} •{' '}
                  {format.groupWinningCondition === WinningCondition.EXACT ? 'Exact Score' : 'Two Points Difference'} •{' '}
                  Target: {format.groupScore} • Max: {format.groupMaxScore}
                </div>
              </div>
              <button
                onClick={() => router.back()}
                className="px-4 py-2 border border-white rounded-md text-sm font-medium hover:bg-white hover:text-[#39846d] transition-colors duration-200"
              >
                Back
              </button>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Score Display */}
            <div className="flex justify-center items-center space-x-8 text-4xl font-bold">
              <div className="text-center">
                <div>{team1.player1Name}</div>
                {team1.player2Name && <div>{team1.player2Name}</div>}
                <div className="mt-2 text-6xl">{matchState.team1Score}</div>
              </div>
              <div className="text-gray-400">vs</div>
              <div className="text-center">
                <div>{team2.player1Name}</div>
                {team2.player2Name && <div>{team2.player2Name}</div>}
                <div className="mt-2 text-6xl">{matchState.team2Score}</div>
              </div>
            </div>

            {/* Server/Receiver Selection */}
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium mb-4">Select Server</h3>
                <div className="space-y-2">
                  {[...matchState.team1Players, ...matchState.team2Players].map(player => (
                    <button
                      key={player.id}
                      onClick={() => handleSelectServer(player)}
                      className={`w-full p-2 rounded ${
                        matchState.server?.id === player.id
                          ? 'bg-[#39846d] text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {player.name}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-4">Select Receiver</h3>
                <div className="space-y-2">
                  {[...matchState.team1Players, ...matchState.team2Players]
                    .filter(player => player.id !== matchState.server?.id)
                    .map(player => (
                      <button
                        key={player.id}
                        onClick={() => handleSelectReceiver(player)}
                        className={`w-full p-2 rounded ${
                          matchState.receiver?.id === player.id
                            ? 'bg-[#39846d] text-white'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        {player.name}
                      </button>
                    ))}
                </div>
              </div>
            </div>

            {/* Current Server/Receiver Display */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-center space-y-2">
                <div>
                  <span className="font-medium">Current Server:</span>{' '}
                  {matchState.server?.name || 'Not selected'}
                </div>
                <div>
                  <span className="font-medium">Current Receiver:</span>{' '}
                  {matchState.receiver?.name || 'Not selected'}
                </div>
              </div>
            </div>

            {/* Scoring Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleScore('team1')}
                className="bg-blue-500 text-white py-4 px-6 rounded-lg text-lg font-medium hover:bg-blue-600"
              >
                Point for Team 1
              </button>
              <button
                onClick={() => handleScore('team2')}
                className="bg-blue-500 text-white py-4 px-6 rounded-lg text-lg font-medium hover:bg-blue-600"
              >
                Point for Team 2
              </button>
            </div>

            {/* Undo Button */}
            <div className="flex justify-center">
              <button
                onClick={handleUndo}
                disabled={matchState.history.length === 0}
                className={`px-6 py-2 rounded ${
                  matchState.history.length === 0
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-red-500 text-white hover:bg-red-600'
                }`}
              >
                Undo Last Point
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
