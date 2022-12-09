import axios from "axios";

const BackendUrl = 'http://localhost:8000/api/';
const mediaUrl = 'http://localhost:8000/media/';
const API_KEY = "Y7TZ0JJHMQ9JVXP4";

const axiosInstance = axios.create({
    baseURL : BackendUrl,
    timeout : 10000,
    withCredentials:true,
    headers :{
        'Content-Type' : 'application/json',
        accept : 'application/json',
        "Access-Control-Allow-Origin":"*",
        'Access-Control-Allow-Credentials':true
    }
})

export default axiosInstance
export {mediaUrl,API_KEY};