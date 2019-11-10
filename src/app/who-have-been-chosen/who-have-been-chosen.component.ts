import {Component, OnInit} from '@angular/core';
import {Player} from '../models/player.model';
import {GameService} from '../game.service';

@Component({
  selector: 'app-who-have-been-chosen',
  templateUrl: './who-have-been-chosen.component.html',
  styleUrls: ['./who-have-been-chosen.component.css']
})
export class WhoHaveBeenChosenComponent implements OnInit {
  players: Player[];

  constructor(private game: GameService) {
  }

  ngOnInit() {
    this.players = this.game.players;
  }

  onNext() {
    this.game.next();
  }

  canGoNext(): boolean {
    return this.game.canGoNext();
  }
}
