
export default class SoundManager{
    tracks = new Map();

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
}