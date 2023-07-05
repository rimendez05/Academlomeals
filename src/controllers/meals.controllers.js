const Meal = require('../models/meals.model');
const Restaurant = require('../models/restaurants.model');
const catchAsync = require('../utils/catchAsync');

exports.createMeal = catchAsync(async (req, res, next) => {
  const {name, price} = req.body;
  const {id} = req.params;
  const uid= req.sessionUser.id;

  await Meal.create({name, price, restaurantId: +id, userId: +uid});

  return res.status(201).json({
    status: 'success',
    message: 'meal created successfully',
  });
});

exports.findAllMeals = catchAsync(async (req, res, next) => {

  const meals = await Meal.findAll({
    where: {
      status: 'active'
    },
    include: Restaurant
  });

  return res.status(200).json({
    status: 'success',
    message: 'meals retrieved successfully',
    results: meals.length,
    meals,
  });
});

exports.findOneMeal = catchAsync(async (req, res, next) => {
  const { meal } = req;

  // Fetch the restaurant information associated with the meal
  const restaurant = await Restaurant.findByPk(meal.restaurantId);

  return res.status(200).json({
    status: 'success',
    message: 'meal retrieved successfully',
    meal: {
      ...meal.toJSON(),
      restaurant, // Include restaurant information in the meal object
    },
  });
});

exports.updateMeal = catchAsync(async (req, res, next) => {

  const {meal} = req;
  const {name, price} = req.body;

  await meal.update({name, price});

  return res.status(200).json({
    status: 'success',
    message: 'meal updated successfully',
    meal,
  });
});

exports.deleteMeal = catchAsync(async (req, res, next) => {

  const {meal} = req;

  await meal.update({status: 'disabled'});

  return res.status(200).json({
    status: 'success',
    message: 'meal deleted successfully',
  });
});