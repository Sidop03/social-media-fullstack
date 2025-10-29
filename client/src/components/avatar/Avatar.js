import React from 'react'
import user from '../../assets/user.png'
import './Avatar.scss'

function Avatar({src}) {
  return (
    <div className="Avatar">
      <img src={src?src:user} alt="user avatar" />
    </div>
  )
}

export default Avatar