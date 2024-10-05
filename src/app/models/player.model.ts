export class Player {
  isCurrent = false;
  isSelected = false;
  selectionCount = 0;
  score = 0;
  scoreDiff = 0;

  get scoreDiffStr(): string {
    return this.scoreDiff >= 0 ? `+${this.scoreDiff}` : `${this.scoreDiff}`;
  }

  constructor(public name: string) {
  }

  static create(player: any): Player {
    const p = new Player(player.name);
    p.isCurrent = player.isCurrent;
    p.isSelected = player.isSelected;
    p.selectionCount = player.selectionCount;
    p.score = player.score;
    p.scoreDiff = player.scoreDiff;
    return p;
  }

  select() {
    this.selectionCount++;
    this.isSelected = true;
  }

  deselect() {
    if (!this.isSelected) {
      return;
    }

    this.selectionCount--;
    this.isSelected = this.selectionCount !== 0;
  }
}
