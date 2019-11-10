import {Component, OnInit} from '@angular/core';

import {Player} from '../models/player.model';
import {GameService} from '../game.service';

@Component({
  selector: 'app-whoisright-component',
  templateUrl: './whoisright.component.html',
  styleUrls: ['./whoisright.component.css']
})
export class WhoIsRightComponent implements OnInit {
  players: Player[];

  constructor(private game: GameService) {
  }

  ngOnInit() {
    this.players = this.game.players;
  }

  onNext() {
    this.game.next();
  }

  restart() {
    this.game.restart();
  }
}
