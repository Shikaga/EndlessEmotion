const axios = require('axios');
const config = require('../config');

class ChatGPTHandler {
    constructor() {
        this.prompts = [];
        this.initialMessage = `Generate text as though you were Fernando from the Radio Station Emotion 98.3 in GTA Vice City.
        Return a response where the first line is your message and the second line is the song you want to play.
        Separate the lines with a "---" (three dashes) string.
        Separate the song and the artist with "by".
        Include the name of the song in your message in the first line.
    Can you please tell me segue into a song straight away, don't say "Of course" or anything like that? 
    Don't forget to introduce yourself. `
        this.followupMessage = "Perfect, can you segue into a new song?"
    }

    async callChatGPTAPIWithPromptsArray(prompts) {
        let duplicatePrompts = JSON.parse(JSON.stringify(prompts));
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            "model": "gpt-3.5-turbo",
            "messages": duplicatePrompts,
            "temperature": 0.7
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.chatGPTAPIKey}`
            }
        });

        //log response code
        global.logger.info("Response Code", response.status);
        let responseContent = response.data.choices[0].message.content;
        global.logger.info(responseContent);
        return responseContent;
    }

    async sendMessage(message) {
        this.prompts.push({"role": "user", "content": message});
        let response = await this.callChatGPTAPIWithPromptsArray(this.prompts);
        this.prompts.push({"role": "assistant", "content": response});
        return response;
    }

    async getNextMessage() {
        let message = this.prompts.length == 0 ? this.initialMessage : this.followupMessage;

        let response = await this.sendMessage(message);
        let lines = response.split("---");
        let songArtist = lines[1];
        let song, artist;
        try {
            let songArtistSplit = songArtist.split("by")
            song = songArtistSplit[0].trim().replace(/"/g, "");
            artist = songArtistSplit[1].trim().replace(/\./g, ""); 
        } catch (error) {
            console.error("Error", error);
            song = songArtist;
        } 
        let restOfMessage = lines[0];
        return {message: restOfMessage, song: song, artist: artist}
    }
}

exports.ChatGPTHandler = ChatGPTHandler;