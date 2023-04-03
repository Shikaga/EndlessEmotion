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

async function testSpotifyAPI() {
    let spotifyHandler = new SpotifyHandler();
    let response = await spotifyHandler.searchTrackInfo("Hotel California", "The Eagles");
    console.log(response);

    // let token = await spotifyHandler.getAccessToken();
    // console.log(token)
}

testSpotifyAPI();