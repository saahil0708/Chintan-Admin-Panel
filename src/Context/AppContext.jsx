import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AppContext = createContext();

const AppContextProvider = ({ children }) => {
    const backendURL = import.meta.env.VITE_BACKEND_URL;
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Check authentication state on app load
    useEffect(() => {
        getAuthState();
        // eslint-disable-next-line
    }, []);

    const getAuthState = async () => {
        try {
            const { data } = await axios.get(`${backendURL}/api/auth/is-authenticated`, { withCredentials: true });
            if (data && data._id) {
                setIsLoggedIn(true);
                setUserData(data);
            } else {
                setIsLoggedIn(false);
                setUserData(null);
            }
        } catch (error) {
            setIsLoggedIn(false);
            setUserData(null);
        }
    };

    const getUserData = async () => {
        try {
            setIsLoading(true);
            const { data } = await axios.get(`${backendURL}/api/users/profile`, { withCredentials: true });
            if (data && data._id) {
                setUserData(data);
                return data;
            }
            return null;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch user data");
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const login = (user) => {
        setIsLoggedIn(true);
        setUserData(user);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify(user));
    };

    // Navigation should be handled in the component, not here!
    const logout = async () => {
        try {
            setIsLoading(true);
            await axios.post(`${backendURL}/api/auth/logout`, {}, { withCredentials: true });
            setIsLoggedIn(false);
            setUserData(null);
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('user');
            toast.success("Logged Out Successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to logout");
        } finally {
            setIsLoading(false);
        }
    };

    const sendVerificationOTP = async () => {
        try {
            const { data } = await axios.post(
                `${backendURL}/api/auth/send-otp`,
                { email: userData?.email },
                { withCredentials: true }
            );
            toast.success(data.message || "OTP sent to your email.");
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send OTP");
            return false;
        }
    };

    const verifyEmail = async (otp) => {
        try {
            const { data } = await axios.post(
                `${backendURL}/api/auth/verify-account`,
                { email: userData?.email, otp },
                { withCredentials: true }
            );
            if (data.message?.toLowerCase().includes("success")) {
                toast.success(data.message);
                await getUserData(); // Refresh user data
                return true;
            } else {
                toast.error(data.message || "Verification failed");
                return false;
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Verification failed");
            return false;
        }
    };

    const value = {
        backendURL,
        isLoggedIn,
        userData,
        isLoading,
        setIsLoading,
        login,
        logout,
        getUserData,
        sendVerificationOTP,
        verifyEmail,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within AppContextProvider');
    }
    return context;
};

export { AppContextProvider, useAppContext };