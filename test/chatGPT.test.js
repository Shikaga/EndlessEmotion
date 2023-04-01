const sinon = require('sinon');
const axios = require('axios');
const expect = require('chai').expect;
const { ChatGPTHandler } = require('../src/chatGPTHandler.js');

describe('ChatGPT', function () {
    it('should return the expected response from the API', async function () {
        // Define your mock response
        const mockResponse = {data: {
            choices: [{
                message: {
                    content: 'This is a mock response from the ChatGPT API.'
                }
            }]
        }
        };

        const axiosStub = sinon.stub(axios, 'post').resolves(mockResponse);

        let chatGPT = new ChatGPTHandler();

        // Call your code that uses the ChatGPT API
        const response = await chatGPT.getChatGPTResponse("Test");

        console.log(response)
        // Verify that the response from your code matches the mock response
        expect(response).to.equal('This is a mock response from the ChatGPT API.');

        // Restore the axios.post method
        axiosStub.restore();
    });
});