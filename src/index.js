const winston = require('winston');

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