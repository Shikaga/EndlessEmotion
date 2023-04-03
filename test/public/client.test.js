// const { Client } = require('../../src/public/client.js');

// const sinon = require('sinon');
// const expect = require('chai').expect;

// describe('Client', function() {
//     it('should play music if the current song is in progress', function() {

//         let clientSpotifyMock = {
//             playSong: sinon.spy(),
//         }
//         let fakeResponse = {
//             "current": {
//                 "audioLocation": "audio",
//                 "dialogStart": 1680420996487,
//                 "trackURI": "trackURI",
//                 "trackStart": 1680421171487,
//                 "trackEnd": 1680421291487
//             }
//         }

//         var client = new Client(null, clientSpotifyMock);
//         client.getAudioFile = sinon.stub().returns(fakeResponse);

//         const clock = sinon.useFakeTimers(1680421171488);

//         client.getAudioAndPlay();

//         expect(client.getAudioFile.calledOnce).to.be.true;
//         expect(clientSpotifyMock.playSong.calledWith('trackURI')).to.be.true;
//         clock.restore();
//     });

//     it('should not play music if the current song has not started', function() {

//         let clientSpotifyMock = {
//             playSong: sinon.spy(),
//         }
//         let fakeResponse = {
//             "current": {
//                 "audioLocation": "audio",
//                 "dialogStart": 1680420996487,
//                 "trackURI": "trackURI",
//                 "trackStart": 1680421171487,
//                 "trackEnd": 1680421291487
//             }
//         }

//         var client = new Client(null, clientSpotifyMock);
//         client.getAudioFile = sinon.stub().returns(fakeResponse);

//         const clock = sinon.useFakeTimers(1680421171486);

//         client.getAudioAndPlay();

//         expect(client.getAudioFile.calledOnce).to.be.true;
//         expect(clientSpotifyMock.playSong.calledWith('trackURI')).to.be.false;
//         clock.restore();
//     });

//     it('should not play music if the current song has finished', function() {

//         let clientSpotifyMock = {
//             playSong: sinon.spy(),
//         }
//         let fakeResponse = {
//             "current": {
//                 "audioLocation": "audio",
//                 "dialogStart": 1680420996487,
//                 "trackURI": "trackURI",
//                 "trackStart": 1680421171487,
//                 "trackEnd": 1680421291487
//             }
//         }

//         var client = new Client(null, clientSpotifyMock);
//         client.getAudioFile = sinon.stub().returns(fakeResponse);

//         const clock = sinon.useFakeTimers(1680421291488);

//         client.getAudioAndPlay();

//         expect(client.getAudioFile.calledOnce).to.be.true;
//         expect(clientSpotifyMock.playSong.calledWith('trackURI')).to.be.false;
//         clock.restore();
//     });
// });
