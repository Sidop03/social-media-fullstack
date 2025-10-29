import React, { useState } from 'react'
import {Input} from 'antd';
import { axiosClient } from '../../utils/axiosClient';
import SingleProfile from './SingleProfile';
import './Search.scss'


function Search() {
  const [query,setQuery]=useState('');
  const [result,setResult]=useState([]);
  const {Search}= Input;
  const handleSearch= async(value)=>{
    try {
      const response=await axiosClient.get(`/search?query=${value}`);
      console.log('response',response);
      
      setResult(response.data.result);  

    } catch (err) {
      console.log('Search failed',err);
    }
    
  }
  return (
    <div className='search'>
      <Search className='Search-box' placeholder="search users" onChange={(e)=>setQuery(e.target.value)} value={query} onSearch={handleSearch} enterButton />
      {/* // display results */}
      <div>        
        {result?.users?.map(user=>(
            <SingleProfile key={user._id} user={user} />
          ))}
        
      </div>
      
    
    </div>
    
  )
}

export default Search