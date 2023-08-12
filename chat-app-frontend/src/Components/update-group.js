import axios from 'axios';
import React, { useState } from 'react'
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
const UpdateGroup = () => {
  
  const [name, setName] = useState('');
  const {id} = useParams();
  const userData = useSelector((state) => state.auth.userDetail) || {};
  const [removedUsers,setRemovedUsers] = useState([]);
  const [users, setUsers] = useState();
const navigate = useNavigate();
  

  const handleSubmit =async (event) => {
    event.preventDefault();
    // Call the API to fetch users with the entered search value
    try {
      await  axios.post(`http://localhost:4000/group/create`,{ name, removedUsers: removedUsers},{ headers: { Authorization: userData.idToken } })
     navigate('/home');
    } catch (error) {
        
    }
  };

  const fetchUsers =async () => {
    try {
      const resp =  await axios.get(`http://localhost:4000/user/matched?search=${searchValue}`,{ headers: { Authorization: userData.idToken } })
      console.log('searched user====',resp.data);
      setUsers(resp.data.matchUser);
      
    } catch (error) {
      console.log('not created ')
    }
    };

    use


  return (
    <div className='mt-5 mx-5'>
    <form onSubmit={handleSubmit} className='mb-3' >
     <h3>Create Group:</h3>
      <label className='mb-3'>
        Group Name:
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <br />
     
      <Button type="submit">Update</Button>
    </form>

    {/* Display the fetched users */}
    {users && 
    <div style={{ height: '100px', overflowY: 'auto' }}>
      <ul>
        {users.map((user) => (
         <div></div>
        ))}
      </ul>
    </div>}
  </div>
  )
}

export default UpdateGroup;
