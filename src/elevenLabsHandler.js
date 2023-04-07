const axios = require('axios');
const config = require('../config');
const https = require('https');
const fs = require('fs');
const ID3 = require('node-id3');

class ElevenLabsHandler {
    constructor() {
        this.name = 'eleven-labs';
        this.dialogFolder = 'src/public/dialogs/';
    }

    async makeHttpRequest(options, dialog , fileName) {
        return new Promise((resolve, reject) => {
            const req = https.request(options, res => {


                const file = fs.createWriteStream(fileName);

                res.pipe(file);

                file.on('finish', () => {
                    console.log('File saved successfully!');
                });

                file.on('error', error => {
                    console.error(`Error saving file: ${error.message}`);
                });

                let data = '';
                res.on('data', chunk => {
                    data += chunk;
                });

                res.on('end', () => {
                    resolve(data);
                });
            });

            req.on('error', error => {
                reject(error);
            });

            req.write(JSON.stringify({
                "text": dialog
            }))
            req.end();
        });
    }

    async getAudioDuration(filename) {

        return new Promise((resolve, reject) => {
            setTimeout(() => {
            fs.stat(filename, (error, stats) => {
                if (error) {
                  console.error(`Error getting file size: ${error.message}`);
                  return;
                }
              
                const fileSize = stats.size;
                const bitRate = 64; // default bit rate in kilobits per second
                console.log(`File size: ${fileSize} bytes`);
              
                const durationInSeconds = (fileSize * 8) / (bitRate * 1000);
              
                console.log(`Duration: ${durationInSeconds.toFixed(2)} seconds`);
                resolve(durationInSeconds);
              });
            }, 500); //So the file is totally loaded
        });

    }

    async getAudioFromDialog(dialog) {
        global.logger.info("ElevenLabsHandler: getAudioFromDialog with dialog: " + dialog);
        try {
            const options = {
                hostname: 'api.elevenlabs.io',
                port: 443,
                path: '/v1/text-to-speech/' + config.elevenLabsVoiceID,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'xi-api-key': config.elevenLabsAPIKey,
                    'accept': 'audio/mpeg',
                }
            }

            let uniqueFilename = 'dialog' + Date.now() + '.mp3';
            let uniqueFileLocation = this.dialogFolder + uniqueFilename;

            await this.makeHttpRequest(options, dialog, uniqueFileLocation);

            global.logger.info("ElevenLabsHandler: getAudioFromDialog response received");

            const duration = await this.getAudioDuration(uniqueFileLocation);
            global.logger.info("ElevenLabsHandler: getAudioFromDialog duration: " + duration);

            return {
                location: uniqueFilename,
                duration
            }
        } catch (error) {
            global.logger.error("ElevenLabsHandler: getAudioFromDialog error: " + error);
            if (error && error.response) {
                global.logger.error("ElevenLabsHandler: getAudioFromDialog error: " + JSON.stringify(error.response.data));
            } else {
                global.logger.error("ElevenLabsHandler: getAudioFromDialog No error data to log");
            }

        }

    }

}

exports.ElevenLabsHandler = ElevenLabsHandler;