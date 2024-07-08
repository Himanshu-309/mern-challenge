// server/index.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const mongoURI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true, // useNewUrlParser is deprecated and has no effect since MongoDB Node.js Driver version 4.0.0
  useUnifiedTopology: true // useUnifiedTopology is deprecated and has no effect since MongoDB Node.js Driver version 4.0.0
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
const transactionsRoutes = require('./routes/transactions.js');
app.use('/api/transactions', transactionsRoutes);

// Example CORS setup in server/index.js
const cors = require('cors');

app.use(cors());
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


