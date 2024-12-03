
const fs = require("fs");
const http = require("http");
const { Client } = require("pg");
const bodyParser = require("body-parser");
const express = require("express");

const app = express();
const port = 80;

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
app.use(express.static("pages"));
app.use("/scripts", express.static("scripts"));
app.use("/styles", express.static("styles"));

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

// Start Server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});