const mongoose = require('mongoose');

const abiturientSchema = new mongoose.Schema({
  avatar: { type: String },

  name: { type: String },
  surname: { type: String },
  fathername: { type: String },
  direction: { type: String },
  age: { type: Number },
  grade: { type: Number },
  fathername: { type: String },
  diploma: { type: String },
  biography: { type: String },
  work: { type: String },
  achievements: { type: String },
  searchJob: { type: String },
  skills: [mongoose.Schema.Types.Mixed],
});

module.exports = mongoose.model('Abiturients', abiturientSchema);
