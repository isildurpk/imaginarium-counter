import {State} from '../game.service';
import {Player} from './player.model';

export class GameRoundState {
  constructor(public state: State,
              public players: Player[],
              public currentPlayerIndex: number,
              public whoIsRightPlayers: string[],
              public currentRound: number) {
  }
}
