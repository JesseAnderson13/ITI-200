var player; 	//YouTube player object
var songData;	//data from the Spotify search API

//redirects the user to the Spotify authentication flow
function redirToSpotifyAuth(){
	window.location.assign('auth')
}

//removes the defallt text from the URL input when the user clicks it
//adds the default text back when the user clicks somehwere else and the input is empty
document.addEventListener("DOMContentLoaded", function() {
    const input = document.getElementById('YouTubeURL');
    const defaultText = "Enter a link to a song on YouTube!";

    input.addEventListener('focus', function() {
        if (input.value === defaultText) {
            input.value = '';
        }
    });

    input.addEventListener('blur', function() {
        if (input.value === '') {
            input.value = defaultText;
        }
    });
});

//constructs the YouTube player
function onYouTubeIframeAPIReady() {
	player = new YT.Player('player', {
		height: '0',
		width: '0',
		videoId: '',
	});
}

//grabs the url from the input and plays that video on the site
//if the url is invalid gives an alert
function playVideo() {
	const url = document.getElementById('YouTubeURL').value;
	const videoId = extractVideoId(url)
	if (videoId) {
		player.setSize(640,390);
		player.loadVideoById(videoId);
	} else {
		alert('Invalid YouTube URL');
	}
}

//used by playVideo(), extracts the video ID from the video URL
function extractVideoId(url) {
	const regex = /[?&]v=([^&#]*)/;
	const match = url.match(regex);
	return (match && match[1]) ? match[1] : null;
}

//sets up the YouTube player when the page is loaded
document.addEventListener("DOMContentLoaded", function() {
	onYouTubeIframeAPIReady();
});

//uses the Spotify API to search for the title of the input YouTube video
//gets the first track that comes up in the results
//once a song is found, it is displayed in an alert
async function search() {
	const accessToken = await getAccessToken();
	var videoData = player.getVideoData();

	if(!accessToken){
		alert("Please authorize with Spotify using the button above!");
		return;
	}
	else if(!videoData.title){
		alert("Please submit a song on YouTube!");
		return;
	}

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

//uses the Spotify API to play the song we got from search()
//in a users spotify account. the spotify player must be "active" for this
//active meaning a song is playing or has been playing in the past ~1 minute
//on some instance of Spotify
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

//get the Spotify access token from the backend via URL parameters
async function getAccessToken() {
	const params = new URLSearchParams(window.location.search);
	const accessToken = params.get('access_token');
	return accessToken;
}