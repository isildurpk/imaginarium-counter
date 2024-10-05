import { GameRoundState } from "./game-round-state.model";

export class GameState {
    public roundStates: GameRoundState[]

    constructor(parsedStateObject: any | null = null) {
        this.roundStates = parsedStateObject && parsedStateObject.roundStates || [];
    }

    public getLastRound(): GameRoundState {
        const roundStates = this.roundStates;
        return roundStates && roundStates.length > 0 && roundStates[roundStates.length - 1] || null;
    }

    public addRound(gameRoundState: GameRoundState): void {
        this.roundStates.push(gameRoundState);
    }

    public store() {
        localStorage.setItem('state', JSON.stringify(this));
    }

    public static restore(): GameState {
        const rawState = localStorage.getItem('state');
        if (rawState) {
            return new GameState(JSON.parse(rawState));
        }

        return new GameState();
    }
}