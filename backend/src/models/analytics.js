const mongoose=require("mongoose");

const analyticsSchema = new mongoose.Schema({
  urlId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Url',
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  userAgent: {
    type: String, // Captures browser and OS for the UI dashboard
  },
  ipAddress: {
    type: String,
  }
});

module.exports = mongoose.model('Analytics', analyticsSchema);