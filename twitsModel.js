var mongoose = require('mongoose'),
    Schema = mongoose.Schema,

    TwitterUserSchema = new Schema({
        twitterID: {type: String, required: true},
        name: {type: String},
        screen_name: {type: String},
        url: {type: String},
        followers: {type: Number},
        friends: {type: Number}
    }),

    TwitSchema = new Schema({
        twitterID: {type: String, required: true},
        createDate: {type: Date, required: true},
        text: {type: String},
        retweets: {type: Number},
        favorites: {type: Number},
        user: {type: [TwitterUserSchema]}
    });

module.exports = mongoose.model('TwitSchema', TwitSchema);
