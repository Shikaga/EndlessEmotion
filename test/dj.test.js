const expect = require('chai').expect;
const { DJ } = require('../src/dj');
const sinon = require('sinon');

describe('DJ', function() {
    let chatGPTHandlerMock;
    let elevenLabsMock;
    let spotifyMock;
    this.beforeEach(function() {
        //create a chatGPTHandler mock
        chatGPTHandlerMock = {
            getNextMessage: sinon.stub().resolves({message: "My Message", song: "Careless Whisper", artist: "George Michael"})
        };

        elevenLabsMock = {
            getAudioFromDialog: sinon.stub().resolves({"audio": "audio", "duration": 180})
        };

        spotifyMock = {
            searchTrackInfo: sinon.stub().resolves({uri: "trackURI", duration: "trackStart"})
        }
    });

    it('should send the primer as its first message and save response', async function () {
        const dj = new DJ(chatGPTHandlerMock, elevenLabsMock, spotifyMock);
        await dj.begin();

        //verify that the primer was sent
        expect(chatGPTHandlerMock.getNextMessage.calledWith(dj.primer)).to.be.true;

        let currentValues = await dj.getLastChatGPTValues();
        expect(currentValues.message).to.equal(`My Message`);
        expect(currentValues.song).to.equal(`Careless Whisper`);
        expect(currentValues.artist).to.equal(`George Michael`);
    });

    it('should send the message to elevenLabs', async function () {
        const dj = new DJ(chatGPTHandlerMock, elevenLabsMock, spotifyMock);
        await dj.begin();

        //verify that elevenLabs was called with the correct message
        expect(elevenLabsMock.getAudioFromDialog.calledWith("My Message")).to.be.true;
    });

    it('should find the track information from spotify', async function () {
        const dj = new DJ(chatGPTHandlerMock, elevenLabsMock, spotifyMock);
        await dj.begin();

        //verify that spotify was called with the correct message
        expect(spotifyMock.searchTrackInfo.calledWith("Careless Whisper", "George Michael")).to.be.true;
    });

    it('should persist the audioLocation and time to play for 5 seconds from now', async function () {
        const dj = new DJ(chatGPTHandlerMock, elevenLabsMock, spotifyMock);
        await dj.begin();

        //verify that the audioLocation and time to play for 5 seconds from now was persisted
        let currentValues = await dj.getCurrentValues();
        expect(currentValues.audioLocation).to.equal(`audio`);
        expect(currentValues.timeToPlay).to.be.closeTo(Date.now() + 5000, 100);
        expect(currentValues.trackURI).to.equal(`trackURI`);
        expect(currentValues.trackStart).to.be.closeTo(Date.now() + 180 * 1000, 100);
    });
})