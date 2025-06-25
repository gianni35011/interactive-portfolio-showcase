import {AudioLoader, PositionalAudio, AudioListener} from "three";

export default class SoundManager{
    tracks = new Map();
    loopingTracks = new Map();
    positionalTracks = new Map();
    private audioListener: AudioListener | null = null;
    private static instance: SoundManager;

    constructor() {
        this.audioListener = new AudioListener();
    }

    static getInstance(): SoundManager{
        if(!SoundManager.instance){
            SoundManager.instance = new SoundManager();
        }

        return SoundManager.instance;
    }

    getListener(): AudioListener {
        return this.audioListener!;
    }

    load(key: string, paths: string[]){
        const trackList = paths.map(path => new Audio(path));
        this.tracks.set(key, trackList);
    }

    play(key: string): void{
        const trackList: HTMLAudioElement[] | undefined = this.tracks.get(key);
        if(!trackList || trackList.length === 0) return;
        const randomTrack: HTMLAudioElement = trackList[Math.floor(Math.random() * trackList.length)];
        randomTrack.play().catch(error => {
            console.log(`Error playing track: ${error}`);
        });
    }

    loadPositional(key: string, path: string, refDistance = 5, maxDistance = 20): PositionalAudio {
        const audioLoader = new AudioLoader();
        const positionalAudio = new PositionalAudio(this.audioListener!);

        audioLoader.load(path, (buffer) => {
            positionalAudio.setBuffer(buffer);
            positionalAudio.setRefDistance(refDistance);
            positionalAudio.setMaxDistance(maxDistance);
            positionalAudio.setLoop(true);
            positionalAudio.setVolume(5);
            positionalAudio.play();
        });

        this.positionalTracks.set(key, positionalAudio);
        return positionalAudio;
    }

    playPositional(key: string): void {
        const track = this.positionalTracks.get(key);
        if (!track || track.isPlaying) return;

        track.play();
    }

    stopPositional(key: string): void {
        const track = this.positionalTracks.get(key);
        if (!track || !track.isPlaying) return;

        track.stop();
    }
}
