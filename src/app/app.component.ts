import { Component } from '@angular/core';

import { GameService, State } from './game.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  State = State; // для использования в шаблоне html

  get gameState(): State {
    return this.game.getState;
  }

  constructor(private game: GameService) {
  }
}
