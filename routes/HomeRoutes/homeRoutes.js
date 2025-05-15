const express = require('express');
const homeRoute = express.Router();
const { dashboard, addTweet, handleLikes } = require('../../controllers/HomeController/homeController');
const { auth } = require('../../middlewares/auth');
const upload = require('../../middlewares/multer');

homeRoute.get('/', auth, dashboard);

homeRoute.post('/add', upload.single('tweetImg'), auth, addTweet);

homeRoute.post('/likes', auth, handleLikes);

module.exports = homeRoute;