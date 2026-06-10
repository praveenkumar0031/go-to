const mongoose=require("mongoose");

const urlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
  },
  shortCode: {
    type: String,
    required: true,
    unique: true, // Guarantees uniqueness at the DB level
    index: true,  // Critical for fast lookups during the redirect phase
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, // Ties the URL to the authenticated user
  },
  expiresAt: {
    type: Date,
    default: null, // Optional expiration date new Date(Date.now() + 10 * 60 * 1000)
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('url', urlSchema);