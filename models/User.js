// user.js
const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
  avatar: { type: String },
  banner: { type: String },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: { type: String },
  pageTitle: { type: String },
  description: { type: String },
  seeBanner: { type: Boolean, default: true },
  seeAvatar: { type: Boolean, default: true },
  seeTitleDesc: { type: Boolean, default: true },
});

module.exports = model('User', UserSchema);
