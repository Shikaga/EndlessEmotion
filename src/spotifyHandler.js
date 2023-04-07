const winston = require('winston');
const axios = require('axios');
const config = require('../config');
const SpotifyWebApi = require('spotify-web-api-node');



class SpotifyHandler {
    constructor() {
        this.setupLogger();;
        this.initToken();
    }

    setupLogger() {

        let uniqueLoggingFileName = 'spotify.log' + new Date().toISOString().replace(/:/g, '-');
        let logFileDirectory = 'logs';
        let logFilePath = logFileDirectory + '/' + uniqueLoggingFileName;

        this.logger = winston.createLogger({
            level: 'info',
            format: winston.format.json(),
            defaultMeta: { service: 'spotify-handler' },
            transports: [
                new winston.transports.File({ filename: logFilePath }),
                new winston.transports.Console(),
            ]
        });
    }

    async searchTrackInfo(song, artist) {
        try {
            global.logger.info(`Searching for ${song} by ${artist}`);
            let accessToken = await this.getAccessToken();
            let query = `track:${song} artist:${artist}`;
            query = `${song} ${artist}` //Turns out Fernando doesn't know the correct names for songs and artists so it is worth letting spotify do the searching
            query = query.replace(/ /g, "%20");
            const response = await axios.get(`https://api.spotify.com/v1/search?type=track&limit=10&q=${query}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            
            const data = await response.data;
            const track = data.tracks.items[0];
            this.logger.info(`Searched for ${song} by ${artist} and found ${track.name} by ${track.artists[0].name}`);
            debugger;
            return track;
        } catch (error) {
            global.logger.error(`Error searching for ${song} by ${artist}`);
            global.logger.error(error);
            return null;
        }
    }

    async getAccessToken() {
        return new Promise((resolve, reject) => {
            if (this.accessToken) {
                resolve(this.accessToken);
            } else {
                let interval = setInterval(() => {
                    if (this.accessToken) {
                        clearInterval(interval);
                        resolve(this.accessToken);
                    }
                }, 1000);
            }
        });
    }

    async initToken() {
        return new Promise((resolve, reject) => {
            const clientId = config.spotifyClientId;
            const clientSecret = config.spotifyClientSecret;
            const redirectUri = config.spotifyRedirectUri;
            const authorizationCode = config.spotifyAuthorizationCode;

            this.spotifyApi = new SpotifyWebApi({
                clientId: clientId,
                clientSecret: clientSecret,
                redirectUri: redirectUri
              });

            this.spotifyApi.clientCredentialsGrant()
              .then(data => {
                console.log('Access token generated:', data.body.access_token);
                this.spotifyApi.setAccessToken(data.body.access_token);
                this.spotifyApi.setRefreshToken(data.body.refresh_token);

                setInterval(this.refreshAccessToken.bind(this), 1000 * 60 * 30);
                this.accessToken = data.body.access_token;
                resolve(data.body.access_token);
              })
              .catch(error => {
                console.log('Error generating access token:', error);
              });

        });
    }

    refreshAccessToken() {
        spotifyApi.refreshAccessToken()
          .then(data => {
            console.log('New access token generated:', data.body.access_token);
            spotifyApi.setAccessToken(data.body.access_token);
            spotifyApi.setRefreshToken(data.body.refresh_token);
            this.accessToken = data.body.access_token;
          })
          .catch(error => {
            console.log('Error refreshing access token:', error);
          });
      }
}

exports.SpotifyHandler = SpotifyHandler;