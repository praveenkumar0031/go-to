const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({

  urlId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Url',
    required: true
  },
  ipAddress: String,
  userAgent: String,
}, { timestamps: true });

module.exports = mongoose.model('Log', logSchema);