const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Volunteer = require('../models/Volunteer');

router.post(
  '/',
  [
    auth,
    [
      check('name', 'Name is required').not().isEmpty(),
      check('skills', 'Skills are required').not().isEmpty(),
      check('hours', 'Hours are required').isNumeric(),
      check('email', 'Please include a valid email').isEmail(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, skills, hours, assignments, email } = req.body;

    try {
      const newVolunteer = new Volunteer({
        name,
        skills,
        hours,
        assignments,
        email,
      });

      const volunteer = await newVolunteer.save();

      res.json(volunteer);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

router.get('/', auth, async (req, res) => {
  try {
    const volunteers = await Volunteer.find();
    res.json(volunteers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.put('/:id', auth, async (req, res) => {
  const { name, skills, hours, assignments, email } = req.body;

  const volunteerFields = {};
  if (name) volunteerFields.name = name;
  if (skills) volunteerFields.skills = skills;
  if (hours) volunteerFields.hours = hours;
  if (assignments) volunteerFields.assignments = assignments;
  if (email) volunteerFields.email = email;

  try {
    let volunteer = await Volunteer.findById(req.params.id);

    if (!volunteer) return res.status(404).json({ msg: 'Volunteer not found' });

    volunteer = await Volunteer.findByIdAndUpdate(
      req.params.id,
      { $set: volunteerFields },
      { new: true }
    );

    res.json(volunteer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    let volunteer = await Volunteer.findById(req.params.id);

    if (!volunteer) return res.status(404).json({ msg: 'Volunteer not found' });

    await Volunteer.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Volunteer removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
