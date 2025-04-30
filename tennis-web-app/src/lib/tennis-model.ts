type Player = "a" | "b";
type Metric = "points" | "games" | "sets";

interface MatchHistoryEntry {
  pointId: number;
  aPoints: number;
  bPoints: number;
  aGames: number;
  bGames: number;
  aSets: number;
  bSets: number;
  pAWinGame: number;
  pBWinGame: number;
  pAWinSet: number;
  pBWinSet: number;
  pAWinMatch: number;
  pBWinMatch: number;
  dPAWinGame: number;
  dPBWinGame: number;
  dPAWinSet: number;
  dPBWinSet: number;
  dPAWinMatch: number;
  dPBWinMatch: number;
  server: Player;
  winner: Player | null;
  message: string;
}

type CacheKey = string;

export class TennisMatch {
  // Constants
  private readonly NUMSETS: number = 3;
  private readonly NUMGAMES: number = 6;
  private readonly NUMPOINTS: number = 4;
  private readonly NUMPOINTSTIEBREAK: number = 7;
  private readonly RECURSIVECAP: number = 20;
  private readonly MATCHTRACKING: boolean = true;

  // Match state
  public pAWinPointOnServe: number = 0.5;
  public pAWinPointReturningServe: number = 0.5;
  public ad: boolean = true;
  public aPoints: number = 0;
  public bPoints: number = 0;
  public aGames: number = 0;
  public bGames: number = 0;
  public aSets: number = 0;
  public bSets: number = 0;
  public pAWinGame: number = 0;
  public pBWinGame: number = 0;
  public pAWinSet: number = 0;
  public pBWinSet: number = 0;
  public pAWinMatch: number = 0;
  public pBWinMatch: number = 0;
  public server: Player = "a";
  public tiebrekerSaveNextServer: Player = "a";
  public tiebrekerFirstServe: boolean = false;
  public pointId: number = 0;
  public winner: Player | null = null;
  public matchHistory: MatchHistoryEntry[] = [];

  // Caches
  private gameCache: Record<CacheKey, number> = {};
  private setCache: Record<CacheKey, [number, number]> = {};
  private tiebrekerCache: Record<CacheKey, number> = {};
  private matchCache: Record<CacheKey, number> = {};

  constructor(
    pAWinPointOnServe: number = 0.5,
    pAWinPointReturningServe: number = 0.5,
    startingServer: Player = "a"
  ) {
    this.pAWinPointOnServe = pAWinPointOnServe;
    this.pAWinPointReturningServe = pAWinPointReturningServe;
    this.server = startingServer;
    this.tiebrekerSaveNextServer = startingServer;
  }

  public playPoint(): void {
    const pAWinPoint =
      this.server === "a"
        ? this.pAWinPointOnServe
        : this.pAWinPointReturningServe;

    if (Math.random() < pAWinPoint) {
      this.increment("a", "points");
    } else {
      this.increment("b", "points");
    }
  }

  public playGame(): void {
    this.resetPoints();

    while (this.aPoints < this.NUMPOINTS && this.bPoints < this.NUMPOINTS) {
      this.playPoint();
    }

    if (this.aPoints > this.bPoints + 1) {
      this.increment("a", "games");
    } else if (this.aPoints + 1 < this.bPoints) {
      this.increment("b", "games");
    } else {
      this.playDeuce();
    }

    this.server = this.server === "a" ? "b" : "a";
  }

  private playDeuce(): void {
    if (this.ad) {
      while (Math.abs(this.aPoints - this.bPoints) < 2) {
        this.playPoint();
      }
    } else {
      this.playPoint();
    }

    if (this.aPoints > this.bPoints) {
      this.increment("a", "games");
    } else {
      this.increment("b", "games");
    }
  }

