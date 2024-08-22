const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const User = require('./models/User');
const { spawn } = require('child_process');
const path = require('path'); // Import path module

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/loan', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Endpoint to check username availability
app.post('/check-username', async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already taken' });
    }
    return res.status(200).json({ message: 'Username is available' });
  } catch (error) {
    console.error('Error checking username:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Endpoint to check email availability
app.post('/check-email', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: 'Email already in use' });
    }
    return res.status(200).json({ message: 'Email is available' });
  } catch (error) {
    console.error('Error checking email:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Endpoint to handle user signup
app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Create a new user
    const newUser = new User({ username, email, password });
    await newUser.save();
    return res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ error: 'Error creating user' });
  }
});

// Endpoint to handle user login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Simulate a token 
    const token = 'dummy_token';
    return res.json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Endpoint to handle loan prediction
app.post('/predict', (req, res) => {
  const inputData = req.body;

  // Construct the path to the Python script
  const pythonScriptPath = path.join(__dirname, '..', 'src', 'app.py');

  // Spawn a new Python process
  const pythonProcess = spawn('python', [pythonScriptPath]);

  // Send input data to the Python script
  pythonProcess.stdin.write(JSON.stringify(inputData));
  pythonProcess.stdin.end();

  let outputData = '';

  // Collect data from the Python script
  pythonProcess.stdout.on('data', (data) => {
    outputData += data.toString();
  });

  // Handle end of Python script execution
  pythonProcess.on('close', (code) => {
    if (code !== 0) {
      return res.status(500).json({ error: 'Error executing Python script' });
    }

    try {
      const result = JSON.parse(outputData);
      return res.json(result);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return res.status(500).json({ error: 'Error parsing Python script output' });
    }
  });

  // Handle Python script errors
  pythonProcess.stderr.on('data', (data) => {
    console.error('Python script error:', data.toString());
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

