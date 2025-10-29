import React, { useState } from 'react'
import './Login.scss'
import {Link, useNavigate} from 'react-router-dom'
import { axiosClient } from '../../utils/axiosClient';
import { setItem,KEY_ACCESS_TOKEN } from '../../utils/localStorageManager';

function Login() {
	const [email,setEmail]=useState('');
	const [password,setPassword]=useState('');
	const navigate = useNavigate();
	const handleSubmit=async(e)=>{
		e.preventDefault();
		// try {
		// debugger;
			console.log('Form submitted',e);
			const result = await axiosClient.post('/auth/login', {
				email,
				password
			});
			localStorage.setItem(KEY_ACCESS_TOKEN,result.accessToken);
			console.log('Login response:', result);
			// debugger;

			if (result.status === 200) {
				// debugger;
				localStorage.setItem(KEY_ACCESS_TOKEN, result.data.result.accessToken);
				console.log('✅ Token set:', result.data.result.accessToken);
			}


		// } catch (error) {
		// 	console.error('Login failed:', error);
		// 	alert('Invalid email or password');
		// }
	}
	return (
		<div className='Login'>
			<div className="Login-box">
				<h2 className='heading'>Login</h2>
				<form onSubmit={handleSubmit}>
					<label htmlFor="email" >Email</label>
					<input type="text" 
						className='input' 
						id='email'
						onChange={(e)=>setEmail(e.target.value)}
					/>
				
					<label htmlFor="password">Password</label>
					<input type="password" 
						className='input' 
						id='password'
						onChange={(e)=>setPassword(e.target.value)}
					/>

					<input type="submit" className='submit' />
				</form>
				<p className='subHeading'>Do not have an account? 
					<Link to="/signup">Sign Up</Link>
				</p>
			</div>
		</div>
	)
}

export default Login