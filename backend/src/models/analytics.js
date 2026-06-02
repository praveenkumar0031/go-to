const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({

  urlId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Url',
    required: true,
    unique: true
  },

  totalClicks: {
    type: Number,
    default: 0
  },

  lastVisitedAt: {
    type: Date
  }

}, { timestamps: true });

module.exports = mongoose.model('Analytics', analyticsSchema);