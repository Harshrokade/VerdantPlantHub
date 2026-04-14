require('dotenv').config(); // MUST BE FIRST
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');

// Connect to MongoDB Atlas
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/plants', require('./routes/plants'));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));