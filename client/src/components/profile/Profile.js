import React, { useState } from 'react'
import './Profile.scss'
import Post from '../post/Post'
import userImg from '../../assets/user.png'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getUserProfile } from '../../redux/slices/PostSlice'
import { useEffect } from 'react'
import CreatePost from '../createPost/CreatePost.js'
import { followAndUnfollowUser } from '../../redux/slices/FeedSlice.js'
import { getFeedData } from '../../redux/slices/FeedSlice.js'

function Profile() {
  // debugger
  const navigate=useNavigate();
  const params= useParams();
  const dispatch = useDispatch();

  const userProfile= useSelector(state=> state.postReducer.userProfile);  
  const myProfile= useSelector(state=> state.appConfigReducer.myProfile);
  const [isMyProfile,setIsMyProfile]=useState(false);
  const [isFollowing,setIsFollowing]=useState(false);
  const feedData= useSelector(state=>state.feedDataReducer.feedData)
  const handleUserFollow = () => {
    dispatch(followAndUnfollowUser({ userIdToFollow: params.userId }))
      .then(() => {
        dispatch(getUserProfile({ userId: params.userId }));
        dispatch(getFeedData());
      });
  };
  useEffect(() => {
    if (params.userId) {
      dispatch(getUserProfile({ userId: params.userId }));
    }
  }, [params.userId, dispatch]);

  useEffect(() => {
    if (myProfile && params.userId) {
      setIsMyProfile(myProfile._id === params.userId);
    }
    setIsFollowing(feedData?.followings?.find((item)=>item._id===params.userId));
  }, [myProfile, params.userId,feedData]);
  
  return (
    <div className="Profile">
      <div className="container">
        
        <div className="left-part">
          {
            isMyProfile&&<CreatePost/>
          }
          {
            userProfile?.posts?.map(post=><Post key={post._id} post={post}/>)
          }
        </div>
        <div className="right-part">
          <div className="profile-card">
            <img src={userProfile?.avatar?.url} alt="User Image" className='user-img'/>
            <h3 className='user-name'>{userProfile?.name}</h3>
            <p className='bio'>{userProfile?.bio}</p>
            <div className="follower-info">
              <h4>{`${userProfile?.followers?.length} followers`}</h4>
              <h4>{`${userProfile?.followings?.length} following`}</h4>
            </div>
            {
              !isMyProfile&&
              <div className={isFollowing?"hover-link follow-link":"btn-primary "} 
                onClick={handleUserFollow} style={{marginTop:'20px'}}>
                {isFollowing?'Unfollow':'Follow'} 
              </div>
            }
            {
              isMyProfile&&<button className='update-profile btn-secondary' onClick={()=>navigate('/updateProfile')}>Update Profile</button>
            }
            
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile