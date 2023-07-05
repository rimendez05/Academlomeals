const {DataTypes} = require('sequelize');
const {db} = require('../database/config');


const User = db.define('user', {
id: {
  type: DataTypes.INTEGER,
  primaryKey: true,
  autoIncrement: true,
  allowNull: false,
},
name: {
  type: DataTypes.STRING,
  allowNull: false,
},
email: {
  type: DataTypes.STRING,
  allowNull: false,
  unique: true,
},
password: {
  type: DataTypes.STRING,
  allowNull: false,
},
passwordChangedAt: {
  type: DataTypes.DATE,
  allowNull: true,
},
status: {
  type: DataTypes.ENUM('active', 'disabled'),
  allowNull: false,
  defaultValue: 'active',
},
role: {
  type: DataTypes.ENUM('normal', 'admin'),
  allowNull: false,
  defaultValue: 'normal',
},
});

module.exports = User;