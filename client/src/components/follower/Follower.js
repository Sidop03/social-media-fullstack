import React, { useEffect, useState } from 'react'
import Avatar from '../avatar/Avatar'
import './Follower.scss'
import { useDispatch, useSelector } from 'react-redux'
import { followAndUnfollowUser } from '../../redux/slices/FeedSlice';
import { Navigate, useNavigate } from 'react-router-dom';

function Follower({user}) {
  const dispatch=useDispatch();
  const feedData=useSelector(state=> state.feedDataReducer.feedData);
  const [isFollowing,setIsFollowing]=useState()
  useEffect(()=>{
    setIsFollowing(feedData.followings.find(item=>item._id===user._id))
  },[feedData])
  function handleUserFollow(){
    dispatch(followAndUnfollowUser({
      userIdToFollow:user._id 
    }))
  }
  const navigate=useNavigate();
  return (
    <div>
      <div className="Follower">
        <div className="user-info" onClick={()=>navigate(`/profile/${user._id}`)}>
          <Avatar src={user?.avatar?.url}/>
          <div className="name">
            {user?.name}
          </div>
        </div>
        <div className={isFollowing?"hover-link follow-link":"btn-primary "} 
            onClick={handleUserFollow}>
          {isFollowing?'Unfollow':'Follow'}
        </div>
      </div>
    </div>
  )
}

export default Follower