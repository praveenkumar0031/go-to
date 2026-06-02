import axios from 'axios'
import { useGoogleLogin } from '@react-oauth/google';
const api = import.meta.env.VITE_BACKEND_API || "http://localhost:8000/api/goto";
const redirectapi=import.meta.env.VITE_REDIRECT_API||"http://localhost:8000/goto";

const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export const loginapi = async ({ email, password }) => {
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


export const getUserApi = async () => {
    try {
        const res = await axios.get(`${api}/user`, getAuthHeader());
        //console.log("USER Data ", res.data);
        return res.data;
    } catch (e) {
        console.error("USER data fetch Error:", e.response?.data || e.message);
        throw e;
    }
}
export const signupapi = async ({ username, email, password, role }) => {
    try {

        const res = await axios.post(`${api}/signup`, {
            username,
            email,
            password,
            role
        });
        console.log("Signup Success:", res.data);

        return res.data;
    } catch (e) {
        console.error("Signup Error:", e.response?.data || e.message);
        throw e;
    }
}

export const verifyGoogleCode = async (code) => {
    const response = await axios.post(`${api}/auth/google`, { code });
    //     
    return response.data;
};


// CREATE URL
export const createShortUrl = async (data) => {
    const response = await axios.post(
        `${api}/urls`,
        data,
        getAuthHeader()
    );

    return response.data;
};


// GET ALL URLS
export const getAllUrls = async () => {
    const response = await axios.get(
        `${api}/urls`,
        getAuthHeader()
    );

    return response.data;
};


// GET ANALYTICS
export const getUrlAnalytics = async (shortCode) => {
    const response = await axios.get(
        `${redirectapi}/urls/${shortCode}/analytics`,
        getAuthHeader()
    );

    return response.data;
};


// UPDATE URL
export const updateShortUrl = async (shortCode, data) => {
    const response = await axios.put(
        `${api}/urls/${shortCode}`,
        data,
        getAuthHeader()
    );

    return response.data;
};


// DELETE URL
export const deleteShortUrl = async (shortCode) => {
    const response = await axios.delete(
        `${api}/urls/${shortCode}`,
        getAuthHeader()
    );

    return response.data;
};


// GET ALL LOGS
export const getAllLogs = async () => {
    const response = await axios.get(
        `${redirectapi}/logs/all`,
        getAuthHeader()
    );

    return response.data;
};
export const getTodayLogs = async () => {
    const response = await axios.get(
        `${redirectapi}/logs/today`,
        getAuthHeader()
    );

    return response.data;
};