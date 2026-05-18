const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: { type: String, default: 'Untitled Job' },
  requiredSkills: { type: [String], required: true },
  minExperience: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', JobSchema);
