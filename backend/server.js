// Import required packages
const express = require('express');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRouter = require('./routes/auth')
// Create express app
const app = express();
const port = process.env.PORT || 3000;
app.use(cors({
  origin: 'http://localhost:5173' ,
  credentials: true
}))
app.use(express.json())
app.use(cookieParser())
// Connect to database
connectDB();  

// Basic route

app.get('/', (req, res) => {
  res.send('Welcome to Expensio!');
});

// Connect routes
app.use('/auth', authRouter);
app.use('/expenses', require('./routes/expenses'));
app.use('/ai', require('./routes/ai'));

// Start the server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});