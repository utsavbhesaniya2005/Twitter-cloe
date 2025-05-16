const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    commentMsg: { type: String, required: true },
    userId: { type: mongoose.Schema.ObjectId, required: true, ref: "users" }
  },
  { timestamps: true },
);

const tweetSchema = new mongoose.Schema(
  {
    desc: {
      type: String,
      required: true,
    },
    tweetImg: {
      type: String,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "users",
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    comments : [commentSchema],
    retweetCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const tweetModel = mongoose.model("tweets", tweetSchema);

module.exports = tweetModel;
