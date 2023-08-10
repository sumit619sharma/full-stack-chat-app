const User = require('../models/user')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize');

//require('dotenv').config(); 
const secretKey = process.env.SECRET_KEY;

const  signUpUser= async ( req,res)=>{
    console.log('user req received==',req.body);
    const email = req.body.email;
const user = await User.findOne({where:{email: email}})


if(user){
    return res.status(400).send({success: false,message: "email already exist"});
}
// hash the password
const hashedPassword = await bcrypt.hash(req.body.password,10);
 const resp= await User.create({ name:req.body.name, email: email,
     password: hashedPassword,phone:req.body.phone
  })
  res.send({success: true,message: "sign up success"})

}

const  logInUser= async ( req,res)=>{
     const email = req.body.email;
    const password = req.body.password;
let user = await User.findOne({where:{email: email}})


if(!user){
    return await res.status(404).send({success: false,message: "user not found"});
}
user = user.dataValues;

const isPasswordValid = await bcrypt.compare(password, user.password);
if(!isPasswordValid){
    return await res.status(401).send({success: false,message: "wrong password"})
}

res.json({success:true,message: "user logged in successfully",email: user.email,token:generateAccesstoken(user.id),isPremium: false,userId: user.id,name: user.name});
}

function generateAccesstoken(id){
    return jwt.sign({userId: id},secretKey)
}

const isAuthorized =  async(req,res,next) =>{
  
try {
    const authToken =await req.headers.authorization;
    const decUser =  jwt.verify(authToken,secretKey);
  
    if(decUser===undefined){
        return await res.send({message:'invalid token'})
    }
    
    const user =  await User.findOne({where: {id: decUser.userId}})
  
    if(!user){
       await res.status(404).send({success: false, message: 'user Not found'})
    } else{
        req.user = user;
        console.log("Succed for create request=====");
        next();
    }    
} catch (error) {
    res.status(404).send({success: false, message: 'user Not found'})
} 

}

const searchUser = async (req,res) => {
try {
    const value = req.query.search;
  
    let matchUser = await User.findAll({
     where: {
         [Op.or]: [
           { name: value }, 
           { email: value },
           { phone: value },
         ],
       },
    }) || [];
 
   matchUser = matchUser.map((mu)=> mu.dataValues);
   res.json({matchUser})
} catch (error) {
    res.status(500).json({message: error})
}
}
                    
module.exports={
    signUpUser,
    logInUser,
    isAuthorized,
    searchUser
}