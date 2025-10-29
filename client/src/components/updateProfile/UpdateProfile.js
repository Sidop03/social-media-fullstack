import React, { useEffect, useState } from 'react'
import userImg from '../../assets/user.png';
import './UpdateProfile.scss';
import dummyImg from '../../assets/user.png'
import { useDispatch, useSelector } from 'react-redux';
import { updateMyProfile } from '../../redux/slices/appConfigSlice';

function UpdateProfile() {
  const dispatch= useDispatch();
  const myProfile=useSelector(state=>state.appConfigReducer.myProfile);
  const [name,setName]=useState('');
  const [bio,setBio]=useState('');
  const [userImg,setUserImg]=useState('');
  useEffect(()=>{
    setName(myProfile?.name||'');
    setBio(myProfile?.bio||'');
    setUserImg(myProfile?.avatar?.url);
  },[myProfile])

  function handleImageChange(e){
    const file= e.target.files[0];
    const fileReader= new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload= ()=>{
      if(fileReader.readyState===fileReader.DONE){
        setUserImg(fileReader.result);
      }
    }
  }

  function handleSubmit(e){
    e.preventDefault();
    dispatch(updateMyProfile({
      name,
      bio,
      userImg
    }))
  }
  return (
    <div className="UpdateProfile">
      <div className="container">
        <div className="left-part">
          <div className="input-user-image">
            <label htmlFor="inputImg" className="labelImg">
              <img src={userImg?userImg:dummyImg} alt={name} />
            </label>
            <input type="file" id='inputImg' className='inputImg' accept='image/*' onChange={handleImageChange}/>
          </div>
        </div>
        <div className="right-part">
          <form action="" onSubmit={handleSubmit}>
            <input type="text" value={name} placeholder='Your name' onChange={(e)=>{setName(e.target.value)}}/>
            <input type="text" value={bio} placeholder='Your bio' onChange={(e)=>{setBio(e.target.value)}}/>
            <input type="submit" className='btn-primary' onClick={handleSubmit}/>
          </form>
          <button className='delete-user btn-primary'>Delete Account</button>

        </div>
      </div>
    </div>
  )
}

export default UpdateProfile