import React, { use, useState } from 'react'
import './Navbar.scss'
import Avatar from '../avatar/Avatar'
import { useNavigate } from 'react-router-dom'
import { IoIosLogOut } from "react-icons/io";
import { useRef } from "react";
import LoadingBar, { LoadingBarRef } from "react-top-loading-bar";
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '../../redux/slices/appConfigSlice';
import { axiosClient } from '../../utils/axiosClient';
import { KEY_ACCESS_TOKEN, removeItem } from '../../utils/localStorageManager';

function Navbar() {
  const dispatch=useDispatch();
  const navigate= useNavigate();
  const myProfile=useSelector(state=>state.appConfigReducer.myProfile);
  async function handleLogoutClicked(){
    try{
      await axiosClient.post('/auth/logout');
      removeItem(KEY_ACCESS_TOKEN);
      navigate('/login')
    }
    catch(e){
      console.log(e);
    }
  }
  return (
    <div className="Navbar">
      <div className="container">
        <h2 className="banner hover-link" onClick={()=>navigate('/')}>Social Media</h2>
        <div className="right-side">
          <div className="profile hover-link" onClick={()=>navigate(`/profile/${myProfile?._id}`)}>
            <Avatar src={myProfile?.avatar?.url}/>
          </div>
          <div className="logout hover-link" onClick={handleLogoutClicked}>
            <IoIosLogOut/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar