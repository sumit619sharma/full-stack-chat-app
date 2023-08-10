import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-reducer";

import themeReducer from "./theme-reducer";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Defaults to localStorage for web
import chatReducer from "./chat-reducer";

const rootReducer = combineReducers({
    auth: authReducer,
    chats: chatReducer,
    theme: themeReducer,
  });

// Configure Redux Persist
const persistConfig = {
    key: 'root', // Change this key based on your application's requirement
    storage,
  };

  const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create Redux store
export const store = configureStore({
    reducer: persistedReducer,
  });

  export const persistor = persistStore(store);

// export default store;