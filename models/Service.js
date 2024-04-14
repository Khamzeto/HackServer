const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  cover: String,
  name: String,
  description: String,
  price: Number,
  currency: String,
  additionalCost: String,
  tags: [mongoose.Schema.Types.Mixed],
  everyndays: Number,
  weekdays: Number,
  interval: [mongoose.Schema.Types.Mixed],
  bufferTime: [mongoose.Schema.Types.Mixed],
  notificationsMe: [mongoose.Schema.Types.Mixed],
  notificationsClient: [mongoose.Schema.Types.Mixed],
  numberClient: { type: Boolean, default: true },
  nameClient: { type: Boolean, default: true },
  seeInfo: { type: Boolean, default: true },
  alwaysService: { type: Boolean, default: false },
  everyDay: Number,
  onlyDay: Number,
  nearlyDays: Number,
  fromDate: String,
  beforeDate: String,
  workTime: [String],
});

module.exports = mongoose.model('Service', serviceSchema);
