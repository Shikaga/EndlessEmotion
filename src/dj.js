class DJ {
    constructor(chatGPTHandler, elevenLabsHandler, spotifyHandler, peristsFile) {
        this.chatGPTHandler = chatGPTHandler;
        this.elevenLabsHandler = elevenLabsHandler;
        this.spotifyHandler = spotifyHandler;
        this.primer = "primer";
        this.followUp = "followUp";
        this.currentChatGPTValues = {};
        this.currentValues = {};
        this.nextValues = {};
        this.peristsFile = peristsFile;
    }

    async begin() {
        this.currentValues = await this.getAllValuesFromPrompt(this.primer);
        await this.peristFile();
        //Wait till all returned
        //Persist"
            //the audioLocation and time to play for 5 seconds from now
            //the song ID and the time to start 5 seconds before the audio would end
        
        //Repeat the above
        //Set a timer to Repeat again after the current song has finished.
    }

    async getAllValuesFromPrompt(prompt) {
        this.currentChatGPTValues = await this.chatGPTHandler.getNextMessage(prompt);
        this.audio = await this.elevenLabsHandler.getAudioFromDialog(this.currentChatGPTValues.message);
            //Store the Eleven Labs Audio when returned
        this.trackInfo = await this.spotifyHandler.searchTrackInfo(this.currentChatGPTValues.song, this.currentChatGPTValues.artist);
 
        let values = {
            audioLocation: "audio",
            timeToPlay: Date.now() + 5000,
            trackURI: this.trackInfo.uri,
            trackStart: Date.now() + this.audio.duration * 1000 //Because the audio will start in 5 seconds, this will start 5 seconds before the dialog ends
        }
        return values;
    }

    async peristFile() {
        const fs = require('fs');
        let data = {
            current: this.currentValues,
            next: this.nextValues
        }
        await fs.writeFileSync(this.peristsFile, JSON.stringify(data));
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