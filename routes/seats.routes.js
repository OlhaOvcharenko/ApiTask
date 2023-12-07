const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const db = require('./../db');

router.route('/seats').get((req, res) => {
  res.json(db.seats);
});

router.route('/seats/random').get((req, res) => {
  const randomIndex = Math.floor(Math.random() * db.seats.length);
  const randomSeat = db.seats[randomIndex];
  res.json(randomSeat);
});
      
router.route('/seats/:id').get((req, res) => {
  const seatId = req.params.id;
  const seat = db.seats.find(item => {
    return item.id === seatId|| item.id === parseInt(seatId)
  });

  if (seat) {
    res.json(seat);
  } else {
    res.status(404).json({ error: 'Seat not found.' });
  }
});
  
router.route('/seats').post((req, res) => {
  const { day, seat, client, email} = req.body;

  if (db.seats.some(takenSeat => takenSeat.day.toString() === day && 
    takenSeat.seat.toString() === seat)){
    
    res.status(409).json({ error: 'The slot is already taken...' });

  } else {
    
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
  }

});
  
router.route('/seats/:id').delete((req, res) => {
  const { id } = req.params;
  const index = db.seats.findIndex(item => {
    return item.id === id || item.id === parseInt(id)
  });

  if (index !== -1) {
    db.seats.splice(index, 1);
    res.json({ message: 'OK' });
  } else {
    res.status(404).json({ error: 'Seat not found.' });
  }
});
  
router.route('/seats/:id').put((req, res) => {
  const { id } = req.params;
  const { day, seat, client, email } = req.body;

  const index = db.seats.findIndex(item => {
    return item.id === id || item.id === parseInt(id)
  });

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
    res.status(404).json({ error: 'Seat not found or missing data.' });
  }
});

module.exports = router;