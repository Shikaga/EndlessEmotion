const axios = require('axios');
const config = require('../config');

class ChatGPTHandler {
    constructor() {
        this.apiKey = "TEMP";
        this.prompts = [];
    }

    async getChatGPTResponse(prompts) {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            "model": "gpt-3.5-turbo",
            "messages": prompts,
            "temperature": 0.7
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.chatGPTAPIKey}`
            }
        });

        let responseContent = response.data.choices[0].message.content;
        return responseContent;
    }
}

exports.ChatGPTHandler = ChatGPTHandler;