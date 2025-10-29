import './App.css';
import Login from './pages/login/Login';
import SignUp from './pages/signup/SignUp';
import { Route,Routes } from 'react-router-dom';
import Home from './pages/home/Home'
import RequireUser from './components/RequireUser';
import Feed from './components/feed/Feed';
import Profile from './components/profile/Profile';
import UpdateProfile from './components/updateProfile/UpdateProfile';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useRef } from 'react';
import LoadingBar from 'react-top-loading-bar';
import OnlyIfNotLoggedIn from './components/OnlyIfNotLoggedIn';
import toast from 'react-hot-toast'
import { Toaster } from 'react-hot-toast';

export const TOAST_SUCCESS='toast_success'
export const TOAST_FAILURE='toast_failure' 
function App() {
  const isLoading=useSelector(state=>state.appConfigReducer.isLoading);
  const loadingRef= useRef(null);
  const toastData= useSelector(state=>state.appConfigReducer.toastData);
  
  useEffect(()=>{
    if(isLoading){
      loadingRef.current?.continuousStart();
    }
    else{
      loadingRef.current?.complete();
    }
  },[isLoading])
  useEffect(() => {
    // debugger
    if (!toastData?.message) return;
      console.log("Toast data received:", toastData);
      switch (toastData.type) {
          case TOAST_SUCCESS:
            toast.success(toastData.message);
            break;

          case TOAST_FAILURE:
            toast.error(toastData.message);
            break;

          default:
            toast(toastData?.message);
        }
  }, [toastData?.id]);

  return (
    <div className='App'>
      <LoadingBar color="#f11946" ref={loadingRef} shadow={true} />
      <Toaster position="top-right" />
      <Routes>
        <Route element={<RequireUser />}>
          <Route path='/' element={<Home />}>
            <Route index element={<Feed />} />
            <Route path='/profile/:userId' element={<Profile/>}/>
            <Route path='/updateProfile' element={<UpdateProfile/>}/>
          </Route>
        </Route>
        {/* <Route element={<OnlyIfNotLoggedIn/>}> */}
          <Route path='/login' element={<Login/>}></Route>
          <Route path='/signup' element={<SignUp/>}></Route>
        {/* </Route> */}
      </Routes>
    </div>
  );
}

export default App;
