import React, { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { chatAction } from '../redux-store/chat-reducer';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Storage } from '@aws-amplify/storage';
import { uploadFile } from 'react-s3';
let groupId;
const ENDPOINT = 'http://localhost:4000'
var socket , selectedChat

const config = {
  bucketName: 'expense-tracker-619',
  dirName: 'photos', /* optional */
  region: 'eu-north-1',
  accessKeyId: 'AKIA5IALZNEQZDAD2TMC',
  secretAccessKey: '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',
}

const LatestChat = () => {
  const [inputValue, setInputValue] = useState('');
  const [groupList,setGroupList] = useState([]);
  const [isGroup,setIsGroup] = useState(false);
  const [group,setGroupId]=  useState();
  const [groupName,setGroupName] = useState('');
  const dispatch = useDispatch();
  const [messageList, setMessageList] = useState([]);
  const [socketConnected,setSocketConnected] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const user = useSelector((state) => state.auth.userDetail) || {};
  
  //const messageList = useSelector((state) => state.chats.chatList) || [];
       const navigate = useNavigate();
//console.log('chat list==',chatList);
  const lastMsg = messageList.length>0? messageList[messageList.length-1].id: 0;
  //const lastMsg = 0;
  useEffect(()=>{
    socket = io(ENDPOINT); 
    socket.emit('setup', user );
    socket.on('connected', ()=> setSocketConnected)
   },[])

  const receiveMessage =async () => {
    console.log('on open grpId==',groupId);
    if(!groupId) return;
 try {
 
  const resp =   await axios.get(`http://localhost:4000/user-message?gpId=${groupId}`,{ headers: { Authorization: user.idToken } })
 const msgList = await resp.data.messageList;
 
 //dispatch(chatAction.updateChats({data: msgList}))
 setMessageList(msgList);
  setIsGroup(true);

socket.emit('join chat', groupId);

 } catch (error) {
  console.log(error);
 }
   
}

console.log('selectedFile',selectedFile);
  const handleSubmit =async (e) => {
    e.preventDefault();
  const formData = new FormData();
  formData.append('file', selectedFile); // Assuming you have a 'file' object containing the selected file
formData.append('message', inputValue);
formData.append('gpId', groupId);
formData.append('userName', user.name);

  console.log('form data',formData);
  try {
    //{message: inputValue,formData, gpId: groupId,userName: user.name}
      console.log('Form submitted with value:', inputValue);
     const resp = await axios.post("http://localhost:4000/user-message",formData, { headers: { Authorization: user.idToken, 'Content-Type': 'multipart/form-data' } })    
     const data =await  resp.data.data;
     setSelectedFile('')
     setInputValue('');
     await receiveMessage();
   console.log('resp data',resp.data);
    // socket.emit('new message',data);
    setGroupId(0);
    
  } catch (error) {
    console.log('failed to send',error);
  }  
  };

    const fetchGroup=async ()=>{
   try {
    const resp =   await axios.get(`http://localhost:4000/group/matched`,{ headers: { Authorization: user.idToken } })
      console.log('fetched grp', resp.data);
    setGroupList(resp.data.groupName)

   } catch (error) {
    console.log('error', error);
   }
      }

    useEffect(()=>{
      
      fetchGroup();
    },[])

    

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleFileChange = (event) => {
    console.log('file',event.target.files);
    const file = event.target.files[0];
    
    setSelectedFile(file);
  };

  const navigateTo = ()=>{
    console.log('on navigate===');
navigate('/group')
  }

  const updateGroup = (id)=>{

    navigate('/update-group');
  }
  
  const openChat = (id,name)=>{ 
    console.log(id);
  groupId =id;
  setGroupName(name);
  setGroupId(Math.random());
  }

  useEffect(()=>{
receiveMessage();
selectedChat = groupId; 
  },[groupId])

  // useEffect(()=>{
  //     socket.on('message received', (newMessageReceived) => {
  //       if(!selectedChat || selectedChat!= newMessageReceived.groupId) {

  //       }else{
  //         const sendUser = newMessageReceived.users.filter((us)=> us.userId==newMessageReceived.sender)
  //         const data = {
  //           id: newMessageReceived.id,
  //           userId: newMessageReceived.sender,
  //           userName: sendUser[0].userName,
  //            message: newMessageReceived.message,
           
  //          }
  //         // setMessageList([...messageList,data]);
  //       }
  //     })
  // })

  return (
    <>
    
   <div style={{display:'flex',justifyContent: 'center'}}>
    <div style={{flex: 1,margin:'7px'}} >
   <Button onClick={navigateTo} >create group</Button>
   <div>
   <h4>Group Names:</h4>
      {
        groupList.length>0 && 
        groupList.map((obj) => {
          //{ user.userId==obj.admin &&  <button onClick={ ()=> updateGroup(obj.id)} >update</button>}
         // console.log("saved user==",user.userId)
          return <>
            <div style={{margin: '5px', backgroundColor:'gray',padding:'5px'}} key={obj.id}> <span onClick={()=>  openChat(obj.id,obj.name)} > <b> {obj.name}</b> </span>  </div>
          </>
        })
      }
    </div>
    </div>
    <div style={{flex: 3}}>
      
      { isGroup?
    <>
       <div style={{margin:'7px'}} > <h3> { groupName }</h3></div>
        {messageList && 
        <div style={{ height: '80%' }} >{
        messageList.map((obj) => {
         // console.log("saved user==",user.userId)
          return <>
          <div>
          {obj.url && <img src={obj.url} style={{width:'100px',height:'100px'}} /> }
            <div style={obj.userId==user.userId? {backgroundColor: 'gray', padding: '7px',margin:'5px'}: { padding: '7px',margin:'5px'} } key={obj.id}> <span> <b> {obj.userName}:</b> </span> {obj.message}  </div>
            </div>
          </>
        }) }
        </div>
        }
        <Form onSubmit={handleSubmit} className="m-4"  >
      
        <div style={{width:'100%'}} >
        <input style={{width:'45%'}}
          type="text"
          placeholder="Enter text here"
          value={inputValue}
          onChange={handleChange}
        />
        <input type="file" accept="image/*,video/*" onChange={handleFileChange} />
      {/* {selectedFile && (
          <p>Selected File: {selectedFile.name}</p>
        )} */}
        </div>
      <Button variant="primary" type="submit" >
       Send
      </Button>
      
      

      
    </Form>

        </>
         :
        <div style={{marginTop: '20%',marginLeft:'7%'}} > <b> Click to any group to start chat!!!</b> </div>
      }
  
    </div>
</div>
    </>
  );
};




export default LatestChat;
