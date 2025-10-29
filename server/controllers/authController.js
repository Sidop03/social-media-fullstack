const Users= require('../models/User.js');
const bcrypt= require('bcryptjs');
const jwt=require('jsonwebtoken')
const {error, success} = require('../utils/responseWrapper.js');
const User = require('../models/User.js');
const Post = require('../models/Post.js');
const loginController= async(req,res)=>{
	const password=req.body.password;
	const email= req.body.email;
	if(!password||!email){
		return res.send(error(400,'Incomplete details'));
	}
	const user= await Users.findOne({email}).select('+password');
	if(!user){
		// return res.status(404).send("User not found");
		return res.send(error(404,'User not found'));
	}
	const matched = await bcrypt.compare(password,user.password);
	if(!matched){
		// return res.status(403).send("Incorrect password");
		return res.send(error(403,'Incorrect password'));
	}
	const accessToken= generateAccessToken({_id:user.id});
	const refreshToken= generateRefreshToken({_id:user.id});
	res.cookie('jwt',refreshToken,{
		httpOnly: true,
		secure: true
	})
	return res.send(success(201,{accessToken}));
}

const generateAccessToken = (data)=>{
	const token=jwt.sign(data, process.env.accessTokenSecretKey,{
		expiresIn:'1d'
	});
	// console.log(token);
	return token;
}

const generateRefreshToken = (data)=>{
	const token=jwt.sign(data, process.env.refreshTokenSecretKey,{
		expiresIn:'1y'
	});
	// console.log(token);
	return token;
}

const RefreshAccessTokenController = async(req,res)=>{
	const cookies= req.cookies;
	if(!cookies.jwt){
		// return res.status(401).send("Refresh Token is required in cookies");
		return res.send(error(401,'Refresh Token is required in cookies'));
	}
	const refreshToken= cookies.jwt
	// console.log(refreshToken);
	try{
		const decoded= jwt.verify(refreshToken,process.env.refreshTokenSecretKey);
		const _id= decoded._id;
		const accessToken= generateAccessToken({_id});
		return res.send(success(201,{accessToken}));
	}
	catch(err){
		// console.log(err);
		// return res.status(401).send("Invalid Refresh Token")
		return res.send(error(401,"Invalid Refresh Token"));
	}
}

const signupController= async(req,res)=>{
	try{
		const password=req.body.password;
		const email= req.body.email;
		const name=req.body.name;
		if(!password||!email||!name){
			// return res.status(401).send("Incomplete details");
			return res.send(error(401,"Incomplete details"));
		}
		const checkUser= await Users.findOne({email});
		// if(checkUser) res.status(401).send("User already exists");
		if(checkUser) return res.send(error(400,"User already exists"));

		//new user 
		const hashed_password= await bcrypt.hash(password,10);
		const newUser= await Users.create({
			name,
			email,
			password:hashed_password
		})

		return res.send(success(201,"new user created")); 
	}
	catch(err){
		res.send(error(500,err));
	}
}

const logOutController = async(req,res)=>{
	try {
		res.clearCookie('jwt',{
			httpOnly: true,
			secure: true
		})
		return res.send(success(200,"User logged out"));
	} catch (err) {
		return res.send(error(500,e.message));
	}
}



module.exports= {
	loginController,
	signupController,
	RefreshAccessTokenController,
	logOutController,
}