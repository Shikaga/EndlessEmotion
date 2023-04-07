const winston = require('winston');
const express = require('express');
const path = require('path');

const { ChatGPTHandler } = require('./chatGPTHandler');
const { ElevenLabsHandler } = require('./elevenLabsHandler');
const { SpotifyHandler } = require('./spotifyHandler');
const { DJ } = require('./dj');

let feOnly;

let uniqueLoggingFileName = 'app.log' + new Date().toISOString().replace(/:/g, '-');
let logFileDirectory = 'logs';
let logFilePath = logFileDirectory + '/' + uniqueLoggingFileName;

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'my-app' },
    transports: [
        new winston.transports.File({ filename: logFilePath }),
        new winston.transports.Console(),
    ]
});

global.logger = logger;

if (process.argv.indexOf('--fe-only') > -1) {
    logger.info('Running front-end only');
    feOnly = true;
} else {
    logger.info('Running full stack');
    feOnly = false;
}

// Log unhandled exceptions
process.on('uncaughtException', (err) => {
    logger.error(`Uncaught exception: ${err.message}`);
    logger.error(err.stack);
});

// Log unhandled promise rejections
process.on('unhandledRejection', (err) => {
    logger.error(`Unhandled rejection: ${err.message}`);
    logger.error(err.stack);
});

logger.info('Hello world');
console.log('Hello again world');

function setupExpressServer() {
    const app = express();

    // Serve static files from the public directory
    app.use(express.static(path.join(__dirname, 'public')));

    // Serve the index.html file
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });

    // Start the server
    app.listen(3000, () => {
        console.log('Server started on port 3000');
    });
}

function setupServer() {
    global.logger.info("Setting up server");
    let chatGPTHandler = new ChatGPTHandler();
    let elevenLabsHandler = new ElevenLabsHandler();
    let spotifyHandler = new SpotifyHandler();

    let dj = new DJ(chatGPTHandler, elevenLabsHandler, spotifyHandler, "src/public/audioInfo.json");
    dj.begin();
}

setupExpressServer();
if (!feOnly) {
    setupServer();
}

