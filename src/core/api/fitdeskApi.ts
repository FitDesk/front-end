import axios from 'axios'

const fitdeskApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

fitdeskApi.interceptors.request.use((config) => {
    
    
    return config;
})


export { fitdeskApi }