import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosClient } from "../../utils/axiosClient";
import { IoMdBody } from "react-icons/io";

// debugger;
export const getMyInfo= createAsyncThunk('user/getMyInfo',async(_,thunkAPI)=>{
  try {
    const response= await axiosClient.get('/user/getMyInfo');
    return response.data.result;
  } catch (err) {
    return Promise.reject(err);
  }
  
});

export const updateMyProfile = createAsyncThunk(
  "user/updateMyProfile",
  async (body , thunkAPI)=>{
    try {
      const response= await axiosClient.put('/user/updateMyProfile', body);
      console.log(response);
      return response.data.result;
    } catch (err) {
      return Promise.reject(err);
    }
    
  }
)


const appConfigSlice = createSlice({
  name:'appConfigSlice',
  initialState:{
    isLoading:false,
    myProfile:null, 
    toastData:{}
  },
  reducers:{
    setLoading: (state,action)=>{
      state.isLoading=action.payload;
    },
    showToast: (state, action) => {
      state.toastData = action.payload;
    }
  },
  extraReducers:(builder)=>{
    builder.addCase(getMyInfo.fulfilled ,(state,action)=>{
      state.myProfile=action.payload.user;
    })
    .addCase(updateMyProfile.fulfilled ,(state,action)=>{
      state.myProfile=action.payload.user;
    })
  }
})

export default appConfigSlice.reducer;
export const {setLoading,showToast}=appConfigSlice.actions;