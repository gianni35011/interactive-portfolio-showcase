type EventCallback = (event: StateChangeEvent) => void;

class EventEmitter{
    private listeners: Map<string, EventCallback[]>;

    constructor() {
        this.listeners = new Map();
    }

    on(event: string, callback: EventCallback){
        if(!this.listeners.has(event)){
            this.listeners.set(event, []);
        }
        this.listeners.get(event)!.push(callback);
    }

    emit(event: string, data: StateChangeEvent): void{
        const callbacks = this.listeners.get(event);
        if(callbacks){
            callbacks.forEach(callback => callback(data));
        }

    }
}

export enum GameState{
    LOADING,
    MAIN_MENU,
    PLAYING,
    PAUSED,
    DIALOGUE,
    CAMERA_TRANSITION_ENTER,
    CAMERA_TRANSITION_EXIT,
    PORTFOLIO_VIEW,
    EDUCATION_VIEW,
    GAME_START_SCREEN,
    GAME_RESET,
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

    public npcViewType: 'portfolio' | 'education' = 'education';

    private constructor(){
        this.currentState = GameState.GAME_START_SCREEN;
        this.previousState = GameState.GAME_START_SCREEN;
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
            GameState.CAMERA_TRANSITION_ENTER,
            GameState.MAIN_MENU
        ]);

        this.addAllowedTransition(GameState.DIALOGUE, [
            GameState.PLAYING,
            GameState.CAMERA_TRANSITION_ENTER,
        ])

        this.addAllowedTransition(GameState.CAMERA_TRANSITION_ENTER, [
            GameState.PLAYING,
            GameState.PORTFOLIO_VIEW,
            GameState.EDUCATION_VIEW,
        ]);

        this.addAllowedTransition(GameState.PORTFOLIO_VIEW, [
            GameState.CAMERA_TRANSITION_EXIT,
        ]);

        this.addAllowedTransition(GameState.CAMERA_TRANSITION_EXIT, [
            GameState.PLAYING,
        ]);

        this.addAllowedTransition(GameState.EDUCATION_VIEW, [
            GameState.CAMERA_TRANSITION_EXIT,
        ])

        this.allowedTransitions.set(GameState.GAME_START_SCREEN, new Set([
            GameState.LOADING,
            GameState.PORTFOLIO_VIEW,
            GameState.EDUCATION_VIEW
        ]));
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

        console.log(`State transition: ${GameState[this.previousState]} -> ${GameState[newState]}`);
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