  public playSet(): void {
    this.resetGames();

    while (this.aGames < this.NUMGAMES && this.bGames < this.NUMGAMES) {
      this.playGame();
    }

    if (this.aGames > this.bGames + 1) {
      this.increment("a", "sets");
    } else if (this.aGames + 1 < this.bGames) {
      this.increment("b", "sets");
    } else {
      this.playGame();
      if (this.aGames > this.bGames + 1) {
        this.increment("a", "sets");
      } else if (this.aGames + 1 < this.bGames) {
        this.increment("b", "sets");
      } else {
        this.tiebrekerSaveNextServer = this.server;
        this.playTieBreaker();
        this.server = this.tiebrekerSaveNextServer;
      }
    }
  }

  private playTieBreaker(): void {
    this.resetPoints();
    this.tiebrekerFirstServe = false;

    while (
      this.aPoints < this.NUMPOINTSTIEBREAK &&
      this.bPoints < this.NUMPOINTSTIEBREAK
    ) {
      this.playPoint();
      if (this.tiebrekerFirstServe === true) {
        this.tiebrekerFirstServe = false;
      } else {
        this.tiebrekerFirstServe = true;
        this.server = this.server === "a" ? "b" : "a";
      }
    }

    if (this.aPoints > this.bPoints + 1) {
      this.increment("a", "sets");
    } else if (this.aPoints + 1 < this.bPoints) {
      this.increment("b", "sets");
    } else {
      // Win by 2 tiebreaker
      while (
        Math.abs(this.aPoints - this.bPoints) < 2 &&
        this.aPoints < this.RECURSIVECAP &&
        this.bPoints < this.RECURSIVECAP
      ) {
        this.playPoint();
        if (this.tiebrekerFirstServe === true) {
          this.tiebrekerFirstServe = false;
        } else {
          this.tiebrekerFirstServe = true;
          this.server = this.server === "a" ? "b" : "a";
        }
      }

      if (this.aPoints > this.bPoints) {
        this.increment("a", "sets");
      } else if (this.aPoints < this.bPoints) {
        this.increment("b", "sets");
      }
    }
  }

  public playTennis(): void {
    this.resetSets();
    this.pointId = 0;
    this.matchHistory = [];

    while (this.aSets < this.NUMSETS && this.bSets < this.NUMSETS) {
      this.playSet();
    }

    if (this.aSets > this.bSets) {
      this.winner = "a";
    } else if (this.aSets < this.bSets) {
      this.winner = "b";
    }
  }

  private increment(player: Player, metric: Metric): void {
    const attributes = {
      a: { points: "aPoints", games: "aGames", sets: "aSets" },
      b: { points: "bPoints", games: "bGames", sets: "bSets" },
    };

    if (metric === "points" && this.MATCHTRACKING) {
      this.runPredictions();

      let dPAWinGame = 0;
      let dPBWinGame = 0;
      let dPAWinSet = 0;
      let dPBWinSet = 0;
      let dPAWinMatch = 0;
      let dPBWinMatch = 0;

      if (this.matchHistory.length > 0) {
        const lastEntry = this.matchHistory[this.matchHistory.length - 1];
        dPAWinGame = this.pAWinGame - lastEntry.pAWinGame;
        dPBWinGame = this.pBWinGame - lastEntry.pBWinGame;
        dPAWinSet = this.pAWinSet - lastEntry.pAWinSet;
        dPBWinSet = this.pBWinSet - lastEntry.pBWinSet;
        dPAWinMatch = this.pAWinMatch - lastEntry.pAWinMatch;
        dPBWinMatch = this.pBWinMatch - lastEntry.pBWinMatch;
      }

      const message = `${player} wins ${metric}`;
      const stateSnapshot: MatchHistoryEntry = {
        pointId: this.pointId,
        aPoints: this.aPoints,
        bPoints: this.bPoints,
        aGames: this.aGames,
        bGames: this.bGames,
        aSets: this.aSets,
        bSets: this.bSets,
        pAWinGame: this.pAWinGame,
        pBWinGame: this.pBWinGame,
        pAWinSet: this.pAWinSet,
        pBWinSet: this.pBWinSet,
        pAWinMatch: this.pAWinMatch,
        pBWinMatch: this.pBWinMatch,
        dPAWinGame: dPAWinGame,
        dPBWinGame: dPBWinGame,
        dPAWinSet: dPAWinSet,
        dPBWinSet: dPBWinSet,
        dPAWinMatch: dPAWinMatch,
        dPBWinMatch: dPBWinMatch,
        server: this.server,
        winner: this.winner,
        message: message,
      };

      this.matchHistory.push(stateSnapshot);
      this.pointId++;
    }

    // Always execute this
    if (player in attributes && metric in attributes[player]) {
      const attrName = attributes[player][metric];
      (this[attrName as keyof TennisMatch] as number | undefined) =
        ((this[attrName as keyof TennisMatch] as number | undefined) ?? 0) + 1;
    }
  }

