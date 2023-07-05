const AppError = require('../utils/appError');
const bcrypt = require('bcryptjs');
const User = require('../models/users.model')
const Orders = require('../models/orders.model');
const Restaurant = require('../models/restaurants.model');
const Meals = require('../models/meals.model');
const catchAsync = require('../utils/catchAsync');
const generateJWT = require('../utils/generateJWT');

exports.createUser = catchAsync(async (req, res, next) => {
  const {name, email, password, role} = req.body;

  const salt = await bcrypt.genSalt(12);
  const encryptedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name: name.toLowerCase(),
    email: email.toLowerCase(),
    password: encryptedPassword,
    role,
  });

  const token = await generateJWT(user.id);

  res.status(201).json({
    status: 'success',
    message:  'User created successfully',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const {email, password} = req.body;

  const user = await User.findOne({
    where: {
      email: email.toLowerCase(),
      status: 'active',
    },
  })

  if (!user) {
    return next(new AppError('User could not be found', 401));
  }
  
  if (!(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Invalid email or password', 401));
  }
  
  const token = await generateJWT(user.id);
  
  console.log(token);
  
  res.status(201).json({
    status: 'success',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const {user} = req;
  const {currentPassword, newPassword} = req.body;

  if (!(await bcrypt.compare(currentPassword, user.password))) {
    return next(new AppError('Invalid password', 401));
  }

  const salt = await bcrypt.genSalt(15);
  const encryptedPassword = await bcrypt.hash(newPassword, salt);

  await User.update({
    password: encryptedPassword,
    passwordChangedAt: Date.now(),
  });

  return res.status(200).json({
    status: 'success',
    message: 'Password updated successfully',
  });
});

exports.renew = catchAsync(async (req, res, next) => {
  const {id} = req.sessionUser;

  const user = await User.findOne({
    where: {
      id,
      status: 'active',
    },
  });

  if (!user) {
    return next(new AppError('Invalid user', 401));
  }

  const token = await generateJWT(id);

  res.status(200).json({
    status: 'success',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }
  });
});

exports.FindOne = catchAsync(async (req, res, next) => {
  const {user} = req;

  res.status(200).json({
    status: 'success',
    user: {
      name: user.name,
      email: user.email,
      role: user.role,
    }
  });
});

exports.findAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
    where: {
      status: 'active',
    },
  });

  const usersPromises = users.map(async (user) => {
    return user;
  });

  const usersResolved = await Promise.all(usersPromises);

  res.status(200).json({
    status: 'success',
    results: users.length,
    users: usersResolved,
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const {user} = req;
  const {name, email} = req.body;

  await user.update({name, email});

  res.status(200).json({

    status: 'success',
    message: 'User updated successfully',
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const {user} = req;

  await user.update({status: 'disabled'});

  res.status(200).json({
    status: 'success',
    message: 'User deleted successfully',
  });

});

exports.getOrderById = catchAsync(async (req, res, next) => {
  const orderId = req.params.id;

  const order = await Orders.findOne({
    where: {
      id: orderId,
    },
    include: [
      {
        model: Restaurant,
        attributes: ['id', 'name', 'address'], // Include the specific attributes you want from the Restaurant model
      },
      {
        model: Meals,
        through: {
          attributes: ['name', 'price', 'status'] // Exclude the join table attributes from the response
        }
      }
    ],
  });

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  res.status(200).json({
    status: 'success',
    order,
  });
});

exports.getMyOrder = catchAsync(async (req, res, next) => {
  const userId = req.sessionUser.id;

  const orders = await Orders.findAll({
    where: {
      userId: userId,
      status: 'completed',
    },
    include: [
      {
        model: Restaurant,
        attributes: ['id', 'name', 'address', 'rating'], 
      },
      {
        model: Meals,
        through: {
          attributes: ['name', 'price', 'status'] 
        }
      }
    ],
  });

  res.status(200).json({
    status: 'success',
    results: orders.length,
    orders,
  });
});



