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

let currentToken = "BQArsUhZV7lYPV1oJFi0SfPogvJ56gXsfpntCeuOqsMiTM9lvXShKrdi9kqEiSv1wH6LzZb1d9UTwvyRSJ13OzGZvuFQaw04hraU9lOVwjUMRuyoZtH_HnrEZUcKtBrJLzTX8rzy2qbw0Cly7jw73HpynRkcQj3aeZ916tL4e9pmrI4CXERke4_Uk4knV5--aZT-fQ";
async function testSpotifyAPI() {
    let spotifyHandler = new SpotifyHandler(currentToken);

    // let response = await spotifyHandler.searchTrackInfo("Yesterday", "The Beatles");
    // console.log(response);

    let token = await spotifyHandler.getAccessToken();
    console.log(token)
}

testSpotifyAPI();