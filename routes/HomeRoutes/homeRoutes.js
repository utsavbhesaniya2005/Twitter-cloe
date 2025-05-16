const express = require('express');
const homeRoute = express.Router();
const { dashboard, addTweet, handleLikes, addComments, deleteComment, deletePost } = require('../../controllers/HomeController/homeController');
const { auth } = require('../../middlewares/auth');
const upload = require('../../middlewares/multer');

homeRoute.get('/', auth, dashboard);

homeRoute.post('/add', upload.single('tweetImg'), auth, addTweet);

homeRoute.post('/likes', auth, handleLikes);

homeRoute.post('/comment/:pId', auth, addComments);

homeRoute.get('/deleteComment/:tweetId/:cId', auth, deleteComment);

homeRoute.get('/delete/:id', auth, deletePost);

module.exports = homeRoute;