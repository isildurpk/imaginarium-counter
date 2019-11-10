import {Component, Input, OnInit} from '@angular/core';
import {Player} from '../models/player.model';
import {GameService, State} from '../game.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {
  @Input() player: Player;

  constructor(private game: GameService) { }

  ngOnInit() {
  }

  onPlayerClick() {
    this.game.clickPlayer(this.player);
  }

  onDeselect(event: MouseEvent): void {
    event.stopPropagation();
    this.game.deselectPlayer(this.player);
  }

  isNeedShowSelectionCount(): boolean {
    return this.game.getState() === State.WhoHaveBeenChosen && this.player.isSelected;
  }
}
