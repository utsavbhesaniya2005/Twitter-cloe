const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
  {
    user : {
        type : mongoose.Schema.ObjectId,
        required : true,
        ref : 'users',
    },
    tweet : {
        type : mongoose.Schema.ObjectId,
        required : true,
        ref : 'tweets',
    }
  },
  { timestamps : true },
);

const likeModel = mongoose.model('likes', likeSchema);

module.exports = likeModel;