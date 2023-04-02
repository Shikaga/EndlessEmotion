const axios = require('axios');
const config = require('../config');
const https = require('https');
const fs = require('fs');
const ID3 = require('node-id3');

class ElevenLabsHandler {
    constructor() {
        this.name = 'eleven-labs';
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
            // setTimeout(() => {
            //     fs.readFile(filename, (error, data) => {
            //         if (error) {
            //             console.error(`Error reading file: ${error.message}`);
            //             return;
            //         }
    
            //         const tags = ID3.read(data);
    
            //         if (tags && tags.duration) {
            //             const duration = tags.duration;
            //             console.log(`Duration: ${duration} seconds`);
            //             resolve(duration);
            //         } else {
            //             console.error('Error getting audio duration');
            //             reject();
            //         }
            //     });
            // }, 500);
            

            setTimeout(() => {
            fs.stat(filename, (error, stats) => {
                if (error) {
                  console.error(`Error getting file size: ${error.message}`);
                  return;
                }

                debugger;
              
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
        debugger;
        try {


            //convert this into http
            // const response = await axios.post('https://api.elevenlabs.io/v1/text-to-speech/ciiwqQciM04m3gd8dgzl', {
            //     "text": "hello" //dialog,
            //     // "voice_settings": {
            //     //     "stability": 0,
            //     //     "similarity_boost": 0
            //     // }
            // }, {
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'xi-api-key': config.elevenLabsApiKey,
            //         'accept': 'audio/mpeg',
            //     }
            // });

            debugger;
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
            let uniqueFileLocation = 'src/public/' + uniqueFilename;

            await this.makeHttpRequest(options, dialog, uniqueFileLocation);

            debugger;

            // req.on('error', error => {
            //     global.logger.error(error)
            // })

            // req.write(JSON.stringify({
            //     "text": "hello"
            // }))

            // req.end()




            global.logger.info("ElevenLabsHandler: getAudioFromDialog response received");

            const duration = await this.getAudioDuration(uniqueFileLocation);
            global.logger.info("ElevenLabsHandler: getAudioFromDialog duration: " + duration);

            return {
                location: 'filename.mpeg',
                duration
            }
            // const audioData = await response.data;
            // const audioData = await response.blob();
            // const audioUrl = URL.createObjectURL(audioData);
            // const audio = new Audio(audioUrl);

            // await new Promise(resolve => {
            //     audio.addEventListener('loadedmetadata', () => {
            //         console.log(`Audio duration: ${audio.duration}`);
            //         //setTimeout(() => {
            //         resolve();
            //         //}, audio.duration * 1000 - 3000);
            //     });

            // });


            // return audio;
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