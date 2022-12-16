const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API
app.get('/', (req, res) => {
    res.send('Ema John Simple Server Running!');
});

// Listener
app.listen(port, () => {
    console.log(`Ema John Simple Server running at ${port}`);
});
