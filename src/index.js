const winston = require('winston');
const express = require('express');
const path = require('path');

let uniqueLoggingFileName = 'app.log' + new Date().toISOString().replace(/:/g, '-');
let logFileDirectory = 'logs';
let logFilePath = logFileDirectory + '/' + uniqueLoggingFileName;


const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'my-app' },
    transports: [
        new winston.transports.File({ filename: logFilePath })
    ]
});

logger.info('Hello world');
console.log('Hello again world');

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
