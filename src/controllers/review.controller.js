const Review = require('../models/reviews.model');
const catchAsync = require('../utils/catchAsync');

exports.createReview = catchAsync (async (req, res, next) => {
  const {comment, rating} = req.body;
  const {id} = req.params;
  const uid= req.sessionUser.id;

  await Review.create({comment, rating, restaurantId: +id, userId: +uid});

  return res.status(201).json({
    status: 'success',
    message: 'review created successfully',
  });
});

exports.updateReview = catchAsync (async (req, res, next) => {

  const {review} = req;
  const {comment, rating} = req.body;

  const reviewUpdated = await review.update({comment, rating});

  return res.status(200).json({
    status: 'success',
    message: 'review updated successfully',
    review: reviewUpdated
  });
});

exports.deleteReview = catchAsync (async (req, res, next) => {

  const {review} = req;

  await review.update({status: 'disabled'});

  return res.status(200).json({
    status: 'success',
    message: 'review deleted successfully',
  });
  
});