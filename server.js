const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors'); // Make sure this is installed
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');

// Connect to MongoDB
mongoose.connect('mongodb+srv://user1:123@cluster0.ec9tf.mongodb.net/book', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    retryWrites: true,
    w: 'majority'
})
.then(() => console.log('MongoDB connected successfully!'))
.catch(err => console.error('MongoDB connection error:', err));

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Request logger
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

// Enable CORS with specific options
app.use(cors({
    origin: 'http://localhost:3000', // Or your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

// Add request timeout middleware
app.use((req, res, next) => {
  req.setTimeout(5000, () => {
    console.error('Request timeout:', req.url);
    res.status(504).json({ error: 'Request timeout' });
  });
  next();
});

// Add connection health check
app.get('/api/health', (req, res) => {
  res.json({
    dbConnected: mongoose.connection.readyState === 1,
    collections: {
      bestSellers: mongoose.connection.collections['best-sellers'] ? true : false,
      trending: mongoose.connection.collections['trending-books'] ? true : false
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});