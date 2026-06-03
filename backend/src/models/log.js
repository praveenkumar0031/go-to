const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  urlId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Url',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  eventType: {
    type: String,
    enum: ['click', 'update'],
    default: 'click'
  },
  description: String,
  ipAddress: String,
  userAgent: String,
  browser: String,
  os: String,
  deviceType: String,
  country: String,
}, { timestamps: true });

module.exports = mongoose.model('Log', logSchema);