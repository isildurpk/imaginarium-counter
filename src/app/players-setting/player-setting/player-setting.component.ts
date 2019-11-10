import {Component, OnInit, Input} from '@angular/core';

import {GameService} from '../../game.service';
import {Player} from '../../models/player.model';

@Component({
  selector: 'app-player-setting',
  templateUrl: './player-setting.component.html',
  styleUrls: ['./player-setting.component.css']
})
export class PlayerSettingComponent implements OnInit {
  @Input() player: Player;

  constructor(private game: GameService) {
  }

  ngOnInit() {
  }

  onDeleted() {
    this.game.deletePlayer(this.player);
  }

  onInput(event) {
    this.player.name = event.target.value;
  }

}
