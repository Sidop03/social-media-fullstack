import React, { useEffect } from 'react';
import { axiosClient } from '../../utils/axiosClient';
import Navbar from '../../components/navbar/Navbar';
import { Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getMyInfo } from '../../redux/slices/appConfigSlice';
import './home.scss';
import Search from '../../components/Search/Search';

function Home() {
  // debugger;
  const dispatch= useDispatch();
  useEffect(()=>{
    dispatch(getMyInfo());
  },[])
  return (
    <div className='home'>
      <Navbar/>
      <Search/>
      <div className="outlet" style={{marginTop:'60px'}}>
        <Outlet/>
      </div>
    </div>
  );
}

export default Home;
