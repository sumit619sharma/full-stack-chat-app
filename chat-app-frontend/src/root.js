import React from 'react';



import {BrowserRouter, Routes,Route,  Router,Navigate  } from 'react-router-dom'
// import Welcom from './Components/Welcom';
// import Profile from './Components/Profile';
// import NavBar from './Components/NavBar';
// import Forgot from './Components/Forgot';
// import CartProvider from './store/CartProvider';
import {  useSelector } from 'react-redux';
import './App.css';
import SignUp from './Components/SignUp';
import Login from './Components/Login';
import LatestChat from './Components/latestChat';
import CreateGroup from './Components/create-group';
import UpdateGroup from './Components/update-group';


const Root = () => {
    const emailExist =  useSelector(state=> state.auth.userDetail.email)
    // const theme =  useSelector(state=> state.theme.theme)
   
  return  <div className={`app`} > 
   
      <BrowserRouter>
      {/* <NavBar/> */}
   <Routes>
  <Route path='/' element={<SignUp  /> }/>
  <Route path='/login' element={<Login/> }/>
   <Route path='/home' element={<LatestChat />} />
   <Route path='/group' element={<CreateGroup />} />
   <Route path='/update-group/:id' element={<UpdateGroup />} />
  {/* <Route path='/forgot' element={<Forgot/> }/> */}
  <Route path='/*' element={<SignUp/> }/>
   </Routes>
  </BrowserRouter>
      
      </div>
}
export default Root;