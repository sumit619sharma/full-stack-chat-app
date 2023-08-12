const express = require('express');

const app = express();
const cors = require('cors')
const sequelize  =require('./util/database');
 
require('dotenv').config(); 

const User = require('./models/user')
const UserMessage = require('./models/user-message')
const Group = require('./models/group')
const UserGroup = require('./models/user-group')

app.use(cors());
app.use(express.json());


const userRouter = require('./routes/user');
const userMessageRouter = require('./routes/user-message');
const groupRouter = require('./routes/group');

app.use('/user-message',userMessageRouter);
app.use('/user',userRouter);
app.use('/group',groupRouter);


User.hasMany(UserMessage);
UserMessage.belongsTo(User);

User.belongsToMany(Group, { through: UserGroup });
Group.belongsToMany(User, { through: UserGroup });

Group.hasMany(UserMessage);
UserMessage.belongsTo(Group);




sequelize.sync()
.then(result => {
  //  console.log(result);
const server =     app.listen(process.env.PORT);

const io = require('socket.io')(server
  , {
  pingTimeOut: 6000,
  cors: {
    origin: ['http://localhost:3000']
  },
})

io.on('connection', (socket) => {
  console.log('socket connect with client==')

  socket.on('disconnect',() => {
    console.log('user disconnected');
  })

  socket.on('setup', (user) => {
    socket.join(user.userId);
    console.log('user id===',user.userId)
    socket.emit('connected')
  }) 

  socket.on('join chat' , (room) => {
    socket.join(room);
    console.log('user joined room', room);
  })

  socket.on('new message', (newMessageReceived) => {
    console.log('new message obj==',newMessageReceived)
    let users = newMessageReceived.users || [];
    users.forEach((us)=> {

      socket.in(us.userId).emit('message received', newMessageReceived);
    })
  })

});

}).catch(err=> {

    console.log("sequelize error==",err);
})