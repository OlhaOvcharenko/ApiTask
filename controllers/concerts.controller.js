const Concert = require('../models/concert.model');

exports.getAll = async(req, res) => {
  try {
    res.json(await Concert.find());
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
    if(!concert)res.status(404).json({message: 'Not found..'});
    else res.json(concert);
  }
  catch(err) {
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