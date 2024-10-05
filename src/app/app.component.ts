import { Component } from '@angular/core';

import { GameService, Stage } from './game.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  Stage = Stage; // для использования в шаблоне html

  get stage(): Stage {
    return this.game.getStage;
  }

  constructor(private game: GameService) {
  }
}
