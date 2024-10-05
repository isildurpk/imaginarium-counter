import { Player } from './models/player.model';
import { GameRoundState } from './models/game-round-state.model';
import { GameState } from './models/game-state.model';

export enum Stage {
  SetPlayers = 0,
  WhoIsRight = 1,
  WhoHaveBeenChosen = 2
}

export class GameService {
  WIN_SCORE = 3;
  EVERYBODY_GUESSED = -3;
  NOBODY_GUESSED = -2;

  private stage: Stage = Stage.SetPlayers;
  get getStage(): Stage {
    return this.stage;
  }

  private availableClicks: number;

  players: Player[] = [
    new Player('Игрок 1'),
    new Player('Игрок 2'),
    new Player('Игрок 3'),
    new Player('Игрок 4')
  ];

  whoIsRightPlayers: Player[];
  currentPlayerIndex = 0;
  currentRound = 0;

  private gameState: GameState;

  constructor() {
    console.log('GameService CONSTRUCTOR');
    this.restoreGameState();
  }

  private restoreGameState() {
    this.gameState = GameState.restore();

    if (this.gameState) {
      const gameRoundState = this.gameState.getLastRound();
      this.restoreRoundState(gameRoundState);
    }
  }

  private restoreRoundState(gameRoundState: GameRoundState) {
      if (!gameRoundState) {
        return;
      }

      this.players = gameRoundState.players.map(p => Player.create(p));
      this.stage = gameRoundState.stage;
      this.currentPlayerIndex = gameRoundState.currentPlayerIndex;
      this.whoIsRightPlayers = gameRoundState.whoIsRightPlayers.map(name => this.players.find(p => p.name === name));
      this.currentRound = gameRoundState.currentRound;
      this.storeGameState();
      this.updateAvailableClicks();
  }

  private storeGameState() {
    const whoIsRightToSave = this.whoIsRightPlayers
        ? this.whoIsRightPlayers.map((player: Player) => player.name)
        : [];

      const gameRoundState = new GameRoundState(this.stage, this.players, this.currentPlayerIndex, whoIsRightToSave, this.currentRound);
      this.gameState.addRound(gameRoundState);
      this.gameState.store();
  }

  addPlayer(player: Player): void {
    if (this.stage !== Stage.SetPlayers) {
      throw new Error('Нельзя добавлять игроков во время игры!');
    }

    this.players.push(player);
  }

  deletePlayer(player: Player): void {
    if (this.stage !== Stage.SetPlayers) {
      throw new Error('Нельзя удалять игроков во время игры!');
    }

    const index = this.players.indexOf(player);
    this.players.splice(index, 1);
  }

  start(): void {
    this.currentRound = 1;
    this.stage = Stage.WhoIsRight;
    this.players[this.currentPlayerIndex].isCurrent = true;
    this.storeGameState();
    this.whoIsRightPlayers = this.players.filter(p => p.isSelected);
    this.updateAvailableClicks();
  }

  clickPlayer(player: Player): void {
    if (player.isCurrent) {
      return;
    }

    if (this.stage === Stage.WhoIsRight) {
      player.isSelected ? player.deselect() : player.select();
      this.whoIsRightPlayers = this.players.filter(p => p.isSelected);
      return;
    }

    if (this.stage === Stage.WhoHaveBeenChosen) {
      let clicksForPlayer = this.availableClicks;

      const initialAvailableClicks = this.players.length - 1 - this.whoIsRightPlayers.length;
      if (this.availableClicks > 0 && !this.whoIsRightPlayers.includes(player) &&
        player.selectionCount === initialAvailableClicks - 1) {
        console.log('clicks for player minus one');
        clicksForPlayer--;
      }

      console.log('clicks for ' + player.name + ': ' + clicksForPlayer);
      if (clicksForPlayer > 0) {
        player.select();
      }
      this.updateAvailableClicks();
      return;
    }
  }

  deselectPlayer(player: Player): void {
    player.deselect();
    this.updateAvailableClicks();
  }

  canGoNext(): boolean {
    if (this.stage === Stage.WhoHaveBeenChosen) {
      return this.availableClicks === 0;
    }
    return true;
  }

  next(): void {
    if (this.stage === Stage.WhoIsRight) {
      this.stage = Stage.WhoHaveBeenChosen;
      const everybodyGuessed = this.updateScores();
      if (everybodyGuessed) {
        this.incrementCurrentPlayer();
        this.whoIsRightPlayers = [];
        this.stage = Stage.WhoIsRight;
        this.currentRound++;
      }
      console.log('Кто угадал: ', this.whoIsRightPlayers.map(p => p.name).join(', '));
    } else if (this.stage === Stage.WhoHaveBeenChosen) {
      this.updateScores2();
      this.incrementCurrentPlayer();
      this.whoIsRightPlayers = [];
      this.stage = Stage.WhoIsRight;
      this.currentRound++;
    }

    this.players.forEach(p => {
      p.selectionCount = 0;
      p.isSelected = false;
    });

    if (this.stage === Stage.WhoHaveBeenChosen) {
      this.updateAvailableClicks();
    }

    this.storeGameState();
  }

  restart(): void {
    if (!confirm('Начинаем заново?')) {
      return;
    }
    localStorage.clear();
    window.location.href = '/';
  }

  // returns true if everybody guessed
  private updateScores(): boolean {
    this.resetDiff();

    const currentPlayer = this.getCurrentPlayer();
    const initialScore = currentPlayer.score;

    if (this.whoIsRightPlayers.length === 0) {
      currentPlayer.score += this.NOBODY_GUESSED;
      currentPlayer.scoreDiff = currentPlayer.score - initialScore;
      return false;
    }
    if (this.whoIsRightPlayers.length === this.players.length - 1) {
      currentPlayer.score += this.EVERYBODY_GUESSED;
      currentPlayer.scoreDiff = currentPlayer.score - initialScore;
      return true;
    }

    currentPlayer.score += this.WIN_SCORE + this.whoIsRightPlayers.length;
    currentPlayer.scoreDiff = currentPlayer.score - initialScore;
    this.players.forEach(p => {
      if (p.isCurrent) {
        return;
      }

      const pInitialScore = p.score;
      if (p.isSelected) {
        p.score += this.WIN_SCORE;
      }
      p.scoreDiff = p.score - pInitialScore;
    });
    return false;
  }

  private updateScores2(): void {
    this.players.forEach(p => {
      if (p.isSelected) {
        p.score += p.selectionCount;
        p.scoreDiff += p.selectionCount;
      }
    });
  }

  private getCurrentPlayer(): Player {
    return this.players[this.currentPlayerIndex];
  }

  private incrementCurrentPlayer(): void {
    this.getCurrentPlayer().isCurrent = false;

    if (this.currentPlayerIndex === this.players.length - 1) {
      this.currentPlayerIndex = 0;
    } else {
      this.currentPlayerIndex++;
    }

    this.getCurrentPlayer().isCurrent = true;
  }

  private updateAvailableClicks(): void {
    const availablePlayers = this.players.length - 1 - this.whoIsRightPlayers.length;
    let selectionSum = 0;
    this.players.forEach(p => selectionSum += p.selectionCount);
    this.availableClicks = availablePlayers - selectionSum;
    console.log('availableClicks: ' + this.availableClicks);
  }

  private resetDiff() {
    this.players.forEach(p => p.scoreDiff = 0);
  }
}
