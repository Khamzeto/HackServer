// user.js
const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
  avatar: { type: String },
  name: { type: String },
  surname: { type: String },
  fathername: { type: String },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  status: { type: String },
  directions: { type: String },
  faculty: { type: String },
});

module.exports = model('User', UserSchema);