  private resetPoints(): void {
    this.aPoints = 0;
    this.bPoints = 0;
  }

  private resetGames(): void {
    this.aGames = 0;
    this.bGames = 0;
    this.resetPoints();
  }

  private resetSets(): void {
    this.aSets = 0;
    this.bSets = 0;
    this.resetGames();

    // Reset caches
    this.gameCache = {};
    this.setCache = {};
    this.tiebrekerCache = {};
    this.matchCache = {};
  }

  private predictGame(
    currentServer: Player,
    aPoints: number,
    bPoints: number
  ): number {
    const cacheKey = `${currentServer}-${aPoints}-${bPoints}`;

    if (cacheKey in this.gameCache) {
      return this.gameCache[cacheKey];
    }

    if (
      (aPoints >= this.NUMPOINTS && aPoints > bPoints + 1) ||
      aPoints > this.RECURSIVECAP
    ) {
      return 1;
    }

    if (
      (bPoints >= this.NUMPOINTS && bPoints > aPoints + 1) ||
      bPoints > this.RECURSIVECAP
    ) {
      return 0;
    }

    const pAWinPoint =
      currentServer === "a"
        ? this.pAWinPointOnServe
        : this.pAWinPointReturningServe;

    const pAWinNextPointAndWinGame =
      pAWinPoint * this.predictGame(currentServer, aPoints + 1, bPoints);
    const pALoseNextPointAndWinGame =
      (1 - pAWinPoint) * this.predictGame(currentServer, aPoints, bPoints + 1);
    const pAWinGame = pAWinNextPointAndWinGame + pALoseNextPointAndWinGame;

    this.gameCache[cacheKey] = pAWinGame;
    return pAWinGame;
  }

  private predictSet(
    currentServer: Player,
    aGames: number,
    bGames: number
  ): [number, number] {
    const nextServer = currentServer === "a" ? "b" : "a";
    const cacheKey = `${currentServer}-${aGames}-${bGames}`;

    if (cacheKey in this.setCache) {
      return this.setCache[cacheKey];
    }

    if (aGames >= 6 && aGames > bGames + 1) {
      return [1.0, currentServer === "a" ? 1.0 : 0.0];
    }

    if (bGames >= 6 && bGames > aGames + 1) {
      return [0.0, currentServer === "a" ? 1.0 : 0.0];
    }

    // Edge cases
    if (aGames === 7) return [1.0, currentServer === "a" ? 1.0 : 0.0];
    if (bGames === 7) return [0.0, currentServer === "a" ? 1.0 : 0.0];

    if (aGames === 6 && bGames === 6) {
      const pAWinTiebreaker = this.predictTiebreaker(
        currentServer,
        false,
        0,
        0
      );
      return [pAWinTiebreaker, currentServer === "a" ? 1.0 : 0.0];
    }

    const pAWinGame = this.predictGame(currentServer, 0, 0);
    const [pAWinSetGivenWinGame, pANextServerGivenWinGame] = this.predictSet(
      nextServer,
      aGames + 1,
      bGames
    );
    const [pAWinSetGivenLoseGame, pANextServerGivenLoseGame] = this.predictSet(
      nextServer,
      aGames,
      bGames + 1
    );

    const pAWinSet =
      pAWinGame * pAWinSetGivenWinGame +
      (1 - pAWinGame) * pAWinSetGivenLoseGame;
    const pAServesNext =
      pAWinGame * pANextServerGivenWinGame +
      (1 - pAWinGame) * pANextServerGivenLoseGame;

    this.setCache[cacheKey] = [pAWinSet, pAServesNext];
    return [pAWinSet, pAServesNext];
  }

