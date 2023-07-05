const express = require('express');

//controllers
const orderController = require('../controllers/orders.controller');
const userController = require('../controllers/users.controller');


//middlewares
const authMiddleware = require('../middlewares/auth.middleware');
const mealMiddleware = require('../middlewares/meal.middleware');
const userMiddleware = require('../middlewares/user.middleware');
const restaurantMiddleware = require('../middlewares/restaurant.middleware');
const orderMiddleware = require('../middlewares/order.middleware');

const router = express.Router();


router.use(authMiddleware.protect)

router.route('/').post(
  restaurantMiddleware.validRestaurant,
  mealMiddleware.validMeal,
  orderController.createOrder);

router.route('/me')
.get(userMiddleware.validUser,userController.getMyOrder);

router.route('/:id')
.patch(authMiddleware.protectAccountOwner, orderMiddleware.validOrder, orderController.updateOrder)
.delete(authMiddleware.protectAccountOwner, orderMiddleware.validOrder, orderController.deleteOrder);

module.exports = router;

