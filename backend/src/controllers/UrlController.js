const { nanoid } = require('nanoid');
const Url = require('../models/url.js');
const Analytics = require('../models/analytics.js'); // Import this to clean up data on delete

// 1. CREATE (Updated with Custom Alias support)
const createShortUrl = async (req, res) => {
  try {
    // Extract customAlias from the request body alongside the original URL
    const { originalUrl, customAlias } = req.body;
    const userId = req.user.id;

    // Mandatory Validation: Check if it's a valid URL
    try {
      new URL(originalUrl);
    } catch (err) {
      return res.status(400).json({ error: 'Invalid URL format provided.' });
    }

    let shortCode;

    // If the user provided a custom alias, verify it is completely unique
    if (customAlias) {
      const existingAlias = await Url.findOne({ shortCode: customAlias });
      if (existingAlias) {
        return res.status(400).json({ error: 'This custom alias is already in use. Please choose another.' });
      }
      shortCode = customAlias;
    } else {
      // Optional Check: Only return existing auto-generated URL if they didn't ask for a custom one
      let existingUrl = await Url.findOne({ originalUrl, userId });
      if (existingUrl) {
        return res.status(200).json(existingUrl);
      }
      // Generate a random 8-character string if no custom alias is provided
      shortCode = nanoid(8);
    }

    const newUrl = new Url({
      originalUrl,
      shortCode,
      userId
    });

    await newUrl.save();
    res.status(201).json(newUrl);

  } catch (error) {
    console.error('Error in createShortUrl:', error);
    if (error.code === 11000) {
      return res.status(500).json({ error: 'Collision detected. Please try again.' });
    }
    res.status(500).json({ error: 'Server error while creating short URL.' });
  }
};

// 2. UPDATE (Edit destination URL or custom alias)
const updateUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;
    const { originalUrl, customAlias } = req.body;
    const userId = req.user.id;

    // Find the URL and ensure it belongs to the logged-in user
    let url = await Url.findOne({ shortCode, userId });
    if (!url) {
      return res.status(404).json({ error: 'URL not found or unauthorized.' });
    }

    // Update destination URL if provided
    if (originalUrl) {
      try {
        new URL(originalUrl);
        url.originalUrl = originalUrl;
      } catch (err) {
        return res.status(400).json({ error: 'Invalid URL format provided.' });
      }
    }

    // Update short code/alias if provided
    if (customAlias && customAlias !== url.shortCode) {
      const aliasExists = await Url.findOne({ shortCode: customAlias });
      if (aliasExists) {
        return res.status(400).json({ error: 'This custom alias is already in use.' });
      }
      url.shortCode = customAlias;
    }

    await url.save();
    res.status(200).json(url);

  } catch (error) {
    console.error('Error updating URL:', error);
    res.status(500).json({ error: 'Server error while updating URL.' });
  }
};

// 3. DELETE (Remove URL and its analytics)
const deleteUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;
    const userId = req.user.id;

    // Find and delete the URL if it belongs to the user
    const deletedUrl = await Url.findOneAndDelete({ shortCode, userId });
    
    if (!deletedUrl) {
      return res.status(404).json({ error: 'URL not found or unauthorized.' });
    }

    // Clean up: Delete all analytics associated with this URL
    await Analytics.deleteMany({ urlId: deletedUrl._id });

    res.status(200).json({ message: 'URL and associated analytics successfully deleted.' });

  } catch (error) {
    console.error('Error deleting URL:', error);
    res.status(500).json({ error: 'Server error while deleting URL.' });
  }
};



// 1. GET ALL SHORT URLS OF LOGGED-IN USER
const getUserUrls = async (req, res) => {

  try {

    const userId = req.user.id;

    const urls = await Url.find(
      { userId },
      {
        createdAt: -1
      }
    )
    .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: urls.length,
      urls
    });

  } catch (error) {

    console.error(
      'Error fetching URLs:',
      error
    );

    res.status(500).json({
      success: false,
      error:
        'Server error while fetching URLs.'
    });
  }
};



module.exports = {
  createShortUrl,
  updateUrl,
  deleteUrl,
  getUserUrls,
  
};