  private predictTiebreaker(
    currentServer: Player,
    firstServe: boolean,
    aPoints: number,
    bPoints: number
  ): number {
    const cacheKey = `${currentServer}-${firstServe}-${aPoints}-${bPoints}`;

    if (cacheKey in this.tiebrekerCache) {
      return this.tiebrekerCache[cacheKey];
    }

    if (aPoints >= this.NUMPOINTSTIEBREAK && aPoints > bPoints + 1) return 1;
    if (bPoints >= this.NUMPOINTSTIEBREAK && aPoints + 1 < bPoints) return 0;
    if (aPoints > this.NUMPOINTSTIEBREAK && bPoints > this.NUMPOINTSTIEBREAK)
      return (this.pAWinPointOnServe + this.pAWinPointReturningServe) / 2;

    const pAWinPoint =
      currentServer === "a"
        ? this.pAWinPointOnServe
        : this.pAWinPointReturningServe;

    let nextServer = currentServer;
    let nextFirstServe = firstServe;

    if (firstServe === true) {
      nextFirstServe = false;
    } else {
      nextFirstServe = true;
      nextServer = currentServer === "a" ? "b" : "a";
    }

    const pAWinTiebrakerAndWinNextPoint =
      this.predictTiebreaker(nextServer, nextFirstServe, aPoints + 1, bPoints) *
      pAWinPoint;
    const pAWinTiebrakerAndLoseNextPoint =
      this.predictTiebreaker(nextServer, nextFirstServe, aPoints, bPoints + 1) *
      (1 - pAWinPoint);
    const pAWinTiebraker =
      pAWinTiebrakerAndWinNextPoint + pAWinTiebrakerAndLoseNextPoint;

    this.tiebrekerCache[cacheKey] = pAWinTiebraker;
    return pAWinTiebraker;
  }

  private predictMatch(
    currentServer: Player,
    aSets: number,
    bSets: number
  ): number {
    const cacheKey = `${currentServer}-${aSets}-${bSets}`;

    if (cacheKey in this.matchCache) {
      return this.matchCache[cacheKey];
    }

    if (aSets >= this.NUMSETS) return 1.0;
    if (bSets >= this.NUMSETS) return 0.0;

    const [pAWinSet, pANextServer] = this.predictSet(currentServer, 0, 0);

    const pAWinMatchAndWinNextSetAndServesNext =
      this.predictMatch("a", aSets + 1, bSets) * pAWinSet * pANextServer;
    const pAWinMatchAndLoseNextSetAndServesNext =
      this.predictMatch("a", aSets, bSets + 1) * (1 - pAWinSet) * pANextServer;
    const pAWinMatchAndWinNextSetAndReceivesNext =
      this.predictMatch("b", aSets + 1, bSets) * pAWinSet * (1 - pANextServer);
    const pAWinMatchAndLoseNextSetAndReceivesNext =
      this.predictMatch("b", aSets, bSets + 1) *
      (1 - pAWinSet) *
      (1 - pANextServer);

    const pAWinMatch =
      pAWinMatchAndWinNextSetAndServesNext +
      pAWinMatchAndLoseNextSetAndServesNext +
      pAWinMatchAndWinNextSetAndReceivesNext +
      pAWinMatchAndLoseNextSetAndReceivesNext;

    this.matchCache[cacheKey] = pAWinMatch;
    return pAWinMatch;
  }

