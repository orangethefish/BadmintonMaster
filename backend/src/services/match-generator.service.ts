import { GroupTeamModel } from '../data-models/group.model';
import { TeamModel } from '../data-models/team.model';
import { MatchModel } from '../data-models/match.model';
import { MatchService } from './match.service';
import { MatchStatus } from '../enums/match.enum';

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
    const totalMatchesNeeded = (teams.length * (teams.length - 1)) / 2;

    while (matches.length < totalMatchesNeeded) {
      // First, try to find pairs where both teams haven't played yet
      let availablePairs = this.findAvailablePairs(teams, teamStats, true);
      
      // If no pairs where both teams haven't played, find any valid pairs
      if (availablePairs.length === 0) {
        availablePairs = this.findAvailablePairs(teams, teamStats, false);
        
        if (availablePairs.length === 0) {
          // If still no valid pairs found, reset consecutive matches count
          for (const stats of teamStats.values()) {
            stats.consecutiveMatches = 0;
          }
          continue;
        }
      }

      // Sort pairs to prioritize teams with fewer matches
      availablePairs.sort((a, b) => {
        const aMaxMatches = Math.max(
          teamStats.get(a[0].teamId!)!.totalMatches,
          teamStats.get(a[1].teamId!)!.totalMatches
        );
        const bMaxMatches = Math.max(
          teamStats.get(b[0].teamId!)!.totalMatches,
          teamStats.get(b[1].teamId!)!.totalMatches
        );
        return aMaxMatches - bMaxMatches;
      });

      // Pick the first pair (teams with fewest matches)
      const [team1, team2] = availablePairs[0];

      // Create match
      const match: MatchModel = {
        formatId: group.formatId,
        groupId: group.groupId!,
        team1Id: team1.teamId!,
        team2Id: team2.teamId!,
        result: MatchStatus.PENDING
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

    return matches;
  }

  private findAvailablePairs(
    teams: TeamModel[], 
    teamStats: Map<number, TeamMatchCount>,
    onlyUnplayedTeams: boolean
  ): [TeamModel, TeamModel][] {
    const availablePairs: [TeamModel, TeamModel][] = [];

    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        const team1 = teams[i];
        const team2 = teams[j];
        const team1Stats = teamStats.get(team1.teamId!);
        const team2Stats = teamStats.get(team2.teamId!);

        if (this.canTeamsPlay(team1Stats!, team2Stats!, onlyUnplayedTeams)) {
          availablePairs.push([team1, team2]);
        }
      }
    }

    return availablePairs;
  }

  private canTeamsPlay(
    team1Stats: TeamMatchCount, 
    team2Stats: TeamMatchCount,
    onlyUnplayedTeams: boolean
  ): boolean {
    // Check if teams haven't played against each other
    if (team1Stats.opponents.has(team2Stats.teamId)) {
      return false;
    }

    // Check consecutive matches constraint
    if (team1Stats.consecutiveMatches >= 2 || team2Stats.consecutiveMatches >= 2) {
      return false;
    }

    // If we're looking for only unplayed teams, check if either team has played
    if (onlyUnplayedTeams && (team1Stats.totalMatches > 0 || team2Stats.totalMatches > 0)) {
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
} 