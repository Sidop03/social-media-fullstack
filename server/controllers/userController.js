const User = require("../models/User");
const Post = require('../models/Post')
const { error,success } = require("../utils/responseWrapper");
const { mapPostOutput } = require("../utils/Utils");
const cloudinary = require('cloudinary').v2;

const followOrUnfollowUserController= async(req,res)=>{
  try {
    const {userIdToFollow}=req.body;
    const curUserId= req._id;
    const userToFollow= await User.findById(userIdToFollow);
    const curUser= await User.findById(curUserId);
    if(!userToFollow){
      return res.send(error(404,"User Not Found"));
    }
    if(userIdToFollow===curUserId){
      return res.send(error(409,"User can't follow himself"));
    }
    if(curUser.followings.includes(userIdToFollow)){
      const following_index=curUser.followings.indexOf(userIdToFollow);
      curUser.followings.splice(following_index,1);
      const follower_index=userToFollow.followers.indexOf(curUser);
      userToFollow.followers.splice(follower_index,1); 
    }
    else{
      userToFollow.followers.push(curUserId);
      curUser.followings.push(userIdToFollow);
      
    }
    await userToFollow.save();
    await curUser.save();
    return res.send(success(200,{user:userToFollow}));

  } catch (err) {
    return res.send(error(500,err.message));
  }
  
}

const getFeedData = async(req,res)=>{
  try {
    const curUserId= req._id;
    const curUser= await User.findById(curUserId).populate('followings');
    const fullPosts= await Post.find({
      "owner":{
        $in: curUser.followings
      }
    }).populate('owner');
    const posts= fullPosts.map(item=>mapPostOutput(item,req._id)).reverse();
    const followingIds= curUser.followings.map(item=>item._id);
    followingIds.push(req._id);
    const suggestions= await User.find({
      _id:{
        $nin:followingIds
      }
    })
    curUser.posts=posts;
    console.log(followingIds);
    
    // console.log('posts',posts);
    
    return res.send(success(200,{...curUser._doc,suggestions,posts}));
  } catch (err) {
    console.log(err);
    return res.send(error(500,err.message));
  }
}

const deleteMyProfileController= async(req,res)=>{
	try {
		//delete all its posts
		const curUserId= req._id;
		const curUser= await User.findById(curUserId);
		if(!curUser){
			return res.send(error(404,"User not found"));
		}
		await Post.deleteMany({
			owner:curUserId
		})
		curUser.followers.forEach(async(followerId) => {
			const follower = await User.findById(followerId);
			const index= follower.followings.indexOf(curUserId);
			follower.followings.splice(index,1);
			await follower.save();
		});

		curUser.followings.forEach(async(followingId)=>{
			const following= await User.findById(followingId);
			const index= following.followers.indexOf(curUserId);
			following.followers.splice(index+1);
			await following.save();
		})
		const allPosts= await Post.find();
		allPosts.forEach(async(post)=>{
			const index=post.likes.indexOf(curUserId);
			post.likes.splice(index,1);
			await post.save();
		})
		await curUser.deleteOne();
    res.clearCookie('jwt',{
      httpOnly:true,
      secure:true
    })
		return res.send(success(200,"User deleted"));
	} catch (err) {
		console.log(err);
		
		return res.send(error(500,err.message));
	}
	
}

const getMyPostController= async(req,res)=>{
	try {
		const curUserId= req._id;
		const curUser= await User.findById(curUserId);
		if(!curUser){
			return res.send(error(404,"User not found"));
		}
		const posts=await Post.find({
			owner: curUserId
		}).populate('likes')
		return res.send(success(200,{posts}));
	} catch (err) {
		return res.send(error(500,err.message));
	}
}

const getMyInfo = async(req,res)=>{
  try {
    const userId= req._id;
    const user= await User.findById(userId);
    return res.send(success(200,{user}));
  } catch (err) {
    return res.send(error(500,err.message));
  }
}

const updateMyProfile= async(req,res)=>{
  try {
    const {name,bio,userImg}= req.body;
    const user= await User.findById(req._id);
    if(name){
      user.name=name;
    }
    if(bio){
      user.bio=bio;
    }
    if(userImg){
      const cloud_img= await cloudinary.uploader.upload(userImg,{
        folder:'profileimg'
      })

      user.avatar={
        url:cloud_img.secure_url,
        public_id: cloud_img.public_id
      }
    }
    await user.save();
    
    return res.send(success(200,{user}));
  } catch (err) {
    console.log('babu ke cholo'); 
    
    return res.send(error(500,err.message));
  }  
}

const getUserProfile=async(req,res)=>{
  try {
    const userId=req.body.userId;
    const user= await User.findById(userId).populate({
      path: 'posts',
      populate: {
        path:'owner'
      }
    })
    const fullPosts=user.posts;
    const posts=fullPosts.map(item=>mapPostOutput(item,req._id)).reverse();
    res.send(success(200,{...user._doc,posts})); 
  } catch (err) {
    return res.send(error(500,err.message));
  }
}

module.exports= {
  followOrUnfollowUserController,
  getFeedData,
	deleteMyProfileController,
  getMyPostController,
  getMyInfo,
  updateMyProfile,
  getUserProfile
};