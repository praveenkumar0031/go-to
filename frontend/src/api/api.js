import axios from'axios'
import { useGoogleLogin } from '@react-oauth/google';
const api = import.meta.env.VITE_BACKEND_API || "http://localhost:8000/api/goto";


const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export const loginapi=async({email,password})=>{
    try {
    const res = await axios.post(`${api}/login`, { 
      email, 
      password 
    });
    //console.log("Login Success:", res.data);
    return res.data;

  } catch (e) {
    console.error("Login Error:", e.response?.data || e.message);
    throw e; 
  }
}


export const getUserApi=async()=>{
    try{
    const res=await axios.get(`${api}/user`,getAuthHeader());
    //console.log("USER Data ", res.data);
    return res.data;
    }catch(e){
        console.error("USER data fetch Error:", e.response?.data || e.message);
    throw e; 
    }
}
export const signupapi=async({username,email,password,role})=>{
    try{
      
    const res=await axios.post(`${api}/signup`,{
        username,
        email,
        password,
        role
    });
    console.log("Signup Success:", res.data);
    
    return res.data;
    }catch(e){
        console.error("Signup Error:", e.response?.data || e.message);
    throw e; 
    }
}

export const verifyGoogleCode = async (code) => {
    const response = await axios.post(`${api}/auth/google`, { code });
//     
    return response.data;
};

