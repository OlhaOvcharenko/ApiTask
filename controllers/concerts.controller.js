const Concert = require('../models/concert.model');

exports.getAll = async(req, res) => {
  try {
    const concerts = await Concert.find();
    //console.log("All concerts", concerts)
    res.json(concerts);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.getRandom = async(req, res) => {
  try {
    const count = await Concert.countDocuments();
    const rand = Math.floor(Math.random() * count);
    const concert = await Concert.findOne().skip(rand);
    if (!concert) res.status(404).json({ message: 'Not found' });
    else res.json(concert);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
    
exports.getById =  async(req, res) => {
  try {
    const concert = await Concert.findById(req.params.id);

    if(!concert) { 
      res.status(404).json({message: 'Not found..'});
    } else {
      res.json(concert);
    }

  } catch(err) {
    res.status(500).json({ message: err });
  }
};


exports.addNewConcert = async (req, res) => {
  try {
    const { performer, genre, price, day, image } = req.body;
    const newConcert = new Concert({ performer, genre, price, day, image });
    await newConcert.save();
    res.json({ message: 'OK' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.updateConcert =  async (req, res) => {
  const { performer, genre, price, day, image } = req.body;
  try {
    const concert = await Concert.findById(req.params.id);
    if (concert) {
    concert.performer = performer; // Corrected property name
    concert.genre = genre;
    concert.price = price;
    concert.day = day;
    concert.image = image;
    await concert.save();
    res.json(concert);
    } else {
    res.status(404).json({ message: 'Not found...' });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.deleteConcert = async (req, res) => {
  try{
    const concert = await Concert.findById(req.params.id)
    if(concert){
    await Concert.deleteOne({ _id: req.params.id })
    res.json({message:"OK"})
    }
    else res.status(404).json({ message: 'Not found...' });
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};


//new controllers

exports.getByPerformer = async (req, res) => {
  try {
    const performer = req.params.performer.replace(/\+/g, ' ');
    const concertsByPerformer = await Concert.find({
      performer: { $regex: new RegExp(`^${performer}$`, 'i') }
    });

    if (!concertsByPerformer.length === 0) {
      res.status(404).json({ error: 'Concers are not found' });
    } else {
      res.json({ concerts: concertsByPerformer });
    }

  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};

exports.getByGenre = async (req, res) => {
  const { genre } = req.params;
  try {
    const concertsByGenre = await Concert.find({ genre: { $regex: new RegExp(genre, 'i') } });

    if (concertsByGenre.length === 0) {
      res.status(404).json({message: 'Not found..'});
    } else {
      res.json({concertsByGenre});
    }

  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};

exports.getByPrices = async (req, res) => {
  const { price_min, price_max } = req.params;

  try {
    const concertsByPrices = await Concert.find({
      $and: [
        { price: { $gte: Number(price_min) } },
        { price: { $lte: Number(price_max) } }
      ]
    });

    if (!concertsByPrices || concertsByPrices.length === 0) {
      res.status(404).json({ message: 'No concerts found.' });
    } else {
      res.json({ concertsByPrices });
    }

  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};

exports.getByDay = async (req, res) => {
  const { day } = req.params;
  try {
    const concertsByDay = await Concert.find({ day: Number(day) });

    if (!concertsByDay&&concertsByDay.length === 0) {
      res.status(404).json({ message: 'No concerts found for the specified day.' });
    } else {
      res.json({ concertsByDay });
    }

  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};