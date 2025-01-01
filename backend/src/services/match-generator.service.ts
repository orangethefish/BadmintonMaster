import { GroupTeamModel } from '../data-models/group.model';
import { TeamModel } from '../data-models/team.model';
import { MatchModel } from '../data-models/match.model';
import { MatchService } from './match.service';

interface TeamMatchCount {
  teamId: number;
  consecutiveMatches: number;
  totalMatches: number;
  opponents: Set<number>;
}

export class MatchGeneratorService {
  private matchService: MatchService;

  constructor() {
    this.matchService = new MatchService();
  }

  public async generateAndSaveGroupMatches(groupTeam: GroupTeamModel): Promise<MatchModel[]> {
    const matches = this.generateMatches(groupTeam);
    
    // Save all matches to database
    const savedMatches = await Promise.all(
      matches.map(match => this.matchService.addMatch(match))
    );

    return savedMatches;
  }

  private generateMatches(groupTeam: GroupTeamModel): MatchModel[] {
    const { group, teams } = groupTeam;
    const matches: MatchModel[] = [];
    const teamStats = new Map<number, TeamMatchCount>();

    // Initialize team stats
    teams.forEach(team => {
      teamStats.set(team.teamId!, {
        teamId: team.teamId!,
        consecutiveMatches: 0,
        totalMatches: 0,
        opponents: new Set<number>()
      });
    });

    // Calculate total number of matches needed
    // Each team needs to play against every other team once
    const totalMatchesNeeded = (teams.length * (teams.length - 1)) / 2;

    while (matches.length < totalMatchesNeeded) {
      const availablePairs = this.findAvailablePairs(teams, teamStats);
      if (availablePairs.length === 0) {
        // If no valid pairs found, reset consecutive matches count
        // This helps when we're stuck due to consecutive match constraint
        for (const stats of teamStats.values()) {
          stats.consecutiveMatches = 0;
        }
        continue;
      }

      // Pick a random pair from available pairs
      const randomIndex = Math.floor(Math.random() * availablePairs.length);
      const [team1, team2] = availablePairs[randomIndex];

      // Create match
      const match: MatchModel = {
        formatId: group.formatId,
        groupId: group.groupId!,
        team1Id: team1.teamId!,
        team2Id: team2.teamId!
      };

      matches.push(match);

      // Update team stats
      this.updateTeamStats(teamStats, team1.teamId!, team2.teamId!);
      
      // Reset consecutive matches for teams not in this match
      teams.forEach(team => {
        if (team.teamId !== team1.teamId && team.teamId !== team2.teamId) {
          const stats = teamStats.get(team.teamId!);
          if (stats) {
            stats.consecutiveMatches = 0;
          }
        }
      });
    }

    // Shuffle matches to make them more random
    return this.shuffleArray(matches);
  }

  private findAvailablePairs(teams: TeamModel[], teamStats: Map<number, TeamMatchCount>): [TeamModel, TeamModel][] {
    const availablePairs: [TeamModel, TeamModel][] = [];

    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        const team1 = teams[i];
        const team2 = teams[j];
        const team1Stats = teamStats.get(team1.teamId!);
        const team2Stats = teamStats.get(team2.teamId!);

        if (this.canTeamsPlay(team1Stats!, team2Stats!)) {
          availablePairs.push([team1, team2]);
        }
      }
    }

    return availablePairs;
  }

  private canTeamsPlay(team1Stats: TeamMatchCount, team2Stats: TeamMatchCount): boolean {
    // Check if teams haven't played against each other
    if (team1Stats.opponents.has(team2Stats.teamId)) {
      return false;
    }

    // Check consecutive matches constraint
    if (team1Stats.consecutiveMatches >= 2 || team2Stats.consecutiveMatches >= 2) {
      return false;
    }

    return true;
  }

  private updateTeamStats(teamStats: Map<number, TeamMatchCount>, team1Id: number, team2Id: number): void {
    const team1Stats = teamStats.get(team1Id)!;
    const team2Stats = teamStats.get(team2Id)!;

    // Update opponents
    team1Stats.opponents.add(team2Id);
    team2Stats.opponents.add(team1Id);

    // Update consecutive matches
    team1Stats.consecutiveMatches++;
    team2Stats.consecutiveMatches++;

    // Update total matches
    team1Stats.totalMatches++;
    team2Stats.totalMatches++;
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
} 