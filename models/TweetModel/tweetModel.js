const mongoose = require("mongoose");

const tweetSchema = new mongoose.Schema(
  {
    desc: {
      type: String,
      required: true,
    },
    tweetImg : {
        type : String,
    },  
    user : {
        type : mongoose.Schema.ObjectId,
        required : true,
        ref : 'users',
    },
    likeCount : {
        type : Number,
    },
    retweetCount : {
        type : Number,
    },
  },
  { timestamps : true },
);

const tweetModel = mongoose.model('tweets', tweetSchema);

module.exports = tweetModel;