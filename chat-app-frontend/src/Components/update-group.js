import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
const UpdateGroup = () => {
  
  const [name, setName] = useState('');
  const {id} = useParams();
  const userData = useSelector((state) => state.auth.userDetail) || {};
  
  const [users, setUsers] = useState();
const navigate = useNavigate();
  

  const handleSubmit =async (event) => {
    event.preventDefault();
    // Call the API to fetch users with the entered search value
    
    try {
      await  axios.post(`http://localhost:4000/group/update`,{ grpName: name, userList: users,grpId: id},{ headers: { Authorization: userData.idToken } })
     navigate('/home');
    } catch (error) {
        console.log('failed to update',error);
    }
  };

  const fetchUsers =async () => {
    try {
      const resp =  await axios.get(`http://localhost:4000/group/get-user/${id}`,{ headers: { Authorization: userData.idToken } })
    
      setUsers(resp.data.data);
      
    } catch (error) {
      console.log('not created ')
    }
    };

    useEffect(() => {
      fetchUsers();
    },[])

    const removeUser =(user)=> {
      const upList = users.filter((us)=> us.id!=user.id)
      setUsers(upList);
    }

  return (
    <div className='mt-5 mx-5'>
    <form onSubmit={handleSubmit} className='mb-3' >
     <h3>Update Group:</h3>
      <label className='mb-3'>
        Group Name:
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <br />
     
      <Button type="submit">Update</Button>
    </form>

    {/* Display the fetched users */}
    {users && 
    <div style={{ height: '500px', overflowY: 'auto' }}>
      <ul>
        {users.map((user) => (
        <div> <li><h3>{user.name}</h3> <Button onClick={()=> removeUser(user)} variant='danger' >Delete</Button> </li></div>
        ))}
      </ul>
    </div>}
  </div>
  )
}

export default UpdateGroup;
