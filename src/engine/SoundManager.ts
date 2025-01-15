
export default class SoundManager{
    tracks = new Map();

    load(key: string){
        const track = new Audio(key);
        this.tracks.set(key, track);
    }

    play(key: string){
        const track = this.tracks.get(key);
        if(!track) return;
        track.play();
    }
}