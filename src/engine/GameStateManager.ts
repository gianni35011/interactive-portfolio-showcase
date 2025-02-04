import { EventEmitter } from "events";

export enum GameState{
    MAIN_MENU,
    PLAYING,
    PAUSED,
    DIALOGUE,
    CAMERA_TRANSITION,
    BROWSER,
}

export interface StateChangeEvent {
    newState: GameState;
    previousState: GameState;
}

export class GameStateManager{
    private static instance: GameStateManager;
    private currentState: GameState;
    private previousState: GameState;
    private eventEmitter: EventEmitter;
    private allowedTransitions: Map<GameState, Set<GameState>>;

    private constructor(){
        this.currentState = GameState.PLAYING;
        this.previousState = GameState.PLAYING;
        this.eventEmitter = new EventEmitter();
        this.allowedTransitions = new Map();
        this.initializeTransitions()
    }

    static getInstance(): GameStateManager{
        if(!GameStateManager.instance){
            GameStateManager.instance = new GameStateManager();
        }

        return GameStateManager.instance;
    }

    private initializeTransitions(){
        this.addAllowedTransition(GameState.PLAYING, [
            GameState.DIALOGUE,
            GameState.PAUSED,
            GameState.CAMERA_TRANSITION,
            GameState.MAIN_MENU
        ]);

        this.addAllowedTransition(GameState.DIALOGUE, [
            GameState.PLAYING,
            GameState.CAMERA_TRANSITION,
        ])

        this.addAllowedTransition(GameState.CAMERA_TRANSITION, [
            GameState.PLAYING,
        ]);

    }

    private addAllowedTransition(from: GameState, to: GameState[] | GameState){
        if(!this.allowedTransitions.has(from)){
            this.allowedTransitions.set(from, new Set());
        }

        const toStates = Array.isArray(to) ? to : [to];
        toStates.forEach( state => {
            this.allowedTransitions.get(from)!.add(state);
        });
    }

    canTransitionTo(from: GameState, to: GameState): boolean{
        return this.allowedTransitions.get(from)?.has(to) ?? false;
    }

    setState(newState: GameState): boolean{
        if(!this.canTransitionTo(this.currentState, newState)){
            console.warn(`Invalid state transition: ${GameState[this.currentState]} -> ${GameState[newState]}`);
            return false;
        }

        this.previousState = this.currentState;
        this.currentState = newState;

        const stateChangeEvent: StateChangeEvent = {
            newState,
            previousState: this.previousState
        };

        this.eventEmitter.emit(`state:exit:${GameState[this.previousState]}`, stateChangeEvent);
        this.eventEmitter.emit(`state:enter:${GameState[newState]}`, stateChangeEvent);

        return true;
    }

    onStateEnter(state: GameState, callback: (event: StateChangeEvent) => void): void {
        this.eventEmitter.on(`state:enter:${GameState[state]}`, callback);
    }

    onStateExit(state: GameState, callback: (event: StateChangeEvent) => void): void {
        this.eventEmitter.on(`state:exit:${GameState[state]}`, callback);
    }

    get state(): GameState {
        return this.currentState;
    }

    get previous(): GameState{
        return this.previousState;
    }
}
