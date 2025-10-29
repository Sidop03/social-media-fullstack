import axios from 'axios';
import { getItem, setItem, removeItem, KEY_ACCESS_TOKEN } from './localStorageManager';
import store from '../redux/store';
import { setLoading, showToast } from '../redux/slices/appConfigSlice';
import { TOAST_FAILURE } from '../App';
import { v4 as uuidv4 } from 'uuid';

export const axiosClient = axios.create({
  baseURL:process.env.REACT_APP_SERVER_BASE_URL,
  withCredentials: true
});

//  Request Interceptor — attaches access token to every request
axiosClient.interceptors.request.use((request) => {
  // debugger;
  const accessToken = localStorage.getItem(KEY_ACCESS_TOKEN);
  if (accessToken) {
    request.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  store.dispatch(setLoading(true));
  return request;
}, (error) => {
  return Promise.reject(error);
});

// Response Interceptor — handles token expiration and refresh
axiosClient.interceptors.response.use(
  (response) => {
    // If response is successful, return as-is
    store.dispatch(setLoading(false))

    return response;
  },
  async (error) => {
    // debugger;
    store.dispatch(setLoading(false));
    console.log('error');
    
    const originalRequest = error.config;
    console.log('Dispatching toast');
    
    store.dispatch(showToast({
      id: uuidv4(),
      type: TOAST_FAILURE,
      message: 'Something went wrong'
    }))
    //  If response is 401 and request has not already been retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      // debugger;

      originalRequest._retry = true;
      try {
        //  Try refreshing the token
        const refreshResponse = await axiosClient.get('/auth/refresh');
        // console.log('pp');
        // console.log(refreshResponse);
        

        if (refreshResponse.status === 200) {
          const newAccessToken = refreshResponse.data.result.accessToken;
 
          // Save new access token
          // setItem(KEY_ACCESS_TOKEN, newAccessToken);
          localStorage.setItem(KEY_ACCESS_TOKEN,newAccessToken);

          // Retry original request with new token
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axiosClient(originalRequest);
        }
      } catch (refreshError) { 
        console.error('Refresh token failed:', refreshError);
        removeItem(KEY_ACCESS_TOKEN);
        window.location.replace('/login');
        return Promise.reject(refreshError);
      }
    }


    return Promise.reject(error);
  }
);
