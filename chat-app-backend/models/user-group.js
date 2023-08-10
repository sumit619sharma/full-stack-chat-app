const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const UserGroup = sequelize.define('user_group',{
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
},
userId: Sequelize.INTEGER,
groupId: Sequelize.INTEGER,
userName: Sequelize.STRING,
 
});

module.exports = UserGroup;