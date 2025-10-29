import React from 'react'
import './SingleProfile.scss';
import { useNavigate } from 'react-router-dom';
function SingleProfile({user}) {
  const navigate= useNavigate();
  const handleSearchClick = ()=>{
    navigate(`/profile/${user._id}`);
  }
  return (
    <div className='SingleProfile' onClick={handleSearchClick} key={user._id}>
      <div className='profile-pic'>
        <img src={user.avatar?.url} alt={user.name}/>
      </div>
      <div className='profile-id'>{user.name}</div>
    </div>
  )
}

export default SingleProfile