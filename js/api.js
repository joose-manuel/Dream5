import axios from "axios";
const token = localStorage.getItem("token")
console.log("🚀 ~ file: api.js:3 ~ token:", token)

export const hotelApi = axios.create({
    baseURL: "https://api-hotel-900l.onrender.com",
    headers: {
        'Authorization': `Bearer ${token}`
    }
})