  public runPredictions(): void {
    const currentServer = this.server;
    const nextServer = currentServer === "a" ? "b" : "a";

    // If tiebreaker
    if (this.aGames === 6 && this.bGames === 6) {
      this.pAWinGame = this.predictTiebreaker(
        currentServer,
        this.tiebrekerFirstServe,
        this.aPoints,
        this.bPoints
      );
      this.pBWinGame = 1 - this.pAWinGame;
      this.pAWinSet = this.pAWinGame;
      this.pBWinSet = 1 - this.pAWinSet;

      const pAWinMatchAndWinSet =
        this.predictMatch(
          this.tiebrekerSaveNextServer,
          this.aSets + 1,
          this.bSets
        ) * this.pAWinSet;
      const pAWinMatchAndLoseSet =
        this.predictMatch(
          this.tiebrekerSaveNextServer,
          this.aSets,
          this.bSets + 1
        ) * this.pBWinSet;
      this.pAWinMatch = pAWinMatchAndWinSet + pAWinMatchAndLoseSet;
      this.pBWinMatch = 1 - this.pAWinMatch;
    } else {
      // If generic point
      this.pAWinGame = this.predictGame(
        currentServer,
        this.aPoints,
        this.bPoints
      );
      this.pBWinGame = 1 - this.pAWinGame;

      const [pAWinSetGivenWinGame, pAServeNextGivenWinGame] = this.predictSet(
        nextServer,
        this.aGames + 1,
        this.bGames
      );
      const [pAWinSetGivenLoseGame, pAServeNextGivenLoseGame] = this.predictSet(
        nextServer,
        this.aGames,
        this.bGames + 1
      );

      this.pAWinSet =
        pAWinSetGivenWinGame * this.pAWinGame +
        pAWinSetGivenLoseGame * (1 - this.pAWinGame);
      this.pBWinSet = 1 - this.pAWinSet;

      const pAServesNext =
        pAServeNextGivenWinGame * this.pAWinGame +
        pAServeNextGivenLoseGame * (1 - this.pAWinGame);

      const pAWinMatchAndWinSetAndServesNext =
        this.predictMatch("a", this.aSets + 1, this.bSets) *
        this.pAWinSet *
        pAServesNext;
      const pAWinMatchAndWinSetAndReceivesNext =
        this.predictMatch("b", this.aSets + 1, this.bSets) *
        this.pAWinSet *
        (1 - pAServesNext);
      const pAWinMatchAndLoseSetAndServesNext =
        this.predictMatch("a", this.aSets, this.bSets + 1) *
        this.pBWinSet *
        pAServesNext;
      const pAWinMatchAndLoseSetAndReceivesNext =
        this.predictMatch("b", this.aSets, this.bSets + 1) *
        this.pBWinSet *
        (1 - pAServesNext);

      this.pAWinMatch =
        pAWinMatchAndWinSetAndServesNext +
        pAWinMatchAndWinSetAndReceivesNext +
        pAWinMatchAndLoseSetAndServesNext +
        pAWinMatchAndLoseSetAndReceivesNext;
      this.pBWinMatch = 1 - this.pAWinMatch;
    }
  }

  // Helper function to get display scores in standard tennis format
  public displayScores(): string {
    const pointNames = ["0", "15", "30", "40"];
    let currentGameScore = "";

    if (this.aPoints < 3 && this.bPoints < 3) {
      currentGameScore = `${pointNames[this.aPoints]}-${
        pointNames[this.bPoints]
      }`;
    } else if (this.aPoints === this.bPoints) {
      currentGameScore = "Deuce";
    } else if (this.aPoints > this.bPoints) {
      currentGameScore = "Advantage Player A";
    } else {
      currentGameScore = "Advantage Player B";
    }

    return `Sets: ${this.aSets}-${this.bSets}, Games: ${this.aGames}-${this.bGames}, Current Game: ${currentGameScore}`;
  }
}
