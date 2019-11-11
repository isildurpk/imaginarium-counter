import {Player} from './models/player.model';
import {StateDto} from './models/state-dto.model';
import {Subject} from 'rxjs';

export enum State {
  SetPlayers = 0,
  WhoIsRight = 1,
  WhoHaveBeenChosen = 2
}

export class GameService {
  WIN_SCORE: number = 3;
  EVERYBODY_GUESSED: number = -3;
  NOBODY_GUESSED: number = -2;

  private state: State = State.SetPlayers;
  private availableClicks: number;

  readonly players: Player[] = [
    new Player("Игрок 1"),
    new Player("Игрок 2"),
    new Player("Игрок 3"),
    new Player("Игрок 4")
  ];
  whoIsRightPlayers: Player[];
  currentPlayerIndex: number = 0;
  readonly stateChanged = new Subject<State>();

  constructor() {
    console.log('GameService CONSTRUCTOR');
    const stateDto: StateDto = JSON.parse(localStorage.getItem('state'));
    if (stateDto) {
      this.players = stateDto.players.map(p => Player.create(p));
      this.state = stateDto.state;
      this.currentPlayerIndex = stateDto.currentPlayerIndex;
      this.whoIsRightPlayers = stateDto.whoIsRightPlayers.map(name => this.players.find(p => p.name === name));
      this.stateChanged.next(this.state);
      this.updateAvailableClicks();
    }

    this.stateChanged.subscribe(() => {
      console.log('StateChanged in GameService');

      const whoIsRightToSave = this.whoIsRightPlayers
        ? this.whoIsRightPlayers.map((player: Player) => player.name)
        : [];

      const stateDto = new StateDto(this.state, this.players, this.currentPlayerIndex, whoIsRightToSave);
      localStorage.setItem('state', JSON.stringify(stateDto));
    });
  }

  getState(): State {
    return this.state;
  }

  addPlayer(player: Player): void {
    if (this.state !== State.SetPlayers)
      throw new Error('Нельзя добавлять игроков во время игры!');

    this.players.push(player);
  }

  deletePlayer(player: Player): void {
    if (this.state !== State.SetPlayers)
      throw new Error('Нельзя удалять игроков во время игры!');

    const index = this.players.indexOf(player);
    this.players.splice(index, 1);
  }

  start(): void {
    this.state = State.WhoIsRight;
    this.players[this.currentPlayerIndex].isCurrent = true;
    this.stateChanged.next(this.state);
    this.whoIsRightPlayers = this.players.filter(p => p.isSelected);
    this.updateAvailableClicks();
  }

  clickPlayer(player: Player): void {
    if (player.isCurrent)
      return;

    if (this.state === State.WhoIsRight) {
      player.isSelected ? player.deselect() : player.select();
      this.whoIsRightPlayers = this.players.filter(p => p.isSelected);
      return;
    }

    if (this.state === State.WhoHaveBeenChosen) {
      let clicksForPlayer = this.availableClicks;

      let initialAvailableClicks = this.players.length - 1 - this.whoIsRightPlayers.length;
      if (this.availableClicks > 0 && !this.whoIsRightPlayers.includes(player) &&
        player.selectionCount == initialAvailableClicks - 1) {
        console.log('clicks for player minus one');
        clicksForPlayer--;
      }

      console.log('clicks for ' + player.name + ': ' + clicksForPlayer);
      if (clicksForPlayer > 0)
        player.select();
      this.updateAvailableClicks();
      return;
    }
  }

  deselectPlayer(player: Player): void {
    player.deselect();
    this.updateAvailableClicks();
  }

  canGoNext(): boolean {
    if (this.state === State.WhoHaveBeenChosen) {
      return this.availableClicks === 0;
    }
    return true;
  }

  next(): void {
    if (this.state === State.WhoIsRight) {
      this.state = State.WhoHaveBeenChosen;
      const everybodyGuessed = this.updateScores();
      if (everybodyGuessed) {
        this.incrementCurrentPlayer();
        this.whoIsRightPlayers = [];
        this.state = State.WhoIsRight;
      }
      console.log('Кто угадал: ', this.whoIsRightPlayers.map(p => p.name).join(', '))
    } else if (this.state === State.WhoHaveBeenChosen) {
      this.updateScores2();
      this.incrementCurrentPlayer();
      this.whoIsRightPlayers = [];
      this.state = State.WhoIsRight;
    }

    this.players.forEach(p => {
      p.selectionCount = 0;
      p.isSelected = false;
    });
    if (this.state === State.WhoHaveBeenChosen)
      this.updateAvailableClicks();

    this.stateChanged.next(this.state);
  }

  restart(): void {
    if (!confirm("Начинаем заново?")) {
      return;
    }
    localStorage.clear();
    window.location.href = "/";
  }

  // returns true if everybody guessed
  private updateScores(): boolean {
    const currentPlayer = this.getCurrentPlayer();
    if (this.whoIsRightPlayers.length === 0) {
      currentPlayer.score += this.NOBODY_GUESSED;
      return false;
    }
    if (this.whoIsRightPlayers.length === this.players.length - 1) {
      currentPlayer.score += this.EVERYBODY_GUESSED;
      return true;
    }

    currentPlayer.score += this.WIN_SCORE + this.whoIsRightPlayers.length;
    this.players.forEach(p => {
      if (p.isSelected)
        p.score += this.WIN_SCORE;
    });
    return false;
  }

  private updateScores2(): void {
    this.players.forEach(p => {
      if (p.isSelected)
        p.score += p.selectionCount;
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

}
