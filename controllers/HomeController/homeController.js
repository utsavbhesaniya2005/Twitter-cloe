const Tweet = require('../../models/TweetModel/tweetModel');
const Like = require('../../models/LikeModel/likeModel');

const dashboard = async (req, res) => {
  try {
    const allTweets = await Tweet.find({})
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 });
    const likes = await Like.find({ user: req.user.id }).select('tweet');
    const likedTweetIds = likes.map((like) => like.tweet.toString());

    res.render('index', {
      loginSuc: req.flash('loginSuc')[0],
      loginSucIcon: req.flash('loginSucIcon')[0],
      loginSucMsg: req.flash('loginSucMsg')[0],
      addTweetSuc: req.flash('addTweetSuc')[0],
      addTweetIcon: req.flash('addTweetIcon')[0],
      addTweetSucMsg: req.flash('addTweetSucMsg')[0],
      tweets: allTweets,
      likedTweetIds,
      user: req.user,
      userId: req.user.id, // Pass userId explicitly
    });
  } catch (err) {
    console.error('Error fetching dashboard:', err);
    res.status(500).send('Internal Server Error');
  }
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

    req.flash('addTweetSuc', 'You Just Tweeted!');
    req.flash('addTweetIcon', '🐦');
    req.flash('addTweetSucMsg', 'Your thoughts are flying high in the Twitterverse! 🌍');
    res.redirect('/twitter-clone/home/');
  } catch (err) {
    console.error('Internal Server Error:', err);
    res.status(500).send('Internal Server Error');
  }
};

const handleLikes = async (req, res) => {
  const { tweetId, action } = req.body;

  if (!tweetId || !['increment', 'decrement'].includes(action)) {
    return res.status(400).json({ success: false, message: 'Invalid tweetId or action' });
  }

  try {
    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
      return res.status(404).json({ success: false, message: 'Tweet not found' });
    }

    const io = req.app.get('io');
    let likeCount = tweet.likeCount;

    if (action === 'increment') {
      const existingLike = await Like.findOne({ user: req.user.id, tweet: tweetId });
      if (!existingLike) {
        await Like.create({ user: req.user.id, tweet: tweetId });
        tweet.likeCount++;
        likeCount++;
      }
    } else {
      const deletedLike = await Like.findOneAndDelete({ user: req.user.id, tweet: tweetId });
      if (deletedLike) {
        tweet.likeCount = Math.max(0, tweet.likeCount - 1);
        likeCount = tweet.likeCount;
      }
    }

    await tweet.save();

    io.emit('likeUpdate', { tweetId, userId: req.user.id, likeCount, action });

    res.json({ success: true, likeCount });
  } catch (err) {
    console.error('Internal Server Error:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

module.exports = { dashboard, addTweet, handleLikes };