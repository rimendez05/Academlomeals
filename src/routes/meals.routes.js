const express = require('express');

//controllers
const mealController = require('../controllers/meals.controllers');



//middlewares
const authMiddleware = require('../middlewares/auth.middleware');
const mealMiddleware = require('../middlewares/meal.middleware');
const restaurantMiddleware = require('../middlewares/restaurant.middleware');
const validationMiddleware = require('../middlewares/validations.middleware');

const router = express.Router();

router.route('/')
.get(mealController.findAllMeals)


router
.route('/:id')
.post(
  authMiddleware.protect,
  authMiddleware.restrictTo('admin'),
  restaurantMiddleware.validRestaurant,
  validationMiddleware.CreateMealValidations,
  mealController.createMeal
)

router.use(authMiddleware.protect)

router.use('/:id', mealMiddleware.validMeal, restaurantMiddleware.validRestaurant)

router
.route('/:id')
.get(mealMiddleware.validMeal, mealController.findOneMeal)
.patch(authMiddleware.protectAccountOwner, authMiddleware.restrictTo('admin'), mealController.updateMeal)
.delete(authMiddleware.protectAccountOwner, authMiddleware.restrictTo('admin'), mealController.deleteMeal);
