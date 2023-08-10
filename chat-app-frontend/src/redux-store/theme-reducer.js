import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    theme: 'light',
    error: false,
    }

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
      toggleTheme(state){
        state.theme= state.theme=='light'? 'dark' : 'light'
      },
      darkTheme(state){
        state.theme= 'dark';
      },
      toggleError(state){
        console.log('error called dipatch')
        state.error = !state.error;
      }
    }
})

export const themeAction = themeSlice.actions;

export default themeSlice.reducer;