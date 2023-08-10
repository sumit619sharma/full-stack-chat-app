import { createSlice } from "@reduxjs/toolkit"; 

const initialState = {
    chatList: [],
}

const chatSlice = createSlice({
    name: 'chats',
    initialState,
    reducers: {
        updateChats(state,action){
             const data = action.payload.data || [];
             const prevChat = state.chatList;
  
  // Combine previous chat and new data without unnecessary array copying
  const newList = [...prevChat, ...data];
  
  // Limit the array length to the last 10 elements using slice with a negative start index
  const updatedList = newList.slice(-10);
  console.log('updatedList===',updatedList);
  state.chatList = updatedList;
        }
    }
})

export const chatAction = chatSlice.actions;

export default chatSlice.reducer;