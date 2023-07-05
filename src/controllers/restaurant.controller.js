const Restaurant = require("../models/restaurants.model");
const catchAsync = require("../utils/catchAsync");

exports.findAll = catchAsync(async (req, res, next) => {

  const restaurants = await Restaurant.findAll({
    where: {
      status: 'active'
    }
  });

  return res.status(200).json({
    status: 'success',
    message: 'restaurants retrieved successfully',
    results: restaurants.length,
    restaurants,
  });
});

exports.create = catchAsync(async (req, res, next) => {

  const {name, address, rating} = req.body;

  await Restaurant.create({name, address, rating});

  return res.status(201).json({
    status: 'success',
    message: 'restaurant created successfully',
  });
});

exports.findOne = catchAsync(async (req, res, next) => {
  const {restaurant} = req;

  return res.status(200).json({
    status: 'success',
    message: 'restaurant retrieved successfully',
    restaurant,
  });
});

exports.update = catchAsync(async (req, res, next) => {
  const {restaurant} = req;
  const {name, address} = req;

  await restaurant.update({name, address});

  return res.status(200).json({
    status: 'success',
    message: 'restaurant updated successfully',
    restaurant,
  });
});

exports.delete = catchAsync(async (req, res, next) => {
  const {restaurant} = req;

  await restaurant.update({status: 'disabled'});

  return res.status(200).json({
    status: 'success',
    message: 'restaurant deleted successfully',
  });
});