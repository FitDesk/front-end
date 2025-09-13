import axios from 'axios'

const fitdeskApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
});

fitdeskApi.interceptors.response.use(
    (res) => res,
    async (error) => {
        const original = error.config;
        if (error.response?.status === 401 && !original?._retry) {
            original._retry = true;
            try {
                await axios.post(`${import.meta.env.VITE_API_URL}/security/auth/refresh`, {}, { withCredentials: true });
                return fitdeskApi.request(original);
            } catch (e) {
                console.log(e)
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
)



export { fitdeskApi }