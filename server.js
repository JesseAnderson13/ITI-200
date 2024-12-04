const fs = require("fs");
const http = require("http");
const { Client } = require("pg");
const bodyParser = require("body-parser");
const express = require("express");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");  // Add Nodemailer

const app = express();
const port = 80;

// Set up body parser for JSON requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));  // For handling form submissions

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

// Email configuration- Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',  
    auth: {
        user: 'streamsyncservice@gmail.com',  
        pass: 'Andrew$7642' 
    }
});

// Serve static files 
app.use(express.static("pages"));
app.use("/scripts", express.static("scripts"));
app.use("/styles", express.static("styles"));

// Login page default (not working)
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/pages/login.html");
});

// Registration route to handle new user creation
app.post("/register", async (req, res) => {
    const { username, password } = req.body;

    // validation for username and password
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    try {
        // Check if the username already exists
        const checkUserQuery = "SELECT * FROM users WHERE username = $1";
        const checkUserResult = await db.query(checkUserQuery, [username]);

        if (checkUserResult.rows.length > 0) {
            return res.status(400).json({ message: "Username is already taken" });
        }

        // Hash (We don't need this but it was in the tutorial)
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into the database
        const insertUserQuery = "INSERT INTO users (username, password) VALUES ($1, $2)";
        await db.query(insertUserQuery, [username, hashedPassword]);

        res.status(201).json({ message: "User registered successfully!" });
    } catch (err) {
        console.error("Error during registration:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Login API
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const query = "SELECT * FROM users WHERE username = $1";
        const result = await db.query(query, [username]);

        if (result.rows.length > 0) {
            const user = result.rows[0];

            // Compare provided password with stored hashed password
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (isValidPassword) {
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

// Route to handle form submission from 'about.html' (Inquiry Form)
app.post("/send-inquiry", (req, res) => {
    const { name, email, message } = req.body;

    // Check if all fields are filled
    if (!name || !email || !message) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Setup email data
    const mailOptions = {
        from: email,  
        to: 'streamsyncservice@gmail.com',  // Receiver email
        subject: `Inquiry from ${name}`,
        text: `
            Name: ${name}
            Email: ${email}
            Message: ${message}
        `,
    };

    // Send the email - Nodemailer
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email:", error);
            return res.status(500).json({ message: "Error sending message" });
        }

        res.status(200).json({ message: "Message sent successfully!" });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
