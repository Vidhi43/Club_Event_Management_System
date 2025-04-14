require('dotenv').config(); // Load .env file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors({
    origin: 'http://127.0.0.1:5500', // allow only this specific origin
    methods: ['GET', 'POST'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type'] // Allowed headers
}));


// Middleware
app.use(bodyParser.json());

// MongoDB Connection
const uri = process.env.MONGO_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// Schema and Model
const DataSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    type: { 
        type: String, 
        required: true, 
        enum: ['member', 'student'], // Restrict to these values
        message: '{VALUE} is not a valid type' // Custom error message (optional)
    },
});

const EventSchema = new mongoose.Schema({
    eventname: { type: String, required: true },
    club: { type: String, required: true }
});


const DataModel = mongoose.model('Users', DataSchema);
const eventModel = mongoose.model('Events', EventSchema);
const studentModel = mongoose.model('Students', EventSchema);

// Routes
// 1. Add data to the database
app.post('/signup', async (req, res) => {
    try {
        const { username, password, type } = req.body;
        const newData = new DataModel({ username, password, type});
        await newData.save();
        res.status(201).json({ message: 'Data added successfully', data: newData });
    } catch (error) {
        res.status(500).json({ message: 'Error adding data', error });
    }
});

// 2. Get data from the database
app.get('/check', async (req, res) => {
    try {
        const data = await DataModel.find();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching data', error });
    }
});

app.post('/student-info', async (req, res) => {
    try {
        const { username } = req.body;
        const data = await studentModel.findOne({username});
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching data', error });
    }
});



app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body; 

        if (!username || !password) {
            return res.status(400).json({ message: 'Username/Password is required' });
        }

        const data = await DataModel.findOne(
            { username }, 
            { password: 1, type: 1, _id: 1 } 
        );

        if (!data) {
            return res.status(404).json({ message: 'User not found' });
        }
        if(data.password === password){
            res.status(200).json({type: data.type, token: 1 });
        }else{
            res.status(401).json({message: "bad credential"});
        }
    } catch (error) {
        console.error('Error in /login route:', error);
        res.status(500).json({ message: 'Error fetching data', error });
    }
});


app.post('/fetch-event', async (req, res) => {
    try {
        const { type, token } = req.body;

        // Validate input
        if (!type) {
            return res.status(400).json({ message: 'No Login Found contact at Student Section' });
        }
        

        const events = await eventModel.find();

        if (!events.length) {
            return res.status(404).json({ message: `No events` });
        }

        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching events', error });
    }
});


app.post('/put-event', async (req, res) => {
    try {
        const { type, token, eventname, club } = req.body;

        if ( !type || type!="member") {
            return res.status(401).json({ message: 'You are not a member contact at student section' });
        }
            const newData = new eventModel({ eventname, club});
            await newData.save();
            res.status(201).json({ message: 'Data added successfully', data: newData });
        } catch (error) {
            res.status(500).json({ message: 'Error adding data', error });
        }
});



// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
