const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  avatar: { type: String },
  banner: { type: String },

  name: { type: String },
  description: { type: String },
  grade: { type: Number },
  people: { type: Number },
  teachers: { type: Number },
  doctors: { type: Number },
  candidate: { type: Number },
  science: { type: Number },
  reviews: [mongoose.Schema.Types.Mixed],
});

module.exports = mongoose.model('Student', studentSchema);
