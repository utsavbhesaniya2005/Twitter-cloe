const express = require('express');
const userRoute = express.Router();
const { signUp, register, login } = require('../../controllers/UserController/userController');

userRoute.get('/register', signUp);

userRoute.post('/register', register);

userRoute.post('/login', login);

module.exports = userRoute;