import {GameState, GameStateManager} from "./GameStateManager.ts";

import WorldMusicUrl from "/public/assets/sounds/music/Echoes of Solitude.mp3";
import PortfolioMusicUrl from "/public/assets/sounds/music/PortfolioMusic.mp3";

export class MusicManager{
    private stateManager: GameStateManager;
    private currentTrack: HTMLAudioElement | null = null;
    private nextTrack: HTMLAudioElement | null = null;
    private tracks: Map<GameState, HTMLAudioElement> = new Map();
    private fadeInterval: number | null = null;
    private currentVolume = 0.1;

    constructor() {
        this.stateManager = GameStateManager.getInstance();
        this.setupTracks();
        this.setupStateListeners();
    }

    private setupTracks(){
        const playingMusic = new Audio(WorldMusicUrl);
        const portfolioMusic = new Audio(PortfolioMusicUrl);

        [playingMusic, portfolioMusic].forEach(track => {
            track.loop  = true;
            track.volume = 0;
            track.preload = 'auto';
        });

        this.tracks.set(GameState.PLAYING, playingMusic);
        this.tracks.set(GameState.CAMERA_TRANSITION_ENTER, portfolioMusic);
        this.crossFade(GameState.PLAYING, 1);
    }

    private setupStateListeners(){
        this.stateManager.onStateEnter(GameState.PLAYING, () => this.crossFade(GameState.PLAYING));
        this.stateManager.onStateEnter(GameState.CAMERA_TRANSITION_ENTER, () => this.crossFade(GameState.CAMERA_TRANSITION_ENTER));
    }

    private crossFade(newState: GameState, duration: number = 2000){
        const nextTrack:HTMLAudioElement | undefined  = this.tracks.get(newState);
        if(!nextTrack) return;

        if(!this.currentTrack){
            this.currentTrack = nextTrack;
            this.currentTrack.volume = this.currentVolume;
            this.currentTrack.play().catch(error => {
                console.error('Error playing current track:', error);
            });
            return;
        }

        if(this.currentTrack === nextTrack) return;

        if(this.fadeInterval){
            clearInterval(this.fadeInterval);
        }

        this.nextTrack = nextTrack;
        this.nextTrack.volume = 0;
        this.nextTrack.play().catch(error => {
            console.error('Error playing current track:', error);
        });

        const steps = 60;
        const stepTime = duration / steps;
        const volumeStep = this.currentVolume / steps;
        let currentStep = 0;

        this.fadeInterval = window.setInterval(() => {
            currentStep++;

            if(this.currentTrack){
                this.currentTrack.volume = Math.max(0, this.currentVolume - (volumeStep * currentStep));
            }

            if(this.nextTrack){
                this.nextTrack.volume = Math.max(0, volumeStep * currentStep);
            }

            if(currentStep >= steps){
                if(this.currentTrack){
                    this.currentTrack.pause();
                    this.currentTrack.volume = 0;
                }

                this.currentTrack = this.nextTrack;
                this.nextTrack = null;
                clearInterval(this.fadeInterval!);
                this.fadeInterval = null;
            }
        }, stepTime);

    }
}