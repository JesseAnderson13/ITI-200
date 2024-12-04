const { Client } = require("pg");
const bodyParser = require("body-parser");
const express = require("express");
const crypto = require("crypto");
const querystring = require("querystring")
const request = require('request');

const app = express();
const port = 80;

var clientId = 'fe8c98cd9a074e029da8b6c1f839c6f9';
var clientSecret = 'fe7b49ff15d6455684f11599b7f4ee40'
var redirectUri = 'http://localhost/callback';
var accessToken;

// Middleware
app.use(bodyParser.json());

// Database Connection
const db = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'streamsync',
    password: 'ITI200PROJ721',
    port: 5432,
});

db.connect()
    .then(() => console.log("Connected to PostgreSQL database"))
    .catch((err) => console.error("Connection error", err.stack));

// Serve Static Files
app.use(express.static("public"));

// Login API
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const query = "SELECT * FROM users WHERE username = $1 AND password = $2";
        const result = await db.query(query, [username, password]);

        if (result.rows.length > 0) {
            res.status(200).json({ message: "Login successful" });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

app.get('/login', function(req, res) {
    var state = generateRandomString(16);
    var scope = 'user-read-private user-read-email user-modify-playback-state';
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: clientId,
            scope: scope,
            redirect_uri: redirectUri,
            state: state
        })
    );
});

app.get('/callback', function (req, res) {
    var code = req.query.code || null;
    var state = req.query.state || null;
    
    if (state === null) {
      res.redirect('/#' +
        querystring.stringify({
          error: 'state_mismatch'
        }));
    } else {
      var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
          code: code,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code'
        },
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + (new Buffer.from(clientId + ':' + clientSecret).toString('base64'))
        },
        json: true
      };
    }

    request.post(authOptions, function(error, response, body) {
        if (error) {
            console.error('Request Error:', error);
            res.redirect('/#' +
                querystring.stringify({
                    error: 'invalid_token'
                }));
        } else {
            console.log('Response Status:', response.statusCode);
            if (response.statusCode === 200) {
                accessToken = body.access_token;
                console.log('Access Token:', accessToken);
                res.redirect('/index.html?' + querystring.stringify({ access_token: accessToken }));            } else {
                console.error('Error:', body);
                res.redirect('/#' +
                    querystring.stringify({
                        error: 'invalid_token'
                    }));
            }
        }
    });
});
  

const generateRandomString = (length) => {
    return crypto
    .randomBytes(60)
    .toString('hex')
    .slice(0, length);
}

/*
app.post('/api/videoData', (req, res) => {
    const receivedVideoData = req.body;
    console.log(receivedVideoData.title);

    res.json({ message: "Data received"});
})

app.get('/api/videoData', async (req, res) => {
    console.log('test');
    const query = req.body.title;
    const type = 'track';
    const limit = 1;
    const searchURL = 'https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${type}&limit=${limit}';

    const response = await fetch(searchURL, {
        headers: {
            'Authorization': 'Bearer ${accessToken}'
        }
    })

    console.log(response);
});
*/

// Start Server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});