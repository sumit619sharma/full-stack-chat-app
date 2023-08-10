import React, { useState, useEffect } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const CreateGroup = () => {
  const [name, setName] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [users, setUsers] = useState();
  const [addedUsers,setAddedUsers] = useState([]);
  const userData = useSelector((state) => state.auth.userDetail) || {};
const navigate =   useNavigate();
  // Debounce the API call with a 300ms delay
  const debouncedFetchUsers = debounce((value) => {
    fetchUsers(value);
  }, 300);

  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
    // Call the debounced API function whenever the input value changes
    debouncedFetchUsers(event.target.value);
  };

  const fetchUsers =async (searchValue) => {
  try {
    const resp =  await axios.get(`http://localhost:4000/user/matched?search=${searchValue}`,{ headers: { Authorization: userData.idToken } })
    console.log('searched user====',resp.data);
    setUsers(resp.data.matchUser);
    
  } catch (error) {
    console.log('not created ')
  }
  };

  const handleSubmit =async (event) => {
    event.preventDefault();
    // Call the API to fetch users with the entered search value
    try {
      await  axios.post(`http://localhost:4000/group/create`,{ name, add: addedUsers},{ headers: { Authorization: userData.idToken } })
     navigate('/home');
    } catch (error) {
        
    }
  };

  const addUser = (id)=>{
       if(!addedUsers.includes(id)){
setAddedUsers([...addedUsers,id]);
       }
  }


  useEffect(() => {
    // Cleanup the debounced function on component unmount
    return () => debouncedFetchUsers.cancel();
  }, []);

  return (
    <div className='mt-5 mx-5'>
      <form onSubmit={handleSubmit} className='mb-3' >
       <h3>Create Group:</h3>
        <label className='mb-3'>
          Group Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <br />
        <label className='mb-3'>
          Search User:
          <input type="text" value={searchValue} onChange={handleInputChange} />
        </label>
        <br/>
        <Button type="submit">Create</Button>
      </form>

      {/* Display the fetched users */}
      {users && 
      <div style={{ height: '100px', overflowY: 'auto' }}>
        <ul>
          {users.map((user) => (
            <li key={user.id}>{user.name} <Button onClick={()=> addUser(user.id) } >add</Button> </li>
          ))}
        </ul>
      </div>}
    </div>
  );
};

export default CreateGroup;
