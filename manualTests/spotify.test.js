const { SpotifyHandler } = require('../src/spotifyHandler');

const winston = require('winston');
const sinon = require('sinon');
let uniqueLoggingFileName = 'app.log' + new Date().toISOString().replace(/:/g, '-');
let logFileDirectory = 'testLogs';
let logFilePath = logFileDirectory + '/' + uniqueLoggingFileName;


global.logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'my-app' },
    transports: [
        new winston.transports.File({ filename: logFilePath })
    ]
});

let currentToken = "BQBKxwEmIJHC4F8aFIEWe8o0-I8Di8P3sJwYRWHoMc7iLRtuepo4_17lFDZUz3UJI1G4JQ5Q7_1L9eGtdrApIDtF-cBgtxTtXGkw5WgLrSb48dvvwq1Lvk6SJgbvKHymdWwZlPUlW5OG3BhAWDT4MuAe--w0UW5vgx45cWteRFEDnnRZc8lOixdKozzqYZMCs9NPdw"

async function testSpotifyAPI() {
    let spotifyMock = {
        Player: sinon.stub().returns({
            addListener() { },
            connect() { },
        })
    }
    let spotifyHandler = new SpotifyHandler(spotifyMock, currentToken);

    let response = await spotifyHandler.searchTrackInfo("Yesterday", "The Beatles");
    console.log(response);
}

testSpotifyAPI();