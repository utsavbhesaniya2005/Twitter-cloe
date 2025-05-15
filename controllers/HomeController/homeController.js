const Tweet = require("../../models/TweetModel/tweetModel");
const Like = require("../../models/LikeModel/likeModel");

const dashboard = async (req, res) => {

  const allTweets = await Tweet.find({}).populate('user', 'username avatar');

  const likes = await Like.find({ user: req.user.id }).select("tweet");

  const likedTweetIds = likes.map(like => like.tweet.toString());
  
  res.render("index", {
    loginSuc: req.flash('loginSuc')[0],
    loginSucIcon: req.flash("loginSucIcon")[0],
    loginSucMsg: req.flash("loginSucMsg")[0],
    addTweetSuc: req.flash("addTweetSuc")[0],
    addTweetIcon: req.flash("addTweetIcon")[0],
    addTweetSucMsg: req.flash("addTweetSucMsg")[0],
    tweets : allTweets,
    likedTweetIds,
  });
};

const addTweet = async (req, res) => {
  const { desc } = req.body;
  const path = req.file ? req.file.path : '';
  
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

  try{
    const tweet = await Tweet.findById(tweetId);
    const socket = req.app.get('socket');

    if(action === 'increment'){

      const existingLike = await Like.findOne({ user: req.user.id, tweet: tweetId });

      if (!existingLike) {
        await Like.create({ user: req.user.id, tweet: tweetId });
        tweet.likeCount++;
      }

    }else{

      const deletedLike = await Like.findOneAndDelete({ user: req.user.id, tweet: tweetId });
      
      if (deletedLike) {
        tweet.likeCount = Math.max(0, tweet.likeCount - 1);
      }
    }

    await tweet.save();

    socket.emit('likeUpdate', {  tweetId, userId : req.user.id, likeCount : tweet.likeCount, action });

    console.log('like added.');

  }catch(err){
    console.log('Internal Server Error :', err);
  }

}

module.exports = { dashboard, addTweet, handleLikes };