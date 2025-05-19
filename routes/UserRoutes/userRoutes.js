const express = require('express');
const userRoute = express.Router();
const { signUp, register, login, logout } = require('../../controllers/UserController/userController');
const { auth } = require('../../middlewares/auth');

userRoute.get('/register', signUp);

userRoute.post('/register', register);

userRoute.post('/login', login);

userRoute.get('/logout', auth, logout);

module.exports = userRoute;