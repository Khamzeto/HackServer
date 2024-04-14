const mongoose = require('mongoose');

const collegaueSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  cover: String,
  name: String,
  email: String,
  work: { type: Boolean, default: false },
  workTime: [String],
});

module.exports = mongoose.model('Collegaue', collegaueSchema);
