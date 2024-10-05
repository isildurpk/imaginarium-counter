import {State} from '../game.service';
import {Player} from './player.model';

export class StateDto {
  constructor(public state: State,
              public players: Player[],
              public currentPlayerIndex: number,
              public whoIsRightPlayers: string[],
              public currentRound: number) {
  }
}
