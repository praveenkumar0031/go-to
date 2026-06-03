const Url = require('../models/url.js');
const Analytics = require('../models/analytics.js');
const UAParser = require('ua-parser-js');
const geoip = require('geoip-lite');
const Log = require('../models/log.js');
const mongoose=require("mongoose");

  const handleRedirect = async (req, res) => {
  try {
    const { shortCode } = req.params;

    // Fast lookup
    const urlData = await Url.findOne({ shortCode });

    if (!urlData) {
      return res.status(404).json({ error: 'URL not found' });
    }

    // Check if the link has expired
    if (urlData.expiresAt && new Date() > urlData.expiresAt) {
      return res.status(410).send(`
        <html>
          <head><title>Link Expired</title></head>
          <body style="font-family: sans-serif; text-align: center; padding-top: 50px;">
            <h1>410 Gone</h1>
            <p>This link has expired and is no longer available.</p>
          </body>
        </html>
      `);
    }

    // 1. Redirect immediately (Zero latency for the user)
    res.redirect(urlData.originalUrl);

    // 2. Background analytics logging (Fire-and-forget)
    const logAnalytics = async () => {
      try {
        // --- Data Extraction & Parsing ---
        const rawUserAgent = req.headers['user-agent'] || '';
        let ip = req.headers['x-forwarded-for'] || req.ip || req.connection.remoteAddress;
        
        // Handle local IPv6 loopback and proxy arrays
        if (ip === '::1') ip = '127.0.0.1';
        if (ip && ip.includes(',')) ip = ip.split(',')[0].trim();

        // Parse UA and IP
        const parser = new UAParser(rawUserAgent);
        const parsedUA = parser.getResult();
        const geo = geoip.lookup(ip);

        // --- Database Writes (Run in parallel for speed) ---
        
        // A. Update Aggregated Analytics (Total Clicks & Last Visited)
        const updateAnalyticsPromise = Analytics.findOneAndUpdate(
          { urlId: urlData._id },
          {
            $inc: { totalClicks: 1 },
            $set: { lastVisitedAt: new Date() }
          },
          { upsert: true, returnDocument: 'after' }
        );

        // B. Store Detailed Visit History (Enriched Data)
        const createLogPromise = Log.create({
          urlId: urlData._id,
          ipAddress: ip,
          userAgent: rawUserAgent,
          browser: parsedUA.browser.name || 'Unknown',
          os: parsedUA.os.name || 'Unknown',
          deviceType: parsedUA.device.type ,
          country: geo ? geo.country : 'India',
          
        });

        // Execute both database operations concurrently
        await Promise.all([updateAnalyticsPromise, createLogPromise]);

      } catch (err) {
        console.error('Analytics logging failed:', err);
      }
    };

    logAnalytics();

  } catch (error) {
    console.error('Redirect error:', error);
    res.status(500).json({ error: 'Server error during redirect.' });
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
const getTodayLogs = async (req, res) => {
  try {
    
    const userId = req.user.id;

    // START OF TODAY
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    // END OF TODAY
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);


    // GET USER URL IDS
    const userUrls = await Url.find({
      userId: new mongoose.Types.ObjectId(userId),
    }).select("_id shortCode");


    const urlIds = userUrls.map((url) => url._id);


    // GET TODAY LOGS
    const logs = await Log.find({
      urlId: { $in: urlIds },

      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    }).sort({ createdAt: -1 });


    // HOURLY TRAFFIC
    const hourlyMap = {};

    // initialize 24 hours
    for (let i = 0; i < 24; i++) {
      const key = `${i.toString().padStart(2, "0")}:00`;
      hourlyMap[key] = 0;
    }


    logs.forEach((log) => {
      const hour = new Date(log.createdAt)
        .getHours()
        .toString()
        .padStart(2, "0");

      const key = `${hour}:00`;

      hourlyMap[key]++;
    });


    const hourlyTraffic = Object.entries(hourlyMap).map(
      ([hour, clicks]) => ({
        hour,
        clicks,
      })
    );


    // RECENT LOGS
    const recentLogs = logs.slice(0, 10);


    return res.status(200).json({
      success: true,

      todayClicks: logs.length,

      hourlyTraffic,

      recentLogs,
    });

  } catch (error) {
    console.error("TODAY LOG ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch today logs",
    });
  }
};
module.exports = {
  handleRedirect,
  getUrlAnalytics,
  getUserLogs,
  getTodayLogs
};