const express = require('express');

//controllers
const restaurantController = require('../controllers/restaurant.controller');
const reviewController = require('../controllers/review.controller');

//middlewares
const authMiddleware = require('../middlewares/auth.middleware');
const restaurantMiddleware = require('../middlewares/restaurant.middleware');
const reviewMiddleware = require('../middlewares/review.middleware');
const validationMiddleware = require('../middlewares/validations.middleware');

const router = express.Router();

router.route('/')
.get(restaurantController.findAll)
.post(
  authMiddleware.protect, 
  authMiddleware.restrictTo('admind'),
  validationMiddleware.CreateRestaurantValidations,
  restaurantController.create);

router
.route('/:id')
.get(restaurantMiddleware.validRestaurant,restaurantController.findOne)
.patch(
  restaurantMiddleware.validRestaurant,
  authMiddleware.protect, 
  authMiddleware.restrictTo('admind'),
  restaurantController.update)
.delete(
  restaurantMiddleware.validRestaurant,
  authMiddleware.protect, 
  authMiddleware.restrictTo('admind'), 
  restaurantController.delete);

router.use(authMiddleware.protect)

router.post('/reviews/:id',
restaurantMiddleware.validRestaurant,
reviewController.createReview);

router
.use('/reviews/:restaurantId/:id',
reviewMiddleware.validReview,
restaurantMiddleware.validRestaurant
)

.route('/reviews/:restaurantId/:id')
.patch(authMiddleware.protectAccountOwner, reviewController.updateReview)
.delete(authMiddleware.protectAccountOwner, reviewController.deleteReview);

module.exports = router;