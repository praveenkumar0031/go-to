const Url = require('../models/url.js');
const Analytics = require('../models/analytics.js');

const Log = require('../models/log.js');

const handleRedirect = async (req, res) => {

  try {

    const { shortCode } = req.params;

    const urlData = await Url.findOne({ shortCode });

    if (!urlData) {
      return res.status(404).json({
        error: 'URL not found'
      });
    }

    // Redirect immediately
    res.redirect(urlData.originalUrl);

    // Background analytics logging
    const logAnalytics = async () => {

      try {

        // 1. Update Aggregated Analytics
        await Analytics.findOneAndUpdate(

  { urlId: urlData._id },

  {
    $inc: {
      totalClicks: 1
    },

    $set: {
      lastVisitedAt: new Date()
    }
  },

  {
    upsert: true,
    returnDocument: 'after'
  }
);

        // 2. Store Visit History
        await Log.create({

          urlId: urlData._id,

          ipAddress:  
            req.ip || req.connection.remoteAddress,

          userAgent:
            req.headers['user-agent']
          
        });

      } catch (err) {

        console.error(
          'Analytics logging failed:',
          err
        );
      }
    };

    logAnalytics();

  } catch (error) {

    console.error('Redirect error:', error);

    res.status(500).json({
      error: 'Server error during redirect.'
    });
  }
};



const getUrlAnalytics = async (req, res) => {

  try {

    const { shortCode } = req.params;

    const urlData = await Url.findOne({
      shortCode,
      userId: req.user.id
    });

    if (!urlData) {
      return res.status(404).json({
        error: 'URL not found'
      });
    }

    // Aggregated analytics
    const analytics =
      await Analytics.findOne({ urlId: urlData._id });

    // Recent visit history
    const recentVisits =
      await Log
        .find({ urlId: urlData._id })
        .sort({ createdAt: -1 })
        .limit(20);

    res.status(200).json({

      originalUrl: urlData.originalUrl,

      shortCode: urlData.shortCode,

      createdAt: urlData.createdAt,

      totalClicks:
        analytics?.totalClicks || 0,

      lastVisitedAt:
        analytics?.lastVisitedAt || null,

      recentVisits

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: 'Server error'
    });
  }
};
const getUserLogs = async (req, res) => {

  try {

    const userId = req.user.id;

    // First get all user URLs
    const userUrls = await Url.find(
      { userId },
      { _id: 1, shortCode: 1 }
    );

    const urlIds = userUrls.map(
      (url) => url._id
    );

    // Fetch logs for all URLs
    const logs = await Log.find({
      urlId: { $in: urlIds }
    })
    .sort({ createdAt: -1 });

    // Attach shortCode to each log
    const formattedLogs = logs.map((log) => {

      const relatedUrl = userUrls.find(
        (url) =>
          url._id.toString() ===
          log.urlId.toString()
      );

      return {

        shortCode:
          relatedUrl?.shortCode || null,

        ipAddress:
          log.ipAddress,

        userAgent:
          log.userAgent,

        visitedAt:
          log.createdAt
      };
    });

    res.status(200).json({

      success: true,

      count: formattedLogs.length,

      logs: formattedLogs
    });

  } catch (error) {

    console.error(
      'Error fetching logs:',
      error
    );

    res.status(500).json({
      success: false,
      error:
        'Server error while fetching logs.'
    });
  }
};

module.exports = {
  handleRedirect,
  getUrlAnalytics,
  getUserLogs
};