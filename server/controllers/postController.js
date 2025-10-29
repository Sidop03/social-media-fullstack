const Post = require('../models/Post.js');
const User = require('../models/User.js');
const {error, success} = require('../utils/responseWrapper.js');
const { mapPostOutput } = require('../utils/Utils.js');
const cloudinary = require('cloudinary').v2;

const getAllPostController = (req,res)=>{
	return res.send(success(200,"These are all the posts"));
}

const createPostController=async(req,res)=>{

	try {
		const {caption,postImg}= req.body;
		if(!caption||!postImg){
			return res.send(error(400,"Incomplete Details"));
		}
		const cloudImg= await cloudinary.uploader.upload(postImg,{
			folder:'postImg'
		});
		const owner=req._id;
		const user= await User.findById(req._id);
		const post= await Post.create({
			owner,
			caption,
			image:{
				publicId: cloudImg.public_id,
				url:cloudImg.url
			}
		})
		user.posts.push(post._id);
		await user.save();
		// console.log('Post',post);
		// console.log('User',user);
		
		return res.send(success(201,{post}));
	} catch (err) {
		res.send(error(500,err.message));
	}
}

const likeDislikeController=async(req,res)=>{
	try {
		const {postId}=req.body;
		const curr_userId= req._id;
		const post = await Post.findById(postId).populate('owner', '_id name avatar') 
		if(!post){
			return res.send(error(404,"Post not found"));
		}
		if(post.likes.includes(curr_userId)){
			const index= post.likes.indexOf(curr_userId);
			post.likes.splice(index,1);
		}
		else{
			post.likes.push(curr_userId);
		}
		await post.save();
		return res.send(success(200,{post:mapPostOutput(post,req._id)}));
	} 
	catch (err) {
		return res.send(error(500,err.message)); 
	}	
}

const updatePostController= async(req,res)=>{
	try {
		const {postId,caption}= req.body;
		const curUserId= req._id;
		const post= await Post.findById(postId);
		if(!post){
			return res.send(error(404,"Post not found"));
		}
		if(post.owner.toString()!==curUserId){
			return res.send(error(500,"Only owner can update the post"));
		}
		if(caption){
			post.caption=caption
		}
		await post.save();
		return res.send(success(200,{post}));
	} catch (err) {
		res.send(error(500,err.message));
	}
}

const deletePostController = async(req,res)=>{
	try {
		const {postId}= req.body;
		const curUserId= req._id;
		const post= await Post.findById(postId);
		const curUser= await User.findById(curUserId);
		if(!post){
			return res.send(error(404,"Post not found"));
		}
		if(post.owner.toString()!==curUserId){
			return res.send(error(500,"Only owner can delete the post"));
		}
		const index= curUser.posts.indexOf(postId);
		curUser.posts.splice(index,1);
		await curUser.save();
		await post.deleteOne();
		return res.send(success(200,"Post deleted"));
	} catch (err) {
		return res.send(error(500,err.message));
	}
}



module.exports= {
	getAllPostController,
	createPostController,
	likeDislikeController,
	updatePostController,
	deletePostController,
}