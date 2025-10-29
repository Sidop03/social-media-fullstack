import React, { useState } from 'react'
import Avatar from '../avatar/Avatar'
import './CreatePost.scss'
import backgoundImg from '../../assets/pexels-francesco-ungaro-2325447.jpg'
import {BsCardImage} from 'react-icons/bs'
import { axiosClient } from '../../utils/axiosClient'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '../../redux/slices/appConfigSlice'
import { getUserProfile } from '../../redux/slices/PostSlice'

const CreatePost=()=>{

  const [postImg,setPostImg]=useState(); 
  const [caption,setCaption]=useState();
  const myProfile= useSelector(state=>state.appConfigReducer.myProfile)
  const dispatch=useDispatch();

  const handleImageChange = (e)=>{
    const file= e.target.files[0];
    const fileReader= new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload= ()=>{
      if(fileReader.readyState===fileReader.DONE){
        setPostImg(fileReader.result);
      }
    }
  }

  const handlePostSubmit=async ()=>{
    try {
      const result= await axiosClient.post('/posts',{
        caption,
        postImg
      })
      dispatch(getUserProfile())
    } catch (err) {
      console.log(err.message);
    }
    finally{
      setCaption('');
      setPostImg('');
    }
  }
  return (
    <div className='createPost'>
      <div className="Left-part">
        <Avatar src={myProfile?.avatar?.url}/>
      </div>
      <div className="right-part">
        <input type="text" className='captionInput' placeholder="What's on your mind"
          onChange={(e)=>{setCaption(e.target.value)}}
          value={caption}
        />
        {
          postImg&&<div className="imageContainer">
            <img src={postImg} alt="post-img" className="postImg" />
          </div>
        }
        
        <div className="bottom-part">
          <div className="input-post-img">
            <label htmlFor="inputImg" className="labelImg">
              <BsCardImage/>
            </label>
            <input type="file" id='inputImg' className='inputImg' accept='image/*' onChange={handleImageChange}/>
          </div>
          <button className='post-btn btn-primary' onClick={handlePostSubmit}>Post</button>
        </div>
      </div>
      
    </div>
  )
}

export default CreatePost