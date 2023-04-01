const sinon = require('sinon');
const axios = require('axios');
const expect = require('chai').expect;
const winston = require('winston');
const { ChatGPTHandler } = require('../src/chatGPTHandler.js');

describe('ChatGPT', function () {
    before(function () {
        global.logger = winston.createLogger({
            transports: [new winston.transports.Console()]
        });
        let axiosStub;
    });
    afterEach(function () {
        axiosStub.restore();
    });

    it('should return the expected response from the API', async function () {
        const mockResponse = {
            data: {
                choices: [{
                    message: {
                        content: 'This is a mock response from the ChatGPT API.'
                    }
                }]
            }
        };

        axiosStub = sinon.stub(axios, 'post').resolves(mockResponse);

        let chatGPT = new ChatGPTHandler();

        // Call your code that uses the ChatGPT API
        const response = await chatGPT.callChatGPTAPIWithPromptsArray("Test");

        console.log(response)
        // Verify that the response from your code matches the mock response
        expect(response).to.equal('This is a mock response from the ChatGPT API.');
    });

    it('should log the response from the API', async function () {
        const infoLogger = sinon.spy(global.logger, 'info');

        const mockResponse = {
            data: {
                choices: [{
                    message: {
                        content: 'Response which should be logged'
                    }
                }]
            }
        };

        axiosStub = sinon.stub(axios, 'post').resolves(mockResponse);

        let chatGPT = new ChatGPTHandler();

        // Call your code that uses the ChatGPT API
        const response = await chatGPT.callChatGPTAPIWithPromptsArray("Test");

        console.log(response)
        debugger;
        // Verify that the response from your code matches the mock response
        expect(response).to.equal('Response which should be logged');
        expect(infoLogger.calledWith('Response which should be logged')).to.be.true;


    });
});