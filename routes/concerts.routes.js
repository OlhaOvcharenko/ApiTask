const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const db = require('./../db');

router.route('/concerts').get((req, res) => {
  res.json(db.concerts);
});
    
router.route('/concerts/:id').get((req, res) => {
  const concertId = parseInt(req.params.id);
  const concert = db.concerts.find(item => item.id === concertId);
  res.json(concert);
  
});
  
router.route('/concerts').post((req, res) => {

    const { perfomer, genre, price, day, image } = req.body;

  if (perfomer && genre && price && day && image) {
    const newConcert = {
      id: uuidv4(), // Generate a new UUID for each testimonial
      perfomer,
      genre,
      price,
      day, 
      image
    };

    db.concerts.push(newConcert);

    res.status(201).json({ message: 'OK' });
  } else {
    res.status(400).json({ error: 'All fields are required.' });
  }
});
  
router.route('/concerts/:id').put((req, res) => {
  const { id } = req.params;
  const { performer, genre, price, day, image } = req.body;

  const index = db.concerts.findIndex(item => item.id === parseInt(id));

  if (index !== -1 && performer && genre && price && day && image) {
    const updatedConcert = {
      ...db.concerts[index], 
      performer: performer || db.concerts[index].performer,
      genre: genre || db.concerts[index].genre,
      price: price || db.concerts[index].price,
      day: day || db.concerts[index].day,
      image: image || db.concerts[index].image,
    };

    db.concerts[index] = updatedConcert;

    res.json({ message: 'OK' });
  } else {
    res.status(404).json({ error: 'Data is not found.' });
  }
});
      
router.route('/concerts/:id').delete((req, res) => {
  const { id } = req.params;
  const index = db.concerts.findIndex(item => item.id === parseInt(id));

  if (index !== -1) {
    db.concerts.splice(index, 1);
    res.json({ message: 'OK' });
  } else {
    res.status(404).json({ error: ' Concert not found.' });
  }
});


module.exports = router;