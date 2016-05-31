module.exports = {
  facebook: {
    clientID: process.env.FB_APP_ID,
    clientSecret: process.env.FB_APP_KEY,
    callbackURL: process.env.FB_CALLBACK_URL
  },
  twitter: {
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: process.env.TWITTER_CALLBACK_URL
  },
};
