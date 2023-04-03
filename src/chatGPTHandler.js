const axios = require('axios');
const config = require('../config');

class ChatGPTHandler {
    constructor() {
        this.prompts = [];
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

    async getNextMessage(prompt) {
        let message = prompt;

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