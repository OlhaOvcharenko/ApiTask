const express = require('express');
const cors = require('cors');
const path = require('path');
const socket = require('socket.io');
const mongoose = require('mongoose');

const app = express();

const uri = `mongodb+srv://ovcharenkoolga2014:${process.env.DB_PASS}@cluster0.jwymdrz.mongodb.net/NewWaveDB?retryWrites=true&w=majority`;

const NODE_ENV = process.env.NODE_ENV;
let dbUri = '';

if (NODE_ENV === 'production') dbUri = uri;
else if (NODE_ENV === 'test') dbUri = 'mongodb://0.0.0.0:27017/NewWaveDBtest';
else dbUri = 'mongodb://0.0.0.0:27017/NewWaveDB';

mongoose.connect(dbUri);
const db = mongoose.connection;

db.once('open', () => {
  console.log('Connected to the database');
});
db.on('error', err => console.log('Error ' + err));

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

const io = socket(server);

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use((req, res, next) => {
  req.io = io;
  next();
});

const testimonialsRoutes = require('./routes/testimonials.routes');
const concertsRoutes = require('./routes/concerts.routes');
const seatsRoutes = require('./routes/seats.routes');

console.log('NODE_ENV:', NODE_ENV);
console.log('DB URI:', dbUri);

// Specify different base paths for each set of routes
app.use('/api', testimonialsRoutes);
app.use('/api', concertsRoutes);
app.use('/api', seatsRoutes);

app.use(express.static(path.join(__dirname, '/client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build/index.html'));
});

io.on('connection', socket => {
  console.log('New client! Its id – ' + socket.id);
});

app.use((req, res) => {
  res.status(404).json({ message: 'Not found...' });
});

module.exports = server;
