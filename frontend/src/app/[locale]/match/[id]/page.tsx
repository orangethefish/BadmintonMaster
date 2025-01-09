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
  currentGame: number;
  games: {
    team1Score: number;
    team2Score: number;
    server?: Player;
    receiver?: Player;
    history: {
      team1Score: number;
      team2Score: number;
      server?: Player;
      receiver?: Player;
    }[];
  }[];
}

export default function MatchOperationPage() {
  const t = useTranslations('Tournament');
  const router = useRouter();
  const params = useParams();
  const matchId = params.id as string;
  const matchService = ServiceFactory.getMatchService();
  const authService = ServiceFactory.getAuthService();
  const [match, setMatch] = useState<MatchModel | null>(null);
  const [team1, setTeam1] = useState<TeamModel | null>(null);
  const [team2, setTeam2] = useState<TeamModel | null>(null);
  const [format, setFormat] = useState<FormatModel | null>(null);
  const [matchState, setMatchState] = useState<MatchState>({
    team1Players: [],
    team2Players: [],
    currentGame: 0,
    games: [{
      team1Score: 0,
      team2Score: 0,
      history: []
    }]
  });

  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        const currentUser = authService.getUser();
        if (!currentUser) {
          NotificationService.error('Please login to operate matches');
          router.push('/');
          return;
        }

        const [matchDetails, formatDetails] = await Promise.all([
          matchService.getMatchDetails(matchId),
          matchService.getMatchFormat(matchId)
        ]);

        // Check if match has an umpire and if it's not the current user
        if (matchDetails.match.umpireId && matchDetails.match.umpireId !== currentUser.userId) {
          NotificationService.error('You are not authorized to operate this match');
          router.push('/');
          return;
        }

        setMatch(matchDetails.match);
        setTeam1(matchDetails.team1);
        setTeam2(matchDetails.team2);
        setFormat(formatDetails?.format ?? null);

        if(formatDetails.result !== MatchStatus.IN_PROGRESS && formatDetails.result !== MatchStatus.PENDING){
            router.back()
        }

        // Initialize players and games
        if (matchDetails.team1 && matchDetails.team2) {
          const team1Players: Player[] = [
            { id: 1, name: matchDetails.team1.player1Name },
            ...(matchDetails.team1.player2Name ? [{ id: 2, name: matchDetails.team1.player2Name }] : [])
          ];
          const team2Players: Player[] = [
            { id: 3, name: matchDetails.team2.player1Name },
            ...(matchDetails.team2.player2Name ? [{ id: 4, name: matchDetails.team2.player2Name }] : [])
          ];

          // Initialize games from match data
          const games = matchDetails.match.game?.map(game => ({
            team1Score: game.team1Score || 0,
            team2Score: game.team2Score || 0,
            history: []
          })) || [{
            team1Score: 0,
            team2Score: 0,
            history: []
          }];

          setMatchState(prev => ({
            ...prev,
            team1Players,
            team2Players,
            currentGame: games.length - 1,
            games
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
      server: player,
      games: prev.games.map((game, index) => 
        index === prev.currentGame 
          ? { ...game, server: player }
          : game
      )
    }));
  };

  const handleSelectReceiver = (player: Player) => {
    setMatchState(prev => ({
      ...prev,
      receiver: player,
      games: prev.games.map((game, index) => 
        index === prev.currentGame 
          ? { ...game, receiver: player }
          : game
      )
    }));
  };

  const checkGameWinningCondition = (team1Score: number, team2Score: number): boolean => {
    if (!format) return false;

    const maxScore = format.groupMaxScore;
    const targetScore = format.groupScore;
    const winningCondition = format.groupWinningCondition;

    // Check if either team has reached the maximum score
    if (team1Score >= maxScore || team2Score >= maxScore) {
      return true;
    }

    // For exact score winning condition
    if (winningCondition === WinningCondition.EXACT) {
      if (team1Score === targetScore || team2Score === targetScore) return true;
    }
    // For two points difference winning condition
    else if (winningCondition === WinningCondition.TWO_POINTS_DIFFERENCE) {
      if ((team1Score >= targetScore && team1Score - team2Score >= 2) ||
          (team2Score >= targetScore && team2Score - team1Score >= 2)) return true;
    }

    return false;
  };

  const checkMatchWinningCondition = (games: MatchState['games']): MatchStatus | null => {
    if (!format) return null;

    const team1Wins = games.filter(game => game.team1Score > game.team2Score).length;
    const team2Wins = games.filter(game => game.team2Score > game.team1Score).length;

    const gamesNeededToWin = format.groupBestOf === BestOf.ONE ? 1 :
                            format.groupBestOf === BestOf.THREE ? 2 :
                            format.groupBestOf === BestOf.FIVE ? 3 : 1;

    if (team1Wins >= gamesNeededToWin) return MatchStatus.TEAM1_WINS;
    if (team2Wins >= gamesNeededToWin) return MatchStatus.TEAM2_WINS;

    return null;
  };

  const handleScore = async (team: 'team1' | 'team2') => {
    if (!matchState.server || !matchState.receiver) {
      NotificationService.error('Please select server and receiver first');
      return;
    }

    try {
      const currentGame = matchState.games[matchState.currentGame];
      const newTeam1Score = team === 'team1' ? currentGame.team1Score + 1 : currentGame.team1Score;
      const newTeam2Score = team === 'team2' ? currentGame.team2Score + 1 : currentGame.team2Score;

      const newGames = [...matchState.games];
      newGames[matchState.currentGame] = {
        ...currentGame,
        team1Score: newTeam1Score,
        team2Score: newTeam2Score,
        history: [
          ...currentGame.history,
          {
            team1Score: currentGame.team1Score,
            team2Score: currentGame.team2Score,
            server: matchState.server,
            receiver: matchState.receiver
          }
        ]
      };

      const gameFinished = checkGameWinningCondition(newTeam1Score, newTeam2Score);
      const matchResult = checkMatchWinningCondition(newGames);

      // If game is finished and match isn't over, start a new game
      if (gameFinished && !matchResult) {
        newGames.push({
          team1Score: 0,
          team2Score: 0,
          history: []
        });
      }

      // Update match score in the database
      await matchService.updateMatchScore(matchId, {
        game: newGames.map(game => ({
          team1Score: game.team1Score,
          team2Score: game.team2Score
        })),
        result: matchResult || MatchStatus.IN_PROGRESS
      });

      setMatchState(prev => ({
        ...prev,
        currentGame: gameFinished && !matchResult ? prev.currentGame + 1 : prev.currentGame,
        games: newGames
      }));

      if (gameFinished) {
        NotificationService.success(
          newTeam1Score > newTeam2Score
            ? 'Team 1 wins the game!'
            : 'Team 2 wins the game!'
        );
      }

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
    const currentGame = matchState.games[matchState.currentGame];
    if (currentGame.history.length === 0) return;

    try {
      const lastState = currentGame.history[currentGame.history.length - 1];
      const newGames = [...matchState.games];
      newGames[matchState.currentGame] = {
        ...currentGame,
        team1Score: lastState.team1Score,
        team2Score: lastState.team2Score,
        server: lastState.server,
        receiver: lastState.receiver,
        history: currentGame.history.slice(0, -1)
      };

      await matchService.updateMatchScore(matchId, {
        game: newGames.map(game => ({
          team1Score: game.team1Score,
          team2Score: game.team2Score
        })),
        result: MatchStatus.IN_PROGRESS
      });

      setMatchState(prev => ({
        ...prev,
        server: lastState.server,
        receiver: lastState.receiver,
        games: newGames
      }));
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
    <main className="min-h-screen bg-gray-50 py-8 px-4 text-black">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-[#39846d] text-white px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Match Operation</h1>
                <div className="mt-2 text-sm">
                  {format?.groupBestOf === BestOf.ONE ? 'Best of 1' :
                   format?.groupBestOf === BestOf.THREE ? 'Best of 3' :
                   format?.groupBestOf === BestOf.FIVE ? 'Best of 5' : 'Unknown format'} •{' '}
                  {format?.groupWinningCondition === WinningCondition.EXACT ? 'Exact Score' : 'Two Points Difference'} •{' '}
                  Target: {format?.groupScore} • Max: {format?.groupMaxScore}
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
            {/* Games Overview */}
            <div className="grid grid-cols-5 gap-4 bg-gray-50 p-4 rounded-lg">
              {matchState.games.map((game, index) => (
                <div
                  key={index}
                  className={`text-center p-2 rounded ${
                    index === matchState.currentGame
                      ? 'bg-[#39846d] text-white'
                      : 'bg-white'
                  }`}
                >
                  <div className="font-medium">Game {index + 1}</div>
                  <div className="text-sm">
                    {game.team1Score} - {game.team2Score}
                  </div>
                </div>
              ))}
            </div>

            {/* Current Game Score Display */}
            <div className="flex justify-center items-center space-x-8 text-4xl font-bold">
              <div className="text-center">
                <div>{team1?.player1Name}</div>
                {team1?.player2Name && <div>{team1.player2Name}</div>}
                <div className="mt-2 text-6xl">{matchState.games[matchState.currentGame]?.team1Score || 0}</div>
              </div>
              <div className="text-gray-400">vs</div>
              <div className="text-center">
                <div>{team2?.player1Name}</div>
                {team2?.player2Name && <div>{team2.player2Name}</div>}
                <div className="mt-2 text-6xl">{matchState.games[matchState.currentGame]?.team2Score || 0}</div>
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
                disabled={matchState.games[matchState.currentGame]?.history.length === 0}
                className={`px-6 py-2 rounded ${
                  matchState.games[matchState.currentGame]?.history.length === 0
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
