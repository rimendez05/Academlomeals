const Orders = require('../models/orders.model');
const Meals = require('../models/meals.model');
const catchAsync = require('../utils/catchAsync');

exports.createOrder = catchAsync (async (req, res, next) => {

  const {mealId, quantity} = req.body;
  const uid= req.sessionUser.id;

  const meal = await Meals.findById(mealId);

  if (!meal) {
    return res.status(404).json({
      status: 'error',
      message: 'meal not found',
    });
  }

  const totalPrice = meal.price * quantity;

  const order = await Orders.create({mealId, userId: +uid, totalPrice, quantity});

  return res.status(201).json({
    status: 'success',
    message: 'order created successfully',
    order
  });
});

exports.updateOrder = catchAsync (async (req, res, next) => {
  
  const {order} = req;
  const {mealId, quantity} = req.body;

  const meal = await Meals.findById(mealId);

  if (!meal) {
    return res.status(404).json({
      status: 'error',
      message: 'meal not found',
    });
  }

  const totalPrice = meal.price * quantity;

  const orderUpdated = await order.update({mealId, totalPrice, quantity});

  return res.status(200).json({
    status: 'completed',
    message: 'order updated successfully',
    order: orderUpdated
  });
});

exports.deleteOrder = catchAsync (async (req, res, next) => {

  const {order} = req;

  await order.update({status: 'cancelled'});

  return res.status(200).json({
    status: 'cancelled',
    message: 'order deleted successfully',
  });
});