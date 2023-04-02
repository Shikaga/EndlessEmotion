const axios = require('axios');
const config = require('../config');

class ElevenLabsHandler {
    constructor() {
        this.name = 'eleven-labs';
    }

    async getAudioFromDialog(dialog) {
        //Rewrite this as axios
        // const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/' + config.elevenLabsVoiceID, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'xi-api-key': config.elevenLabsApiKey,
        //         'accept': 'audio/mpeg',
        //     },
        //     body: JSON.stringify({
        //         "text": text,
        //         "voice_settings": {
        //             "stability": 0,
        //             "similarity_boost": 0
        //         }
        //     })
        // });

        const response = await axios.post('https://api.elevenlabs.io/v1/text-to-speech/' + config.elevenLabsVoiceID, {
            "text": dialog,
            "voice_settings": {
                "stability": 0,
                "similarity_boost": 0
            }
        }, {
            headers: {
                'Content-Type': 'application/json',
                'xi-api-key': config.elevenLabsApiKey,
                'accept': 'audio/mpeg',
            }
        });

        const audioData = await response.blob();
        const audioUrl = URL.createObjectURL(audioData);
        const audio = new Audio(audioUrl);

        await new Promise(resolve => {
            audio.addEventListener('loadedmetadata', () => {
                console.log(`Audio duration: ${audio.duration}`);
                //setTimeout(() => {
                    resolve();
                //}, audio.duration * 1000 - 3000);
            });

        });

        return audio;
    }

}

exports.ElevenLabsHandler = ElevenLabsHandler;