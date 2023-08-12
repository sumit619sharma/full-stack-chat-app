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



  const updateGroup =async (req,res)=>{
    const { grpId, userList,grpName } = req.body;
    console.log('body==',req.body);
    try {

     await Group.update( {
        name: grpName,
       },
      {
        where: {
          id: grpId
        },
      })

      await UserGroup.destroy({
        where: {
          groupId: grpId,
        },
        });

        const updatedRecords = userList.map((user)=> {
          return {
            groupId: grpId,
            userId:user.id,
            userName: user.name
          }
        })

          await UserGroup.bulkCreate(updatedRecords);
         res.status(200).json({success: true, message: 'update group successfully'});
    } catch (error) {
        res.status(400).json({error});
    }
    }
    

    const  getUsersByGroupId = async (req,res) => {
  
      const id =Number( req.params.id);
      console.log('group id for user of group',id);
        try {
        let group =  await Group.findByPk(id, {
          include: {
            model: User,
            through: {
              where: {
                groupId: id,
              },
              attributes: []
            },
          },
        });
        
        //users = users.map((us)=> us.dataValues);
      
        let usersInGroup = group.dataValues.users
        usersInGroup = usersInGroup.map((us)=> us.dataValues);
           console.log('useList of group==',usersInGroup);
      
        res.json({success: true, data: usersInGroup});
      
      } catch (error) {
        console.log('error==',error)
        res.status(401).json({success:false ,message: 'failed to get user'})
      }
      
      }

module.exports={
    createGroup,
    retrieveGroup,
    getUsersByGroupId,
    updateGroup
    
}