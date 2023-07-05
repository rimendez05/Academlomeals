const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const hpp = require('hpp');
const morgan = require('morgan'); 
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/error.controller');

//Routes
const userRoutes = require('./routes/user.routes');
const restaurantRoutes = require('./routes/restaurant.routes');
const mealRoutes = require('./routes/meals.routes');
const orderRoutes = require('./routes/orders.routes');

const app = express();

const routes ={
  users: '/api/v1/users',
  restaurants: '/api/v1/restaurants'
}

const limiter = rateLimit({
  max: 100000,
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'Too many requests from this IP, please try again in an hour!',
})

console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(hpp());
app.use(xss());

app.use('/api/v1', limiter);

//rutas
app.use(routes.users, userRoutes);
app.use(routes.restaurants, restaurantRoutes);
app.use(routes.restaurants, mealRoutes);
app.use(routes.restaurants, orderRoutes);

app.all('*', (req, res, next) => {
  return next(
    new AppError(`Can't find ${req.originalUrl} on this server!`, 404)
  )
});

app.use(globalErrorHandler);

module.exports = app;