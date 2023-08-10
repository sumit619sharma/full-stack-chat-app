const UserMessage = require('../models/user-message')
const UserGroup = require('../models/user-group')
const User = require('../models/user');
const {Op } = require('sequelize')
require('dotenv').config(); 
const AWS = require('aws-sdk')

async function uploadToS3(file){
  const BUCKET_NAME = process.env.BUCKET_NAME;
  const IAM_USER_KEY =process.env.IAM_USER_KEY;
  const IAM_USER_SECRET =process.env.IAM_USER_SECRET;

  let s3bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET,
  })
    
  var params = {
      Bucket: BUCKET_NAME,
      Key: file.originalname,
      Body: file.buffer,
      
      ACL: 'public-read'
    }
    return new Promise((resolve,reject) => {
      s3bucket.upload(params, (err,resp) =>{
        if(err){
console.log("s3 error==",err);
reject(err);
        }
        else{
resolve(resp.Location);
        }
       });

    })
     
     

 }

const sendMessage =async (req,res) => {
  console.log('in send message');

  const file = req.file || null;
console.log('file after multer',file)
  

  let fileUrl=null;
  if(file!=null){
    console.log('inside s3')
    fileUrl= await uploadToS3(file);
  }
  
 console.log('file url',fileUrl);


console.log('body===', req.body.userName);
const {message,gpId,userName} = req.body


    try {
 let userMsg =     await UserMessage.create({message,userId: req.user.id, groupId: gpId,userName: userName,url: fileUrl})
 //console.log('user message==',userMsg.id);
//  let users =     await UserGroup.findAll({where: {groupId: req.body.gpId}})
//    users = users.map(us=> us.dataValues);


// //console.log('user of group',users);
//    const data = {
//     id: userMsg.id,
//     groupId: req.body.gpId,
//     users,
//     message: req.body.message,
//     url: '',
//     sender: req.user.id
//    }

   res.status(200).json({success: true, message: "send message success"})            
    } catch (error) {
        res.status(400).json({success: false, message: "failed to send"})
    }

}

const receiveMessage =async (req,res) => {
          
   const gpId = Number(req.query.gpId);
    try {
      let msgList = await UserMessage.findAll({
        where: { groupId: gpId }
      ,  attributes: ['message', 'userId','id','userName','url'] 
      })

   msgList = msgList.map(obj => obj.dataValues);
   //  let grpMsg = [];
   
  //    for(const msg of msgList){
  //   const user = await User.findByPk(msg.userId);
  //   grpMsg.push({ id: msg.id, message: msg.message , user: user.name, userId: user.id })
  //  }

  
     res.status(200).json({success: true, messageList: msgList})            
    } catch (error) {
        console.log(error);
        res.status(400).json({success: false, message: "failed to send"})
    }
}

module.exports = {
    sendMessage,
    receiveMessage,
}