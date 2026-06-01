const Url =require('../models/url.js');
const Analytics =require('../models/analytics.js');

const handleRedirect = async (req, res) => {
  try {
    const { shortCode } = req.params;

    // 1. Fast lookup using the indexed shortCode
    const urlData = await Url.findOne({ shortCode });

    if (!urlData) {
      return res.status(404).json({ error: 'URL not found or has expired.' });
    }

    // 2. Execute the server-side redirect immediately
    res.redirect(urlData.originalUrl);

    // 3. Fire-and-forget Analytics Logging
    const logAnalytics = async () => {
      try {
        const analyticsEntry = new Analytics({
          urlId: urlData._id,
          userAgent: req.headers['user-agent'],
          ipAddress: req.ip || req.connection.remoteAddress
        });
        await analyticsEntry.save();
      } catch (err) {
        console.error('Silent error: Analytics logging failed:', err);
      }
    };

    // Call the function but do NOT await it
    logAnalytics();

  } catch (error) {
    console.error('Redirect error:', error);
    res.status(500).json({ error: 'Server error during redirect.' });
  }
};
module.exports = {
    handleRedirect
};