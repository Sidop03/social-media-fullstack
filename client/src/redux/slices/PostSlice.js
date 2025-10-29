import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosClient } from "../../utils/axiosClient";
import { setLoading } from "./appConfigSlice";

// Async thunk to get user profile
export const getUserProfile = createAsyncThunk(
  'user/getUserProfile',
  async (body, thunkAPI) => {
    try {
      const response = await axiosClient.post('/user/getUserProfile', body);
      return response.data.result;
    } catch (err) {
      return Promise.reject(err);
    } 
  }
);

// Async thunk to like/unlike post
export const likeAndUnlike = createAsyncThunk(
  'posts/like',
  async (body, thunkAPI) => {
    try {
      const response = await axiosClient.post('/posts/like', body);
      console.log("LIKE RESPONSE", response);
      return response.data.result.post; // ✅ only return the post
    } catch (err) {
      return Promise.reject(err);
    } 
  }
);

// Post Slice
const postSlice = createSlice({
  name: 'postSlice',
  initialState: {
    userProfile: {
      posts: [],
      user: null,
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.userProfile = action.payload;
        console.log("USER PROFILE SET:", state.userProfile);
      })
      .addCase(likeAndUnlike.fulfilled, (state, action) => {
        const post = action.payload;
        console.log('Updated Post:', post);
        console.log('aandal ',state.userProfile);
        
        if (post && state.userProfile?.posts && Array.isArray(state.userProfile.posts)) {
          const index = state.userProfile.posts.findIndex(item => item._id === post._id);

          if (index !== -1) {
            state.userProfile.posts[index] = post;
          }
        } else {
          console.warn('posts not found or not an array:', state.userProfile?.posts);
        }
      });
  }
});

export default postSlice.reducer;
