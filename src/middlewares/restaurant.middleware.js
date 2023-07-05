const catchAsync = require('../utils/catchAsync');
const Restaurant = require('../models/restaurants.model');
const AppError = require('../utils/appError');

exports.validRestaurant = catchAsync(async(req, res, next) => {

  const { id, restaurantId } = req.params;

  const restaurant = await Restaurant.findOne({
    where: {
      status: 'active',       
      id: restaurantId || id,
    }
  });     
  
  if (!restaurant) 
    return next(new AppError('Restaurant not found', 404));

  req.restaurant = restaurant;
  next();
});