const express = require('express');

//controllers
const userController = require('../controllers/users.controller');

//middlewares
const authMiddleware = require('../middlewares/auth.middleware');
const userMiddleware = require('../middlewares/user.middleware');
const validationMiddleware = require('../middlewares/validations.middleware');

const router = express.Router();

router.post(
  '/signup',
   validationMiddleware.CreateUserValidations,
   userController.createUser);

router.post('/login', userController.login);

router.use(authMiddleware.protect);

router.use('/:id', userMiddleware.validUser)
.route('/:id')
.patch(authMiddleware.protectAccountOwner,userController.updateUser)
.delete(authMiddleware.protectAccountOwner,userController.deleteUser);


router.get('/orders', userController.getMyOrder);

router.get('/orders/:id', userController.getOrderById);

module.exports = router;

