class DJ {
    constructor(chatGPTHandler, elevenLabsHandler, spotifyHandler) {
        this.chatGPTHandler = chatGPTHandler;
        this.elevenLabsHandler = elevenLabsHandler;
        this.spotifyHandler = spotifyHandler;
        this.primer = "primer";
        this.currentChatGPTValues = {};
        this.currentValues = {};
    }

    async begin() {
        this.currentChatGPTValues = await this.chatGPTHandler.getNextMessage(this.primer);
        this.audio = await this.elevenLabsHandler.getAudioFromDialog(this.currentChatGPTValues.message);
            //Store the Eleven Labs Audio when returned
        this.trackInfo = await this.spotifyHandler.searchTrackInfo(this.currentChatGPTValues.song, this.currentChatGPTValues.artist);
 
        this.currentValues = {
            audioLocation: "audio",
            timeToPlay: Date.now() + 5000,
            trackURI: this.trackInfo.uri,
            trackStart: Date.now() + this.audio.duration * 1000 //Because the audio will start in 5 seconds, this will start 5 seconds before the dialog ends
        }
        //Wait till all returned
        //Persist"
            //the audioLocation and time to play for 5 seconds from now
            //the song ID and the time to start 5 seconds before the audio would end
        
        //Repeat the above
        //Set a timer to Repeat again after the current song has finished.
    }

    getLastChatGPTValues() {
        return this.currentChatGPTValues;
        //Get the current song from the database
    }

    getCurrentValues() {
        return this.currentValues;
    }


}

exports.DJ = DJ;