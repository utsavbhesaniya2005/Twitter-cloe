const Tweet = require("../../models/TweetModel/tweetModel");
const Like = require("../../models/LikeModel/likeModel");
const fs = require("fs");

const dashboard = async (req, res) => {
  const allTweets = await Tweet.find({})
    .sort({ createdAt: -1 })
    .populate("user", "username avatar")
    .populate("comments.userId", "username avatar")
    .then(tweets => {
      tweets.forEach(tweet => {
        tweet.comments.sort((a, b) => b.createdAt - a.createdAt);
      });
      return tweets;
    });

  const likes = await Like.find({ user: req.user.id }).select("tweet");

  const likedTweetIds = likes.map((like) => like.tweet.toString());

  res.render("index", {
    loginSuc: req.flash("loginSuc")[0],
    loginSucIcon: req.flash("loginSucIcon")[0],
    loginSucMsg: req.flash("loginSucMsg")[0],
    addTweetSuc: req.flash("addTweetSuc")[0],
    addTweetIcon: req.flash("addTweetIcon")[0],
    addTweetSucMsg: req.flash("addTweetSucMsg")[0],
    tweets: allTweets,
    likedTweetIds,
    user: req.session.sessionUser,
  });
};

const addTweet = async (req, res) => {
  const { desc } = req.body;
  const path = req.file ? req.file.path : "";

  try {
    const tweet = await Tweet.create({
      desc,
      tweetImg: path,
      user: req.user.id,
      likeCount: 0,
      retweetCount: 0,
    });

    if (tweet) {
      console.log("Tweet Added.", tweet);
      req.flash("addTweetSuc", "You Just Tweeted!");
      req.flash("addTweetIcon", "🐦");
      req.flash(
        "addTweetSucMsg",
        "Your thoughts are flying high in the Twitterverse! 🌍"
      );

      const io = req.app.get("io");
      io.emit("newTweet", tweet);

      res.redirect("/twitter-clone/home/");
    } else {
      console.log("Error : Tweet Not Added.");
    }
  } catch (err) {
    console.log("Internal Server Error :- ", err);
  }
};

const handleLikes = async (req, res) => {
  const { tweetId, action } = req.body;
  const userId = req.user.id;

  try {
    let tweet = await Tweet.findById(tweetId);

    if (!tweet) {
      tweet = new Tweet({ tweetId, likes: [] });
    }

    const existingLike = await Like.findOne({ user: userId, tweet: tweetId });

    if (action === "like" && !existingLike) {
      await Like.create({ user: userId, tweet: tweetId });
      tweet.likeCount++;
    } else if (action === "dislike" && existingLike) {
      await Like.deleteOne({ _id: existingLike._id });
      tweet.likeCount = Math.max(0, tweet.likeCount - 1);
    }

    await tweet.save();

    const io = req.app.get("io");
    io.emit("likeUpdate", {
      tweetId,
      likeCount: tweet.likeCount,
    });

    console.log("like updated.");
  } catch (err) {
    console.log("Internal Server Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const addComments = async (req, res) => {
  const { commentMsg } = req.body;
  const { pId } = req.params;

  try {
    const tweetComment = await Tweet.findByIdAndUpdate(pId, { $push: { comments : { commentMsg, userId : req.user.id } } }, {new : true});

    if(tweetComment){
      console.log('Comment Updated On Tweet :- ', tweetComment);
    }else{
      console.log('Comment not updated try again sometime.');
    }

    res.redirect('/twitter-clone/home/');

  } catch (err) {
    console.log("Internal Server Error :- ", err);
  }
};

const deleteComment = async (req, res) => {
  const { cId, tweetId } = req.params;

  try{

    const removeComment = await Tweet.updateOne({ _id : tweetId }, {
      $pull : { 
        comments : {
          _id : cId
        }
      },
    });

    if(removeComment){

      console.log('Comment deleted successfully.');
    }else{
      
      console.log('Error : Server error while deleting the comment');
    }

    res.redirect('/twitter-clone/home/');

  }catch(err){
    console.log("Internal Server Error :- ", err);
  }
}

const deletePost = async (req, res) => {

  const { id } = req.params;

  const tweet = await Tweet.findOne({ _id: id });

  fs.unlink(tweet.tweetImg, (err) => {
    if (!err) {
      console.log("Tweet Image Deleted From Local.");
    }
  });

  try {
    await Tweet.findByIdAndDelete(id);
    console.log("Tweet Deleted Successfully...");
    res.redirect("/twitter-clone/home/");
  } catch (err) {
    console.log("Internal Server Error :- ", err);
  }
};

module.exports = {
  dashboard,
  addTweet,
  handleLikes,
  addComments,
  deleteComment,
  deletePost,
};
