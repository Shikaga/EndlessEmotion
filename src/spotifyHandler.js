const axios = require('axios');
const config = require('../config');

class SpotifyHandler {
    constructor(Spotify, token) {
        this.token = token;

        const player = new Spotify.Player({
            name: 'Web Playback SDK Quick Start Player',
            getOAuthToken: cb => { cb(token); },
            volume: 0.5
        });

        this.player = player;

        // Ready
        player.addListener('ready', ({ device_id }) => {
            console.log('Ready with Device ID', device_id);
        });

        // Not Ready
        player.addListener('not_ready', ({ device_id }) => {
            console.log('Device ID has gone offline', device_id);
        });

        player.addListener('initialization_error', ({ message }) => {
            console.error(message);
        });

        player.addListener('authentication_error', ({ message }) => {
            console.error(message);
        });

        player.addListener('account_error', ({ message }) => {
            console.error(message);
        });

        player.connect();
    }

    togglePlay() {
        this.player.togglePlay();
    }

    callBackWhenSongIsDone(callback) {
        this.callback = callback;
    }

    async searchAndPlaySong(song, artist) {
        let token = await this.getAccessToken();
        let track = await this.searchTrackInfo(song, artist, token);
        let endOfSongInMillis = track.duration_ms - 15000;
        setTimeout(() => {
            console.log("callback!")
            this.callback();
        }, endOfSongInMillis);
        this.playSong(token, track.uri);
    }

    async searchTrackInfo(song, artist) {
        debugger;
        let accessToken = await this.getAccessToken();
        let query = `track:${song} artist:${artist}`;

        console.log(accessToken)
        debugger;
        const response = await axios.get(`https://api.spotify.com/v1/search?type=track&limit=1&q=${query}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });



        const data = await response.data;
  
        console.log("Tracks", data.tracks)
        return data.tracks.items[0];
    }

    async  getAccessToken() {
        // var hash = window.location.hash.substring(1);
        // var token = hash.split('&')[0].split('=')[1];
        // return token;
        return this.token;
    }

    async playSong(accessToken, songUri) {
        try {
            const deviceId = "b771d1e95aa687e81c63b4039b7d0a258cf25c53"; //await this.getActiveDevice(accessToken);

            const response = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
            method: 'PUT',
            body: JSON.stringify({
                uris: [songUri]
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
            });

            if (!response.ok) {
            throw new Error('Failed to play song');
            }

            console.log('Song started playing');
        } catch (error) {
            console.error('Error:', error.message);
        }
    }

    async  getActiveDevice(accessToken) {
        const response = await fetch('https://api.spotify.com/v1/me/player/devices', {
            headers: {
            'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to get devices');
        }

        const data = await response.json();
        const activeDevice = data.devices.find(device => device.is_active);

        if (!activeDevice) {
            throw new Error('No active device found');
        }
        console.log(activeDevice.id);

        return activeDevice.id;
    }

    authorise() {
        var client_id = '68aa288b71004584b31b783b785b33fe';
        var redirect_uri = 'http://127.0.0.1:8888/callback';

        var state = this.generateRandomString(16);

        localStorage.setItem("stateKey", state);
        var scope = 'user-read-private user-read-email streaming user-read-playback-state user-modify-playback-state';

        var url = 'https://accounts.spotify.com/authorize';
        url += '?response_type=token';
        url += '&client_id=' + encodeURIComponent(client_id);
        url += '&scope=' + encodeURIComponent(scope);
        url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
        url += '&state=' + encodeURIComponent(state);

        //redirect to the url
        window.location.href = url;
    }

    

    generateRandomString(length) {
        return Math.random().toString().substr(0,16);
    }
}

exports.SpotifyHandler = SpotifyHandler;