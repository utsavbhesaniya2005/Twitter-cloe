const express = require('express');
const routes = express.Router();
const userRoutes = require('./UserRoutes/userRoutes');
const homeRoutes = require('./HomeRoutes/homeRoutes');

routes.use('/user', userRoutes);

routes.use('/home', homeRoutes);

module.exports = routes;