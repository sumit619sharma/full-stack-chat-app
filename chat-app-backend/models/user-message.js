const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const UserMessage = sequelize.define('user_message',{
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
},
message: Sequelize.STRING, 
userName: Sequelize.STRING,
url: Sequelize.STRING,
});

module.exports = UserMessage;