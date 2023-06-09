export class SpotifyClient {
    constructor(token) {
        this.token = token;
        this.selectedDeviceId = null;
    }

    async getListOfDevices() {
        try {
            const accessToken = this.token;
            if (!accessToken) {
                throw new Error('No access token');
            }
            const response = await fetch('https://api.spotify.com/v1/me/player/devices', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
            });
            return response.json().then(data => {
                let deviceList = document.getElementById("deviceList");
                //create a list of devices
                for (let i = 0; i < data.devices.length; i++) {
                    let device = data.devices[i];
                    let option = document.createElement("option");
                    option.text = device.name;
                    option.value = device.id;
                    deviceList.add(option);
                }

                this.selectedDeviceId = deviceList.options[deviceList.selectedIndex].value;

                deviceList.onchange = function () {
                    this.selectedDeviceId = deviceList.options[deviceList.selectedIndex].value;
                }.bind(this);
            })
            .catch(error => {
                throw new Error('Failed to get list of devices');
            });
        } catch (error) {
            throw new Error('Failed to get list of devices');
        }
    }

    async playSong(songUri, positionInMs) {
        console.log("Playing song: " + songUri);
        console.log("starting at: " + positionInMs)
        try {
            const accessToken = this.token;
            const deviceId = this.selectedDeviceId;

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
}