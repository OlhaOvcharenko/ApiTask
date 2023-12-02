const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const db = require('./../db');

router.route('/seats').get((req, res) => {
  res.json(db.seats);
});
      
router.route('/seats/:id')((req, res) => {
  const seatId = parseInt(req.params.id);
  const seat = db.seats.find(item => item.id === seatId);
  res.json(seat);
});
  
router.route('/seats').post((req, res) => {
  const { day, seat, client, email} = req.body;

  if (day && seat && client && email) {
    const newSeat = {
      id: uuidv4(), 
      day, 
      seat,
      client,
      email
    };

    db.seats.push(newSeat);

    res.status(201).json({ message: 'OK' });
  } else {
    res.status(400).json({ error: 'All fields are required' });
  }
});
  
router.route('/seats/:id').delete((req, res) => {
  const { id } = req.params;
  const index = db.seats.findIndex(item => item.id === parseInt(id));

  if (index !== -1) {
    db.seats.splice(index, 1);
    res.json({ message: 'OK' });
  } else {
    res.status(404).json({ error: 'Testimonial not found.' });
  }
});
  
router.route('/seats/:id').put((req, res) => {
  const { id } = req.params;
  const { day, seat, client, email } = req.body;

  const index = db.seats.findIndex(item => item.id === parseInt(id));

  if (index !== -1 && day && seat && client && email) {
    
    const updatedSeat = {
      ...db.seats[index], 
      day: day || db.seats[index].day,
      seat: seat || db.seats[index].seat,
      client: client || db.seats[index].client,
      email: email || db.email[index].email,
    };

    db.seats[index] = updatedSeat;

    res.json({ message: 'OK' });
  } else {
    res.status(404).json({ error: 'Testimonial not found or missing data.' });
  }
});

module.exports = router;