const expect = require('chai').expect;
const { DJ } = require('../src/dj');
const sinon = require('sinon');
const fs = require('fs');

describe('DJ', function() {
    let chatGPTHandlerMock;
    let elevenLabsMock;
    let spotifyMock;
    this.beforeEach(function() {
        //create a chatGPTHandler mock
        chatGPTHandlerMock = {
            getNextMessage: sinon.stub().resolves({
                message: "My Message", 
                song: "Careless Whisper", 
                artist: "George Michael", 
                duration_ms: 180000
            })
        };

        elevenLabsMock = {
            getAudioFromDialog: sinon.stub().resolves({"location": "audio", "duration": 180})
        };

        let spotifyStub = sinon.stub();
        spotifyStub.onCall(0).resolves({uri: "trackURI", duration_ms: 180000});
        spotifyStub.onCall(1).resolves({uri: "trackURI2", duration_ms: 180000});

        spotifyMock = {
            searchTrackInfo: spotifyStub
        }

        //delete the test.json file if it exists
        if (fs.existsSync('logs/test.json')) {
            fs.unlinkSync('logs/test.json');
        }



    });

    it('should send the primer as its first message', async function () {
        const dj = new DJ(chatGPTHandlerMock, elevenLabsMock, spotifyMock, "logs/test.json");
        await dj.getFirstValues();
        expect(chatGPTHandlerMock.getNextMessage.calledWith(dj.primer)).to.be.true;
    });

    it('should send the message to elevenLabs', async function () {
        const dj = new DJ(chatGPTHandlerMock, elevenLabsMock, spotifyMock, "logs/test.json");
        await dj.getFirstValues();

        //verify that elevenLabs was called with the correct message
        expect(elevenLabsMock.getAudioFromDialog.calledWith("My Message")).to.be.true;
    });

    it('should find the track information from spotify', async function () {
        const dj = new DJ(chatGPTHandlerMock, elevenLabsMock, spotifyMock,  "logs/test.json");
        await dj.getFirstValues();

        //verify that spotify was called with the correct message
        expect(spotifyMock.searchTrackInfo.calledWith("Careless Whisper", "George Michael")).to.be.true;
    });

    it('should save the current values', async function () {
        const dj = new DJ(chatGPTHandlerMock, elevenLabsMock, spotifyMock, "logs/test.json");
        await dj.getFirstValues();

        //verify that the audioLocation and time to play for 5 seconds from now was persisted
        let currentValues = await dj.getCurrentValues();
        expect(currentValues.dialogLocation).to.equal(`audio`);
        expect(currentValues.dialogStart).to.be.closeTo(Date.now() + 5000, 100);
        expect(currentValues.trackURI).to.equal(`trackURI`);
        expect(currentValues.trackStart).to.be.closeTo(Date.now() + 180 * 1000, 100);
    });

    it('should persist the current values to file when persistFile called', async function () {
        const dj = new DJ(chatGPTHandlerMock, elevenLabsMock, spotifyMock, "logs/test.json");
        // await dj.begin();

        dj.currentValues = {
            dialogLocation: "audio",
            dialogStart: Date.now() + 5000,
            trackURI: "trackURI",
            trackStart: Date.now() + 180 * 1000
        }

        dj.peristFile();

        //get test.json and verify that it contains the correct values
        const fs = require('fs');
        const data = fs.readFileSync("logs/test.json");
        let json = JSON.parse(data);
        const currentValue = json.current;
        expect(currentValue.dialogLocation).to.equal(`audio`);
        expect(currentValue.dialogStart).to.be.closeTo(Date.now() + 5000, 100);
        expect(currentValue.trackURI).to.equal(`trackURI`);
        expect(currentValue.trackStart).to.be.closeTo(Date.now() + 180 * 1000, 100);
    });

    it('should persist the next values to file when persistFile called', async function () {
        const dj = new DJ(chatGPTHandlerMock, elevenLabsMock, spotifyMock, "logs/test.json");
        // await dj.begin();

        dj.nextValues = {
            dialogLocation: "audio2",
            dialogStart: Date.now() + 5000,
            trackURI: "trackURI2",
            trackStart: Date.now() + 180 * 1000
        }

        dj.peristFile();

        //get test.json and verify that it contains the correct values
        const fs = require('fs');
        const data = fs.readFileSync("logs/test.json");
        let json = JSON.parse(data);
        const nextValue = json.next;
        expect(nextValue.dialogLocation).to.equal(`audio2`);
        expect(nextValue.dialogStart).to.be.closeTo(Date.now() + 5000, 100);
        expect(nextValue.trackURI).to.equal(`trackURI2`);
        expect(nextValue.trackStart).to.be.closeTo(Date.now() + 180 * 1000, 100);
    });

    it('should persist the current values when begin called', async function () {
        const dj = new DJ(chatGPTHandlerMock, elevenLabsMock, spotifyMock, "logs/test.json");
        debugger;
        await dj.getFirstValues();

        //get test.json and verify that it contains the correct values
        const fs = require('fs');
        const data = fs.readFileSync("logs/test.json");
        let json = JSON.parse(data);
        const currentValue = json.current;
        expect(currentValue.dialogLocation).to.equal(`audio`);
        expect(currentValue.dialogStart).to.be.closeTo(Date.now() + 5000, 100);
        expect(currentValue.trackURI).to.equal(`trackURI`);
        expect(currentValue.trackStart).to.be.closeTo(Date.now() + 180 * 1000, 100);
    });
})