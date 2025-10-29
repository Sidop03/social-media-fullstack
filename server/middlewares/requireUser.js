const jwt= require('jsonwebtoken');
const User = require('../models/User');
const { error } = require('../utils/responseWrapper');
const requireUser= async(req,res,next)=>{
	if(!req.headers || !req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')){
		return res.status(401).send("Authorization header is required");
	}
	const AccessToken= req.headers.authorization.split(" ")[1];
	try{
		const decoded=jwt.verify(AccessToken,process.env.accessTokenSecretKey);
		req._id= decoded._id;
		const user= await User.findById(req._id);
		if(!user){
			return res.send(error(404,"User not found"));
		}
		next();
	}
	catch(err){
		console.log(err);
		res.status(401).send("Invalid Authorization key");
	}
}
module.exports= requireUser;
