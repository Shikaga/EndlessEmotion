class DJ {
    constructor(chatGPTHandler, elevenLabsHandler, spotifyHandler, peristsFile) {
        this.chatGPTHandler = chatGPTHandler;
        this.elevenLabsHandler = elevenLabsHandler;
        this.spotifyHandler = spotifyHandler;
        this.primer = `Generate text as though you were Fernando from the Radio Station Emotion 98.3 in GTA Vice City.
        Return a response where the first line is your message and the second line is the ONLY the song you want to play.
        Separate the lines with a "---" (three dashes) string.
        Separate the song and the artist with "by".
        Include the name of the song in your message in the first line.
    Can you please tell me segue into a song straight away, don't say "Of course" or anything like that? 
    Don't forget to introduce yourself. And whatever you do DO NOT play Careless Whisper. `
        this.followUp = "Perfect, can you segue into a new song?";
        this.currentValues = {};
        this.nextValues = null;
        this.peristsFile = peristsFile;
    }

    async begin() {
        global.logger.info("DJ is starting");
        this.currentValues = await this.getAllValuesFromPrompt(this.primer);
        global.logger.info("DJ has finished the primer");
        global.logger.info("DJ got the next values", this.currentValues);

        await this.peristFile();

        //Repeat the above
        //Set a timer to Repeat again after the current song has finished.

        console.log("Getting first next values")
        this.nextValues = await this.getAllValuesFromPrompt(this.followUp, this.currentValues.trackEnd-10000);
        await this.peristFile();
        console.log("Got first next values and persisted file");

        let timeUntilCurrentSongExpires = this.currentValues.trackEnd - Date.now();
        console.log("timeUntilCurrentSongExpires 1", timeUntilCurrentSongExpires);
        setTimeout(() => {
            this.songFinished();
        }, timeUntilCurrentSongExpires);
        
    }

    async songFinished() {
        console.log("We think the song has finished")
        this.currentValues = this.nextValues;
        this.nextValues = null;
        console.log("Set next to current and cleared next");
        await this.peristFile();
        console.log("Persisted file");

        let timeUntilCurrentSongExpires = this.currentValues.trackEnd - Date.now();
        console.log("timeUntilCurrentSongExpires", timeUntilCurrentSongExpires);
        
        console.log("Getting next values")
        this.nextValues = await this.getAllValuesFromPrompt(this.followUp, this.currentValues.trackEnd-10000);
        console.log("Got next values")
        await this.peristFile();
        console.log("Persisted file with next values");

        setTimeout(() => {
            this.songFinished();
        }, timeUntilCurrentSongExpires);
    }

    async getAllValuesFromPrompt(prompt, startFrom) {
        if (startFrom == null) {
            startFrom = Date.now();
        }

        let nextMessage = await this.chatGPTHandler.getNextMessage(prompt);
        this.audio = await this.elevenLabsHandler.getAudioFromDialog(nextMessage.message);
        this.trackInfo = await this.spotifyHandler.searchTrackInfo(nextMessage.song, nextMessage.artist);

        if (this.trackInfo == null) {
            console.log("Could not find track info for", nextMessage.song, nextMessage.artist);
            global.logger.error("Could not find track info for", nextMessage.song, nextMessage.artist);
            //chatGPTMustForgetItsLastMessages();
            global.logger.error("Asking ChatGPTHandler to forget the last message");
            this.chatGPTHandler.forgetLastMessage();
            global.logger.error("Picking a new request", prompt, startFrom);
            return this.getAllValuesFromPrompt(prompt, startFrom);
        }


        let now = startFrom;
        console.log("It is now", now);
        console.log("The duration of the audio is", this.audio.duration);
        let values = {
            dialogLocation: this.audio.location,
            dialogStart: now + 5000,
            dialogLength: this.audio.duration,
            dialogEnd: now + 5000 + this.audio.duration*1000,
            trackURI: this.trackInfo.uri,
            trackStart: now + this.audio.duration * 1000, //Because the audio will start in 5 seconds, this will start 5 seconds before the dialog ends
            trackEnd: now + this.audio.duration * 1000 + this.trackInfo.duration_ms
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

    getCurrentValues() {
        return this.currentValues;
    }


}

exports.DJ = DJ;