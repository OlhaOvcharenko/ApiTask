const express = require('express');
const cors = require('cors');
//const opn = require('opn');

const app = express();

// import routes
const testimonialsRoutes = require('./routes/testimonials.routes');
const concertsRoutes = require('./routes/concerts.routes');
const seatsRoutes = require('./routes/seats.routes');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use('/api', testimonialsRoutes); 
app.use('/api', concertsRoutes); 
app.use('/api', seatsRoutes); 

app.use((req, res) => {
  res.status(404).json({message: 'Not found...'});
});
   
 
const port = 8000;
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
  //opn(`http://localhost:${port}/api`);
});
