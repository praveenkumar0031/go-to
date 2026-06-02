const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({

  urlId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Url',
    required: true
  },
  ipAddress: String,
  userAgent: String,
  browser: { type: String },
  os: { type: String },
  deviceType: { type: String }, // e.g., 'mobile', 'tablet', 'desktop'
  country: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Log', logSchema);