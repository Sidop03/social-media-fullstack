import React from 'react'
import './Post.scss'
import Avatar from '../avatar/Avatar'
import backgroundImg from '../../assets/pexels-francesco-ungaro-2325447.jpg'
import { FaRegHeart,FaHeart } from "react-icons/fa";
import { useDispatch } from 'react-redux';
import { likeAndUnlike } from '../../redux/slices/PostSlice';
import { useNavigate } from 'react-router-dom';
import { TOAST_SUCCESS } from '../../App';
import { showToast } from '../../redux/slices/appConfigSlice';
function Post({post}) {
  const dispatch= useDispatch();
  async function handlePostLiked(){
    dispatch(likeAndUnlike({
      postId:post._id
    }))
    dispatch(showToast({
      id:Date.now(),
      type:TOAST_SUCCESS,
      message:'liked or unliked' 
    }))
  }
  const navigate=useNavigate();
  return (
    <div className="Post">
      <div className="heading" onClick={(e)=>{
        navigate(`/profile/${post.owner._id}`)
        }}>
        <Avatar src={post?.owner?.avatar?.url} />
        <h4>{`${post?.owner?.name}`}</h4>
      </div>
      <div className="content">
        <img src={post?.image?.url} alt="" />
      </div>
      <div className="footer">
        <div className="like" onClick={handlePostLiked}>
          {
            post.isLiked?<FaHeart className='icon'/>:<FaRegHeart className='icon'/>
          }
          <h4>{`${post?.likesCount} likes`}</h4>
        </div>
        <p className="caption">
          {post?.caption}
        </p>
        <h6 className='time-ago'>{post?.timeAgo}</h6>
      </div>
    </div>
  )
}

export default Post