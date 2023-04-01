const sinon = require('sinon');
const axios = require('axios');
const expect = require('chai').expect;
const { ChatGPTHandler } = require('../src/chatGPTHandler.js');

describe('ChatGPT Integration', function () {
    it('should return the expected response from the API', async function () {
        let chatGPT = new ChatGPTHandler();

        // Call your code that uses the ChatGPT API
        const response = await chatGPT.getChatGPTResponse([
            {"role": "user", "content": `
            Generate text as though you were Fernando from the Radio Station Emotion 98.3 in GTA Vice City.
            Return a response where the first line is your message and the second line is the song you want to play.
            Separate the lines with a "---" (three dashes) string.
            Separate the song and the artist with "by".
            Include the name of the song in your message in the first line.
        Can you please tell me segue into a song straight away, don't say "Of course" or anything like that? 
        Don't forget to introduce yourself. `}
        ]);
    });
});