var Twitter = require('twitter'),
    _ = require('lodash'),
    moment = require('moment'),
    mongoose = require('mongoose'),
    MONGODB_URI = 'mongodb://localhost/twitterDB',
    TwitSchema = require('./twitsModel'),
    sequence = require('sequence').Sequence.create(),
    searchOptions = {
        screen_name: 'MongoDB',
        count: 200
    },
    client = new Twitter({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
        access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    });

var connectToMongoose = function (next, errorCallback) {
        mongoose.connect(MONGODB_URI, {}, function (err) {
            if (err) {
                errorCallback();
            } else {
                console.log(moment().toISOString(), '-', 'Connected to mongoDB.');
                if (typeof next === 'function') {
                    next();
                }
            }
        });
    },

    errorCallback = function (next) {
        console.log(moment().toISOString(), '-', 'Error connecting to MongoDB. Trying again in 1000 ms');
        setTimeout(function () {
            guaranteeMongooseConnection(next);
        }, 1000);
    },


    guaranteeMongooseConnection = function (next) {
        connectToMongoose(next, function () {
            errorCallback(next);
        });
    },

    getTimeLine = function (searchOptions, callback) {
        client.get('statuses/user_timeline', searchOptions, function (err, tweets, res) {

            if (!err) {
                var timeLineMessages = '';
                _.each(tweets, function (twit, index) {

                    if (twit) {
                        var saveTwit = {
                            twitterID: twit.id_str,
                            createDate: twit.created_at,
                            text: twit.text,
                            retweets: twit.retweet_count,
                            favorites: twit.favorite_count,
                            user: {
                                twitterID: twit.user.id_str,
                                name: twit.user.name,
                                screen_name: twit.user.screen_name,
                                url: twit.user.url,
                                followers: twit.user.followers_count,
                                friends: twit.user.friends_count
                            }
                        }

                        TwitSchema.create(saveTwit, function (err, data) {
                            if (err) {
                                console.log('Error', err);
                            }

                            console.log('Data', data);
                        });
                    }
                });
                callback(timeLineMessages);
            }
        });
    };


sequence
    .then(function (next) {
        guaranteeMongooseConnection(next);
    })
    .then(function () {
        process.on('SIGINT', function () {
            mongoose.connection.close(function () {
                console.log('Mongoose disconnected through app termination');
                process.exit(0);
            });
        });

        getTimeLine(searchOptions, function (twits) {});
    });

/*
    Buscas para demonstração:

    1- db.twitschemas.find({'retweets': {'$gt': 10}, 'text': /mongo/}).pretty();
    Busca os o twiits com retweets maiores que 10 e texto contendo a palavra mongo.
    2- ...
**/
