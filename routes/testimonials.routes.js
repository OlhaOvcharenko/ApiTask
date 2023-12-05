const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const db = require('./../db');

// get all routes
router.route('/testimonials').get((req, res) => {
  res.json(db.testimonials);
});


router.route('/testimonials/random').get((req, res) => {
  const randomIndex = Math.floor(Math.random() * db.testimonials.length);
  const randomTestimonial = db.testimonials[randomIndex];
  res.json(randomTestimonial);
});

router.route('/testimonials/:id').get((req, res) => {
  const testimonialId = req.params.id;

  const testimonial = db.testimonials.find(item => {
    return item.id === testimonialId || item.id === parseInt(testimonialId);
  });

  if (testimonial) {
    res.json(testimonial);
  } else {
    res.status(404).json({ error: 'Testimonial not found.' });
  }
});


router.route('/testimonials').post((req, res) => {
  const { author, text } = req.body;

  if (author && text) {

    const newTestimonial = {
      id: uuidv4(), // Generate a new UUID for each testimonial
      text,
      author,
    };

    db.testimonials.push(newTestimonial);

    res.status(201).json({ message: 'OK' });
  } else {
    res.status(400).json({ error: 'Both author and text are required.' });
  }
});

router.route('/testimonials/:id').delete((req, res) => {
  const { id } = req.params;

  const index = db.testimonials.findIndex(item => {
    return item.id === id || item.id === parseInt(id);
  });


  if (index !== -1) {
    db.testimonials.splice(index, 1);
    res.json({ message: 'OK' });
  } else {
    res.status(404).json({ error: 'Testimonial not found.' });
  }
});

router.route('/testimonials/:id').put((req, res) => {
  const { id } = req.params;
  const { author, text } = req.body;

  const index = db.testimonials.findIndex(item => {
    return item.id === id || item.id === parseInt(id);
  });

  if (index !== -1 && author && text) {
    db.testimonials[index].text = text || db.testimonials[index].text;
    db.testimonials[index].author = author || db.testimonials[index].author;
    res.json({ message: 'OK' });
  } else {
    res.status(404).json({ error: 'Testimonial not found or missing data.' });
  }
});
    


module.exports = router;