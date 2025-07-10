// import { createContext, useContext, useState, useEffect } from 'react';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// const AppContext = createContext();

// const AppContextProvider = ({ children }) => {
//     const backendURL = "https://chintan-server.onrender.com";
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const [userData, setUserData] = useState(null);
//     const [isLoading, setIsLoading] = useState(false);

//     // Check authentication state on app load
//     useEffect(() => {
//         getAuthState();
//         // eslint-disable-next-line
//     }, []);

//     const getAuthState = async () => {
//         try {
//             const { data } = await axios.get(`${backendURL}/api/auth/is-authenticated`, { withCredentials: true });
//             if (data && data._id) {
//                 setIsLoggedIn(true);
//                 setUserData(data);
//             } else {
//                 setIsLoggedIn(false);
//                 setUserData(null);
//             }
//         } catch (error) {
//             setIsLoggedIn(false);
//             setUserData(null);
//         }
//     };

//     const getUserData = async () => {
//         try {
//             setIsLoading(true);
//             const { data } = await axios.get(`${backendURL}/api/users/profile`, { withCredentials: true });
//             if (data && data._id) {
//                 setUserData(data);
//                 return data;
//             }
//             return null;
//         } catch (error) {
//             toast.error(error.response?.data?.message || "Failed to fetch user data");
//             return null;
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const login = (user) => {
//         setIsLoggedIn(true);
//         setUserData(user);
//         localStorage.setItem('isLoggedIn', 'true');
//         localStorage.setItem('user', JSON.stringify(user));
//     };

//     // Navigation should be handled in the component, not here!
//     const logout = async () => {
//         try {
//             setIsLoading(true);
//             await axios.post(`${backendURL}/api/auth/logout`, {}, { withCredentials: true });
//             setIsLoggedIn(false);
//             setUserData(null);
//             localStorage.removeItem('isLoggedIn');
//             localStorage.removeItem('user');
//             toast.success("Logout Succesful");
//         } catch (error) {
//             toast.error(error.response?.data?.message || "Failed to logout");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const sendVerificationOTP = async () => {
//         try {
//             const { data } = await axios.post(
//                 `${backendURL}/api/auth/send-otp`,
//                 { email: userData?.email },
//                 { withCredentials: true }
//             );
//             toast.success(data.message || "OTP sent to your email.");
//             return true;
//         } catch (error) {
//             toast.error(error.response?.data?.message || "Failed to send OTP");
//             return false;
//         }
//     };

//     const verifyEmail = async (otp) => {
//         try {
//             const { data } = await axios.post(
//                 `${backendURL}/api/auth/verify-account`,
//                 { email: userData?.email, otp },
//                 { withCredentials: true }
//             );
//             if (data.message?.toLowerCase().includes("success")) {
//                 toast.success(data.message);
//                 await getUserData(); // Refresh user data
//                 return true;
//             } else {
//                 toast.error(data.message || "Verification failed");
//                 return false;
//             }
//         } catch (error) {
//             toast.error(error.response?.data?.message || "Verification failed");
//             return false;
//         }
//     };

//     const value = {
//         backendURL,
//         isLoggedIn,
//         userData,
//         isLoading,
//         setIsLoading,
//         login,
//         logout,
//         getUserData,
//         sendVerificationOTP,
//         verifyEmail,
//     };

//     return (
//         <AppContext.Provider value={value}>
//             {children}
//         </AppContext.Provider>
//     );
// };

// const useAppContext = () => {
//     const context = useContext(AppContext);
//     if (!context) {
//         throw new Error('useAppContext must be used within AppContextProvider');
//     }
//     return context;
// };

// export { AppContextProvider, useAppContext };

"use client"

import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-toastify"

const AppContext = createContext()

const AppContextProvider = ({ children }) => {
  const backendURL = "https://chintan-server.onrender.com"

  // Initialize state from localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const stored = localStorage.getItem("isLoggedIn")
    return stored === "true"
  })

  const [userData, setUserData] = useState(() => {
    const stored = localStorage.getItem("user")
    try {
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)

  // Check authentication state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      const storedLogin = localStorage.getItem("isLoggedIn")
      const storedUser = localStorage.getItem("user")

      if (storedLogin === "true" && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser)

          // Set the user data immediately from localStorage
          setIsLoggedIn(true)
          setUserData(parsedUser)

          // Then verify with server in the background
          await getAuthState()
        } catch (error) {
          console.log("Session verification failed, logging out")
          console.log("Error:", error.message)

          // Only log out if it's a definitive auth failure (401, 403)
          if (error.response?.status === 401 || error.response?.status === 403) {
            console.log("Definitive auth failure, logging out")
            localStorage.removeItem("isLoggedIn")
            localStorage.removeItem("user")
            setIsLoggedIn(false)
            setUserData(null)
          }
        }
      } else {
        setIsLoggedIn(false)
        setUserData(null)
      }

      setIsInitializing(false)
    }

    initializeAuth()
  }, [])

  const getAuthState = async () => {
    try {
      const { data } = await axios.get(`${backendURL}/api/auth/is-authenticated`, {
        withCredentials: true,
        timeout: 10000,
      })

      console.log("Auth API Response:", data) // Debug log

      // Based on your backend code, the response structure is:
      // { authenticated: true, user: { _id, name, email, ... } }
      if (data && data.authenticated === true && data.user && data.user._id) {
        setIsLoggedIn(true)
        setUserData(data.user)
        localStorage.setItem("isLoggedIn", "true")
        localStorage.setItem("user", JSON.stringify(data.user))
        return data.user
      } else {
        console.log("Invalid auth response structure:", data)
        throw new Error("Invalid auth response")
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      console.log("Response data:", error.response?.data)

      // Clear auth state on failure
      setIsLoggedIn(false)
      setUserData(null)
      localStorage.removeItem("isLoggedIn")
      localStorage.removeItem("user")
      throw error
    }
  }

  const getUserData = async () => {
    try {
      setIsLoading(true)
      const { data } = await axios.get(`${backendURL}/api/users/profile`, {
        withCredentials: true,
        timeout: 10000,
      })

      if (data && data._id) {
        setUserData(data)
        localStorage.setItem("user", JSON.stringify(data))
        return data
      }
      return null
    } catch (error) {
      console.error("Failed to fetch user data:", error)
      toast.error(error.response?.data?.message || "Failed to fetch user data")

      // If user data fetch fails, might be session expired
      if (error.response?.status === 401) {
        setIsLoggedIn(false)
        setUserData(null)
        localStorage.removeItem("isLoggedIn")
        localStorage.removeItem("user")
      }
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const login = (user) => {
    setIsLoggedIn(true)
    setUserData(user)
    localStorage.setItem("isLoggedIn", "true")
    localStorage.setItem("user", JSON.stringify(user))
  }

  const logout = async () => {
    try {
      setIsLoading(true)
      await axios.post(
        `${backendURL}/api/auth/logout`,
        {},
        {
          withCredentials: true,
          timeout: 10000,
        },
      )
    } catch (error) {
      console.error("Logout API call failed:", error)
      // Continue with logout even if API call fails
    } finally {
      // Always clear local state and storage
      setIsLoggedIn(false)
      setUserData(null)
      localStorage.removeItem("isLoggedIn")
      localStorage.removeItem("user")
      setIsLoading(false)
      toast.success("Logout Successful")
    }
  }

  const sendVerificationOTP = async () => {
    try {
      const { data } = await axios.post(
        `${backendURL}/api/auth/send-otp`,
        { email: userData?.email },
        { withCredentials: true, timeout: 10000 },
      )
      toast.success(data.message || "OTP sent to your email.")
      return true
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP")
      return false
    }
  }

  const verifyEmail = async (otp) => {
    try {
      const { data } = await axios.post(
        `${backendURL}/api/auth/verify-account`,
        { email: userData?.email, otp },
        { withCredentials: true, timeout: 10000 },
      )
      if (data.message?.toLowerCase().includes("success")) {
        toast.success(data.message)
        await getUserData() // Refresh user data
        return true
      } else {
        toast.error(data.message || "Verification failed")
        return false
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed")
      return false
    }
  }

  const value = {
    backendURL,
    isLoggedIn,
    userData,
    isLoading,
    isInitializing,
    setIsLoading,
    login,
    logout,
    getUserData,
    sendVerificationOTP,
    verifyEmail,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useAppContext must be used within AppContextProvider")
  }
  return context
}

export { AppContextProvider, useAppContext }
