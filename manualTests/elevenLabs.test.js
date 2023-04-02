const { ElevenLabsHandler } = require('../src/elevenLabsHandler');

const winston = require('winston');
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

async function callElevenLabsAPI() {
    let elevenLabs = new ElevenLabsHandler();
    let audio = await elevenLabs.getAudioFromDialog("Hello! You are testing 11 labs!");
    //save audio to file
    const fs = require('fs');
    const file = fs.createWriteStream("testAudio.mp3");

}

callElevenLabsAPI();
