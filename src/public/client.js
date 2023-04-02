console.log("Hello from client.js");

//fetch logs/test.json


class Client{
    constructor(directory, clientSpotify) {
        this.directory = directory;
        this.clientSpotify = clientSpotify;
        this.current;
        this.nextSong;
    }

    async getAudioFile() {
        return fetch(this.directory)
            .then(response => response.json())
    }

    async getAudioAndPlay() {
        let songData = this.getAudioFile();
        this.current = songData.current;
        this.playCurrentDialog();
        this.playCurrentSong();
    }

    async playCurrentDialog() {

    }

    async playCurrentSong() {
        let song = this.current;
        let now = Date.now();
        console.log(now, this.current.trackStart)
        if (now > this.current.trackStart && now < this.current.trackEnd) {
            this.clientSpotify.playSong(song.trackURI);
            //set progress of song next
        }
    }
}

exports.Client = Client;

//Set current song id
//Play current dialog
//Play current song

//poll to see if there is a new song
//if so play set a timer to play it at the right time
// and start polling again once the new song plays
