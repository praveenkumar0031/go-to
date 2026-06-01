const { nanoid } =require('nanoid');
const Url =require('../models/url.js');

const createShortUrl = async (req, res) => {
  try {
    const { originalUrl } = req.body;
    const userId = req.user.id; // Assumes your JWT middleware attaches the user ID here

    // 1. Mandatory Validation: Check if it's a valid URL
    try {
      new URL(originalUrl); // Native Node.js URL parser throws an error if invalid
    } catch (err) {
      return res.status(400).json({ error: 'Invalid URL format provided.' });
    }

    // Optional Check: Has this user already shortened this exact URL?
    // If so, just return the existing one to save database space.
    let existingUrl = await Url.findOne({ originalUrl, userId });
    if (existingUrl) {
      return res.status(200).json(existingUrl);
    }

    // 2. Generate the unique short code (8 characters is a good balance of short vs collision-safe)
    const shortCode = nanoid(8);

    // 3. Save to Database
    const newUrl = new Url({
      originalUrl,
      shortCode,
      userId
    });

    await newUrl.save();

    // 4. Return the new URL object to the frontend
    res.status(201).json(newUrl);

  } catch (error) {
    console.error('Error in createShortUrl:', error);
    // If nanoid miraculously generates a duplicate, Mongoose throws a duplicate key error (code 11000)
    if (error.code === 11000) {
      return res.status(500).json({ error: 'Collision detected. Please try again.' });
    }
    res.status(500).json({ error: 'Server error while creating short URL.' });
  }
};
module.exports = {
    createShortUrl
};