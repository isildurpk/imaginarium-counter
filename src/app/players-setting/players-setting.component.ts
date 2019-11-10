import {Component, OnInit} from '@angular/core';

import {GameService} from '../game.service';
import {Player} from '../models/player.model';

@Component({
  selector: 'app-players-setting',
  templateUrl: './players-setting.component.html',
  styleUrls: ['./players-setting.component.css']
})
export class PlayersSettingComponent implements OnInit {
  players: Player[];

  constructor(private game: GameService) {
  }

  ngOnInit() {
    this.players = this.game.players;
  }

  onAdded() {
    this.game.addPlayer(new Player("Игрок " + (this.players.length + 1)));
  }

  onStartGame() {
    this.game.start();
  }

}
