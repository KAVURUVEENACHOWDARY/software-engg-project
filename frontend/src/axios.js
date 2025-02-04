import axios from "axios";

const publicIP = '<public-ip>' // elastic IP of development server

const BASE_URL = `http://${publicIP}:3002`

const axiosInstance=axios.create({
    baseURL:BASE_URL,
});

export default axiosInstance; 