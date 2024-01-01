const express = require('express');
const router = express.Router();
const ConcertController = require('../controllers/concerts.controller')

router.get('/concerts', ConcertController.getAll);
router.get('/concerts/random', ConcertController.getRandom);

//new endpoints 
router.get('/concerts/genre/:genre', ConcertController.getByGenre);
router.get('/concerts/performer/:performer', ConcertController.getByPerformer);
router.get('/concerts/price/:price_min/:price_max', ConcertController.getByPrices);
router.get('/concerts/day/:day', ConcertController.getByDay);

router.get('/concerts/:id', ConcertController.getById);
router.post('/concerts', ConcertController.addNewConcert);
router.put('/concerts/:id', ConcertController.updateConcert);
router.delete('/concerts/:id', ConcertController.deleteConcert);

module.exports = router;