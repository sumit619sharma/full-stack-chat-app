
import './App.css';



import { Provider } from 'react-redux';
import {store,persistor} from './redux-store/index';
import Root from './root';
import { PersistGate } from 'redux-persist/integration/react';


const  App = ()=> {


   // Call the purge method on the persistor to clear the persisted state
   // persistore.purge().then(() => {
   //   console.log('Redux Persist state has been cleared.');
   // }).catch((error) => {
   //   console.error('Error clearing Redux Persist state:', error);
   // });

   return (
      <Provider store={store} >
       <PersistGate loading={null} persistor={persistor}>
    <Root/>
    </PersistGate>
      </Provider>
    
  );
}

export default App;
