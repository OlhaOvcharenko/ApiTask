const express = require('express');
const router = express.Router();
const Seat = require('../models/seat.model')

router.get(('/seats'), async(req, res) => {
  try {
    res.json(await Seat.find());
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.get(('/seats/random'), async(req, res) => {
  try {
    const count = await Seat.countDocuments();
    const rand = Math.floor(Math.random() * count);
    const seat = await Seat.findOne().skip(rand);
    if (!seat) res.status(404).json({ message: 'Not found' });
    else res.json(seat);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});
      
router.get(('/seats/:id'), async(req, res) => {
  try {
    const seat = await Seat.findById(req.params.id);
    if(!seat)res.status(404).json({message: 'Not found..'});
    else res.json(seat);
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
});
  
router.post(('/seats'), async(req, res) => {
  try {
    const { day, seat, client, email} = req.body;
    const newSeat = new Seat({day, seat, client, email});
    await newSeat.save();
    res.json({message: 'OK'});
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
});
  
router.put(('/seats/:id'), async(req, res) => {
  const { day, seat, client, email} = req.body;
  try {
    const updateSeat = await Seat.findById(req.params.id);
    if(updateSeat) {
      updateSeat.day = day;
      updateSeat.seat = seat;
      updateSeat.client = client;
      updateSeat.email = email;
      await updateSeat.save();
      res.json(updateSeat);
    }
    else res.status(404).json({ message: 'Not found...' });

  }
  catch(err) {
    res.status(500).json({ message: err });
  }
});
  
router.delete(('/seats/:id'), async (req, res) => {
  try{
    const seat = await Seat.findById(req.params.id)
    if(seat){
      await Seat.deleteOne({ _id: req.params.id })
      res.json({message:"OK"})
    }
    else res.status(404).json({ message: 'Not found...' });
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
});

module.exports = router;