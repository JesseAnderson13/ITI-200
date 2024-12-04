var player;
var songData;

function onYouTubeIframeAPIReady() {
	player = new YT.Player('player', {
		height: '0',
		width: '0',
		videoId: '',
		events: {
			'onReady': onPlayerReady, 
			'onStateChange': onPlayerStateChange
		}
	});
}

function onPlayerReady(event) {
	console.log('ready', event);
}

function onPlayerStateChange(event) {
	if (event.data == YT.PlayerState.PLAYING) {
		console.log('playing');
	}
}

function getYouTubeURL() {
	const url = document.getElementById('YouTubeURL').value;
	const videoId = extractVideoId(url)
	if (videoId) {
		player.setSize(640,390);
		player.loadVideoById(videoId);
	} else {
		alert('Invalid YouTube URL');
	}
}

function extractVideoId(url) {
	const regex = /[?&]v=([^&#]*)/;
	const match = url.match(regex);
	return (match && match[1]) ? match[1] : null;
}

document.addEventListener("DOMContentLoaded", function() {
	onYouTubeIframeAPIReady();
});

async function search() {
	const accessToken = await getAccessToken();
	var videoData = player.getVideoData();
	const query = videoData.title;
    const type = 'track';
    const limit = 1;
    const searchURL = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${type}&limit=${limit}`;

    const response = await fetch(searchURL, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })

	songData = await response.json();
	alert("We've found the song " + songData.tracks.items[0].name + " by " + songData.tracks.items[0].artists[0].name);
}

async function play(){
	console.log('playing');
	const accessToken = await getAccessToken();
	console.log(songData.tracks.items[0].uri);
	const response = await fetch('https://api.spotify.com/v1/me/player/play', {
		method: 'PUT',
		headers: {
			'Authorization': `Bearer ${accessToken}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			uris: [songData.tracks.items[0].uri]
		})
	});
}



async function getAccessToken() {
	const params = new URLSearchParams(window.location.search);
	const accessToken = params.get('access_token');
	return accessToken;
}