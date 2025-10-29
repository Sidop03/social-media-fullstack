import {configureStore} from '@reduxjs/toolkit';
import appConfigReducer from './slices/appConfigSlice.js';
import postReducer from './slices/PostSlice.js'
import feedDataReducer from './slices/FeedSlice.js'
export default configureStore({
  reducer:{
    postReducer,
    appConfigReducer,
    feedDataReducer
  }
})
