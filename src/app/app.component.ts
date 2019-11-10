import {Component, OnInit} from '@angular/core';

import {GameService, State} from './game.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  gameState: State;

  constructor(private game: GameService) {
  }

  ngOnInit(): void {
    this.gameState = this.game.getState();

    this.game.stateChanged.subscribe(
      state => this.gameState = state
    )
  }
}
