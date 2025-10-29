import React, { useState } from 'react'
import './SignUp.scss'
import { Link } from 'react-router-dom'
import { axiosClient } from '../../utils/axiosClient';
import { useNavigate } from 'react-router-dom';

function SignUp() {
	const [name,setName]= useState('');
	const [email,setEmail]= useState('');
	const [password,setPassword]=useState('');
	const navigate = useNavigate();
	const handleSubmit = async(e)=>{
		e.preventDefault();
		try {
			// debugger
			const result= await axiosClient.post('auth/signup',{
				name,
				email,
				password
			})
			
			console.log(result);
			navigate('/');
		} catch (error) {
			console.log(error);
			
		}
	}
	return (
			<div className='signup'>
				<div className="signup-box">
					<h2 className='heading'>Sign Up</h2>
					<form action="">
						<label htmlFor="name" >Username</label>
						<input type="text" className='name' id='name' onChange={(e)=>setName(e.target.value)}/>

						<label htmlFor="email" >Email</label>
						<input type="text" className='input' id='email' onChange={(e)=>setEmail(e.target.value)}/>
					
						<label htmlFor="password">Password</label>
						<input type="text" className='input' id='password' onChange={(e)=>setPassword(e.target.value)}/>
	
						<input type="submit" className='submit' onClick={handleSubmit}/>
					</form>
					<p className='subHeading'>Already have an account? 
						<Link to="/login">Log In</Link>
					</p>
				</div>
			</div>
		)
}

export default SignUp