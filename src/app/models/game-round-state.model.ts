import {Stage} from '../game.service';
import {Player} from './player.model';

export class GameRoundState {
  constructor(public stage: Stage,
              public players: Player[],
              public currentPlayerIndex: number,
              public whoIsRightPlayers: string[],
              public currentRound: number) {
  }
}
