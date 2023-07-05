const { body, validationResult } = require('express-validator');

const validFields = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      errors: errors.mapped(),
    });
  }

  next();
};

exports.CreateUserValidations = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email')
  .notEmpty()
  .withMessage('Email is required')
  .isEmail()
  .withMessage('Invalid email'),
  body('password')
  .notEmpty()
  .withMessage('Password is required')
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters long'),
  validFields,
];

exports.CreateRestaurantValidations = [
  body('name').notEmpty().withMessage('Name is required'),
  body('address').notEmpty().withMessage('Address is required'),
  body('rating')
  .notEmpty()
  .withMessage('Rating is required')
  .isInt()
  .withMessage('Rating must be an integer')
  .matches(/^[1-5]$/)
  .withMessage('Rating must be between 1 and 5'),
];

exports.CreateMealValidations = [
  body('name').notEmpty().withMessage('Name is required'),
  body('price').isInt().withMessage('Price must be an integer'),
];