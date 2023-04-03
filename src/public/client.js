export class Client {
    constructor(directory, clientSpotify) {
        this.directory = directory;
        this.clientSpotify = clientSpotify;
        this.current;
        this.next;
        this.currentNextDialog = null;
    }

    async getAudioFile() {
        return fetch(this.directory)
            .then(response => response.json())
    }

    async pollAudioFile() {
        let songData = await this.getAudioFile();
        console.log("Got audio file", songData)
        this.current = songData.current;
        this.next = songData.next;
        setTimeout(() => {
            this.pollAudioFile();
        }, 30000);
    }

    async getAudioAndPlay() {
        await this.pollAudioFile();
        this.playCurrentDialog();
        this.playCurrentSong();
        this.pollForNextAudio();
    }

    async pollForNextAudio() {
        console.log("Polling for next audio");
        this.currentNextDialog = this.next ? this.next.dialogLocation : null;
        this.playNextDialog();
        this.playNextSong();
        console.log("Setup next dialog");
        setInterval(() => {
            console.log("Next audio check");
            if (this.next && this.currentNextDialog !== this.next.dialogLocation) {
                console.log("Next dialog has changed, setting up new dialog");
                this.currentNextDialog = this.next.dialogLocation;
                this.playNextDialog();
                this.playNextSong();
            } else {
                console.log("Next dialog has not changed");
            }
        }, 30000);
    }

    async playDialog() {

    }

    async playNextDialog() {
        let dialog = this.next;
        if (dialog == null) {
            return;
        }
        let now = Date.now();
        let timeUntilDialogStart = dialog.dialogStart - now;
        console.log("Next dialog must play at", new Date(dialog.dialogStart));
        console.log("Playing new Dialog in", timeUntilDialogStart, "ms");
        setTimeout(() => {
            const audio = new Audio(dialog.dialogLocation);
            audio.play();
        }, timeUntilDialogStart);
    }

    async playNextSong() {
        let song = this.next;
        if (song == null) {
            return;
        }
        let now = Date.now();
        let timeUntilSongStart = song.trackStart - now;
        console.log("Next song must play at", new Date(song.trackStart));
        console.log("Playing new Song in", timeUntilSongStart, "ms");
        setTimeout(() => {
            this.clientSpotify.playSong(song.trackURI, 0);
        }, timeUntilSongStart);
    }


    async playCurrentDialog() {
        let dialog = this.current;
        let now = Date.now();
        console.log(now-this.current.dialogStart, now-this.current.dialogEnd)
        if (now > this.current.dialogStart && now < this.current.dialogEnd) {
            let timeSinceDialogStart = this.getTimeSinceAudioStart(this.current.dialogStart);
            const audio = new Audio(dialog.dialogLocation);
            audio.currentTime = timeSinceDialogStart / 1000;
            audio.play();
        }
    }

    async playCurrentSong() {
        let song = this.current;
        let now = Date.now();
        console.log("Now", new Date(now))
        console.log("Start", new Date(this.current.trackStart));
        console.log("End", new Date(this.current.trackEnd));
        if (now > this.current.trackStart && now < this.current.trackEnd) {
            let timeSinceTrackStart = this.getTimeSinceAudioStart(this.current.trackStart);
            this.clientSpotify.playSong(song.trackURI, timeSinceTrackStart);
        }
    }

    getTimeSinceAudioStart(trackStart) {
        let now = Date.now();
        return now - Math.floor(trackStart);
    }

}




//Set current song id
//Play current dialog
//Play current song

//poll to see if there is a new song
//if so play set a timer to play it at the right time
// and start polling again once the new song plays
