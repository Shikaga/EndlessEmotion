export class SpotifyClient {
    constructor() {
    }

    async playSong(songUri, positionInMs) {
        console.log("Playing song: " + songUri);
        console.log("starting at: " + positionInMs)
        try {
            const accessToken = await this.getAccessToken();
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

            const response2 = await fetch(`https://api.spotify.com/v1/me/player/seek?position_ms=${positionInMs}`, {
                method: 'PUT',
                body: JSON.stringify({
                    position_ms: 10000
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });
        } catch (error) {
            console.error('Error:', error.message);
        }
    }

    async getAccessToken() {
        var hash = window.location.hash.substring(1);
        var token = hash.split('&')[0].split('=')[1];
        return token;
    }
}