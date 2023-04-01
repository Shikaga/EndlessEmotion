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

    it('should send wrap and send the first message', async function () {
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
        const response = await chatGPT.sendMessage("Test");

        //message sent should be wrapped
        expect(axiosStub.calledWith('https://api.openai.com/v1/chat/completions', {
            "model": "gpt-3.5-turbo",
            "messages": [{"role": "user", "content": "Test"}],
            "temperature": 0.7
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sinon.match.any
            }
        })).to.be.true;

        // Verify that the response from your code matches the mock response
        expect(response).to.equal('This is a mock response from the ChatGPT API.');
    });

    it('should send the first message and response when a second message is sent', async function () {
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
        await chatGPT.sendMessage("Test");
        const response = await chatGPT.sendMessage("Test2");

        //message sent should be wrapped
        expect(axiosStub.calledWith('https://api.openai.com/v1/chat/completions', {
            "model": "gpt-3.5-turbo",
            "messages": [{"role": "user", "content": "Test"}],
            "temperature": 0.7
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sinon.match.any
            }
        })).to.be.true;

        expect(axiosStub.calledWith('https://api.openai.com/v1/chat/completions', {
            "model": "gpt-3.5-turbo",
            "messages": [
                {"role": "user", "content": "Test"},
                {"role": "assistant", "content": "This is a mock response from the ChatGPT API."},
                {"role": "user", "content": "Test2"}
            ],
            "temperature": 0.7
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': sinon.match.any
            }
        })).to.be.true;

        // Verify that the response from your code matches the mock response
        expect(response).to.equal('This is a mock response from the ChatGPT API.');
    });
});