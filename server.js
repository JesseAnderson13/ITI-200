const { Client } = require("pg");
const bodyParser = require("body-parser");
const express = require("express");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const querystring = require("querystring");
const request = require("request");

const app = express();
const port = 80;

var clientId = 'fe8c98cd9a074e029da8b6c1f839c6f9';
var clientSecret = 'fe7b49ff15d6455684f11599b7f4ee40';
var redirectUri = 'http://localhost/callback';
var accessToken;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
        const query = "SELECT * FROM users WHERE username = $1";
        const result = await db.query(query, [username]);

        if (result.rows.length > 0) {
            const user = result.rows[0];
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                res.status(200).json({ message: "Login successful" });
            } else {
                res.status(401).json({ message: "Invalid credentials" });
            }
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Register API
app.post("/register", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    try {
        const checkUserQuery = "SELECT * FROM users WHERE username = $1";
        const checkUserResult = await db.query(checkUserQuery, [username]);

        if (checkUserResult.rows.length > 0) {
            return res.status(400).json({ message: "Username is already taken" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const insertUserQuery = "INSERT INTO users (username, password) VALUES ($1, $2)";
        await db.query(insertUserQuery, [username, hashedPassword]);

        res.status(201).json({ message: "User registered successfully!" });
    } catch (err) {
        console.error("Error during registration:", err);
        res.status(500).json({ message: "Server error" });
    }
});


// Inquiry Submission API
app.post("/send-inquiry", async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).send("All fields are required.");
    }

    try {
        const insertQuery = "INSERT INTO inquiries (name, email, message) VALUES ($1, $2, $3)";
        await db.query(insertQuery, [name, email, message]);

        // Redirect back to the about page
        res.redirect("/pages/about.html");
    } catch (err) {
        console.error("Error saving inquiry:", err);
        res.status(500).send("Failed to submit inquiry. Please try again later.");
    }
});

//Spotify Authentication flow
app.get('/auth', function(req, res) {
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

//Spotify auth callback, this is where the user is sent after
//authorizing with Spotify. Sends the access token to the frontend
//via URL parameters
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
                res.redirect('/index.html?' + querystring.stringify({ access_token: accessToken }));
            } else {
                console.error('Error:', body);
                res.redirect('/#' +
                    querystring.stringify({
                        error: 'invalid_token'
                    }));
            }
        }
    });
});
  
//uses crypto library to generate a random string
//used by app.get('/auth' ...)
const generateRandomString = (length) => {
    return crypto
    .randomBytes(60)
    .toString('hex')
    .slice(0, length);
}

// Start Server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
