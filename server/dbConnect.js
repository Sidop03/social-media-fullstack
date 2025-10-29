const mongoose= require('mongoose');
const dbConnect= async()=>{
	await mongoose.connect(process.env.MONGO_URI,{
		useNewUrlParser: true,
  		useUnifiedTopology: true,
	}).then(()=>{
		console.log("MongoDB connected");
	}).catch((err)=>{
		console.log("Error in connecting ",err);
	});
}
module.exports= dbConnect;