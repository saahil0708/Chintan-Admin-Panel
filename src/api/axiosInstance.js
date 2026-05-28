import axios from 'axios';

export const backendURL = import.meta.env.MODE === 'production' 
  ? "https://chintan-server.onrender.com" 
  : "http://localhost:5000";

const api = axios.create({
    baseURL: backendURL,
    withCredentials: true,
    timeout: 120000, // 2 minutes to accommodate server cold starts
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // Avoid looping on the refresh token endpoint itself
        if (originalRequest.url.includes('/api/auth/refresh-token')) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                await axios.post(`${backendURL}/api/auth/refresh-token`, {}, { withCredentials: true });
                return api(originalRequest);
            } catch (refreshError) {
                // If refresh fails (token expired/invalid), we clear localStorage to reset frontend state
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('user');
                // You could also dispatch a logout action here if you inject the store, 
                // but clearing localStorage is a solid fallback for now.
                if (window.location.pathname !== '/') {
                    window.location.href = '/';
                }
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
