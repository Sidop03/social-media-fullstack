import React, { useEffect } from 'react'
import './Feed.scss'
import Post from '../post/Post'
import Follower from '../follower/Follower'
import { useSelector,useDispatch } from 'react-redux'
import CreatePost from '../createPost/CreatePost.js'
import { getFeedData } from '../../redux/slices/FeedSlice.js'
function Feed() {
  const dispatch=useDispatch();
  const feedData= useSelector(state=>state.feedDataReducer.feedData);
  useEffect(()=>{
    dispatch(getFeedData());
  },[dispatch]);
  return (
    <div className='Feed'>
      <div className="container">
        <div className="left-part">
          <CreatePost/>
          {Array.isArray(feedData?.posts) &&
            feedData.posts.map(post => (
              <>
                <Post key={post._id} post={post}/>
              </>
              
            ))
          }

        </div>
        <div className="right-part">
            <div className="Following">
              <h3 className='title'>You are following</h3>
              {
                feedData?.followings?.map(user=> <Follower key={user._id} user={user}/>)
              }
            </div>
            <div className="suggestions">
              <h3 className='title'>Suggested for You</h3>
              {
                feedData?.suggestions?.map(user=> <Follower key={user._id} user={user}/>)
              }
            </div>
        </div>
      </div>
    </div>
  )
}

export default Feed