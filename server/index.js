const mongoose= require('mongoose');
const express= require('express');
const dotenv= require('dotenv');
const dbConnect = require('./dbConnect');
const authRouter= require('./routers/authRouter');
const postRouter= require('./routers/postRouter');
const searchRouter=require('./routers/searchRouter');
const cookieParser= require('cookie-parser');
dotenv.config({path:'./.env'});
const morgan=require('morgan');
const cors=require('cors');
const userRouter=require('./routers/userRouter');
const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_SECRET_KEY
});

const app= express();

app.use(express.json({
	limit: '10mb'
}));
app.use(morgan('common'));
app.use(cookieParser());
app.use(cors({
	credentials:true,
	origin:'http://localhost:3000'
}))

app.get('/',(req,res)=>{
	res.status(200).send("Successful");
})
app.use('/auth',authRouter);
app.use('/posts',postRouter);
app.use('/user',userRouter);
app.use('/search',searchRouter);
dbConnect();
app.listen(`${process.env.PORT}`,()=>{
	console.log(`Listening on port: ${process.env.PORT}`);
})