var Twitter = require('twitter'),
    _ = require('lodash'),
    moment = require('moment'),
    profileName = {
        screen_name: 'nathan0reuter'
    },
    client = new Twitter({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
        access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    });

var getTimeLine = function (profileName, callback) {
    client.get('statuses/user_timeline', profileName, function (err, tweets, res) {
        if (!err) {
            var timeLineMessages = '';
            _.each(tweets, function (twit, index) {
                if ((index + 1) !== tweets.length) {
                    timeLineMessages += showFormatText(twit.created_at, twit.text, true);
                } else {
                    timeLineMessages += showFormatText(twit.created_at, twit.text);
                }
            });
            callback(timeLineMessages);
        }
    });
},
    showFormatText = function (date, text, newLine) {
        return 'Creation Date: ' + moment(date).format('DD-MM-YYYY, h:mm:ss')
            + ' # Message: ' + text + (newLine ? '\n' : '');
    };

getTimeLine(profileName, function(twits) {
    console.log(twits);
});
