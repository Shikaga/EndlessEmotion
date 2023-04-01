const axios = require('axios');
const config = require('../config');

class ChatGPTHandler {
    constructor() {
        this.apiKey = "TEMP";
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
}

exports.ChatGPTHandler = ChatGPTHandler;