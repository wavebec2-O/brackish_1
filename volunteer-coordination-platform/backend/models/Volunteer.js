const mongoose = require('mongoose');

const VolunteerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  skills: {
    type: [String],
    required: true,
  },
  hours: {
    type: Number,
    required: true,
  },
  assignments: {
    type: [String],
  },
  email: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Volunteer', VolunteerSchema);
