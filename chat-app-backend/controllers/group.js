const User = require('../models/user')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize');
const Group = require('../models/group');
const UserGroup = require('../models/user-group');


const createGroup =async (req,res)=>{
    try {
         const {name , add} = req.body
           add.push(req.user.id)
       
        const group  =await Group.create({   name,admin: req.user.id })
   
        for (const userId of add) {
            const user = await User.findByPk(userId);
            if (user) {
              
              await group.addUser(user, { through: { userName: user.name,userId: user.id } });
            }
          }

        
        res.status(201).json({ message: 'User created and added to group successfully.' });

    } catch (error) {
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
}



const retrieveGroup =async (req,res)=>{
  
try {
    let groups = await   UserGroup.findAll({where: {
        userId: req.user.id,
     }, attributes: ['groupId'] })
  groups = groups.map((gp)=> gp.dataValues);
 
  // run loop for each group extract name of group and return list of group name that belong to current user
   let groupName = [];
   for(const grp of groups){
    const getGroup = await Group.findByPk(grp.groupId);
  groupName.push( {id:grp.groupId ,name: getGroup.name ,admin: getGroup.admin} );   
}

res.status(200).json({groupName});

} catch (error) {
    res.status(400).json({error});
}
}

const  getUsersByGroupId = async (req,res) => {
const {id} = req.params;
  try {
  let users = await User.findAll({
    include: {
       model: UserGroup,
       where: {
         groupId: id,
      },
    },
  })
  
  users = users.map((us)=> us.dataValues);
  res.json({success: true, data: users});

} catch (error) {
  res.status(401).json({success:false ,message: 'failed to get user'})
}

}

  const updateGroup =async (req,res)=>{
  
    try {
        let groups = await   UserGroup.findAll({where: {
            userId: req.user.id,
         }, attributes: ['groupId'] })
      groups = groups.map((gp)=> gp.dataValues);
     
      // run loop for each group extract name of group and return list of group name that belong to current user
       let groupName = [];
       for(const grp of groups){
        const getGroup = await Group.findByPk(grp.groupId);
      groupName.push( {id:grp.groupId ,name: getGroup.name ,admin: getGroup.admin} );   
    }
    
    res.status(200).json({groupName});
    
    } catch (error) {
        res.status(400).json({error});
    }
    }

module.exports={
    createGroup,
    retrieveGroup,getUsersByGroupId,
    updateGroup
    
}