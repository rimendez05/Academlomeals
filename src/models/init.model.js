const User = require("./users.model");
const Orders = require("./orders.model");
const Reviews = require("./reviews.model");
const Restaurant = require("./restaurants.model");
const Meals = require("./meals.model");

const initModel = () => {
  User.hasMany(Orders, {foreignKey: 'userId'});
  Orders.belongsTo(User);

  User.hasMany(Reviews, {foreignKey: 'userId'});
  Reviews.belongsTo(User);

  Restaurant.hasMany(Reviews, {foreignKey: 'restaurantId'});
  Reviews.belongsTo(Restaurant);

  Restaurant.hasMany(Meals, {foreignKey: 'restaurantId'});
  Meals.belongsTo(Restaurant);

  Meals.hasOne(Orders, {foreignKey: 'mealId'});
  Orders.belongsTo(Meals);
};

module.exports = initModel;