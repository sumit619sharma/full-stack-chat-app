import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoggedIn: false,
    userDetail: {},
    
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
      onLogIn(state,action) {

        state.isLoggedIn= true;
        state.userDetail =  {... action.payload.data}  
      
      },
        
      onLogOut(state){
        console.log("get called onLogOut");
         state.isLoggedIn=false;
         state.userDetail={};
      },
      onPayment(state){
        state.userDetail.isPremium=true;
      }
    }
})

export const authAction = authSlice.actions;

export default authSlice.reducer;