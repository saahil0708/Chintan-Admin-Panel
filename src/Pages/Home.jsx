import React, { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { TextField, Button, IconButton, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, setLoading, fetchUserProfile, sendResetOTP, resetPassword } from "../redux/slices/authSlice";
import api from "../api/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AdminHomePage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading } = useSelector((state) => state.auth);

    // Forgot Password States
    const [openForgotModal, setOpenForgotModal] = useState(false);
    const [forgotStep, setForgotStep] = useState(1); // 1: Email, 2: OTP & New Password
    const [resetEmail, setResetEmail] = useState("");
    const [resetOtp, setResetOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [isResetting, setIsResetting] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error("Please fill in all fields");
            return;
        }
        
        dispatch(setLoading(true));
        
        try {
            const { data } = await api.post(
                `/api/auth/login`,
                { email, password },
                { 
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (data?.success && data?.user) {
                dispatch(loginSuccess(data.user));
                toast.success("Login Successful");
                navigate("/dashboard");
            } else {
                toast.error(data?.message || "Login failed");
            }
        } catch (error) {
            console.error("Login error:", error);
            let errorMessage = "Login failed. Please try again.";
            
            if (error.response) {
                if (error.response.status === 401) {
                    errorMessage = "Invalid email or password";
                } else if (error.response.status === 404) {
                    errorMessage = "Service unavailable. Please try again later.";
                    console.error("Endpoint not found:", error.config.url);
                } else {
                    errorMessage = error.response.data?.message || errorMessage;
                }
            } else if (error.message.includes("timeout")) {
                errorMessage = "Request timed out. Please check your connection.";
            }
            
            toast.error(errorMessage);
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <div className="min-h-screen bg-[#fafafa] flex justify-center overflow-hidden font-sans relative">
            {/* Background oceanic wave */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
                <svg className="relative block w-full h-[200px] md:h-[300px] lg:h-[400px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
                    <path fill="#e5e7eb8a" fillOpacity="1" d="M0,96 C480,-96 960,384 1440,128 L1440,320 L0,320 Z"></path>
                </svg>
            </div>

            <div className="flex w-full max-w-[1300px] z-10 relative">
                {/* Left Column: Form */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 lg:px-8 relative z-10">
                
                <div className="w-full max-w-[480px]">
                    {/* Logo Area */}
                    {/* <div className="mb-14 flex items-center justify-center lg:justify-start w-full">
                        <span className="text-3xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}>
                            Chintan - <span className="text-2xl text-gray-600 font-semibold uppercase tracking-widest mt-0.5 ml-1" style={{ fontFamily: "'Inter', sans-serif" }}>Thought of today</span>
                        </span>
                    </div> */}

                    {/* Heading */}
                    <div className="mb-8">
                        <h1 className="text-[36px] font-normal text-gray-800">
                            Login with <span className="text-[#C6102E] font-medium">Email</span>
                        </h1>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-5">
                        <TextField
                            fullWidth
                            label="Email"
                            variant="outlined"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#C6102E',
                                    },
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#C6102E',
                                },
                            }}
                        />

                        <TextField
                            fullWidth
                            label="Password"
                            variant="outlined"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#C6102E',
                                    },
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#C6102E',
                                },
                            }}
                        />

                        <div className="flex justify-end pt-1 pb-2">
                            <button 
                                type="button" 
                                onClick={() => {
                                    setOpenForgotModal(true);
                                    setForgotStep(1);
                                    setResetEmail(email);
                                }}
                                className="text-md underline text-[#C6102E] hover:underline font-medium focus:outline-none"
                            >
                                Forgot Password?
                            </button>
                        </div>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={isLoading}
                            sx={{
                                backgroundColor: '#C6102E',
                                color: 'white',
                                py: 1.5,
                                fontSize: '1rem',
                                textTransform: 'none',
                                '&:hover': {
                                    backgroundColor: 'black',
                                },
                                '&.Mui-disabled': {
                                    backgroundColor: '#C6102E',
                                    color: 'white',
                                    opacity: 0.7,
                                }
                            }}
                        >
                            {isLoading ? "Signing In..." : "Sign In"}
                        </Button>
                    </form>
                </div>
            </div>

            {/* Right Column: SVG Illustration */}
            <div className="hidden lg:flex w-1/2 justify-center items-center relative z-10 px-8">
                <div className="relative w-full max-w-[550px] aspect-square flex items-center justify-center">
                    <img src="/Tablet login-cuate.svg" alt="Login Illustration" className="w-full h-full object-contain drop-shadow-sm pointer-events-none" />
                </div>
            </div>
            </div>

            {/* Forgot Password Modal */}
            <Dialog open={openForgotModal} onClose={() => setOpenForgotModal(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold', color: '#2C2E43' }}>
                    {forgotStep === 1 ? 'Reset Password' : 'Verify OTP & Set Password'}
                </DialogTitle>
                <DialogContent>
                    {forgotStep === 1 ? (
                        <div className="mt-2 space-y-4">
                            <p className="text-sm text-gray-600 mb-4">Enter your registered email address. We'll send you an OTP to reset your password.</p>
                            <TextField
                                fullWidth
                                label="Email Address"
                                variant="outlined"
                                type="email"
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                                sx={{
                                    '& .MuiOutlinedInput-root.Mui-focused fieldset': { borderColor: '#C6102E' },
                                    '& .MuiInputLabel-root.Mui-focused': { color: '#C6102E' }
                                }}
                            />
                        </div>
                    ) : (
                        <div className="mt-2 space-y-4">
                            <p className="text-sm text-gray-600 mb-4">Enter the OTP sent to {resetEmail} and your new password.</p>
                            <TextField
                                fullWidth
                                label="OTP"
                                variant="outlined"
                                value={resetOtp}
                                onChange={(e) => setResetOtp(e.target.value)}
                                sx={{
                                    '& .MuiOutlinedInput-root.Mui-focused fieldset': { borderColor: '#C6102E' },
                                    '& .MuiInputLabel-root.Mui-focused': { color: '#C6102E' }
                                }}
                            />
                            <TextField
                                fullWidth
                                label="New Password"
                                variant="outlined"
                                type={showPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root.Mui-focused fieldset': { borderColor: '#C6102E' },
                                    '& .MuiInputLabel-root.Mui-focused': { color: '#C6102E' }
                                }}
                            />
                        </div>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 0 }}>
                    <Button 
                        onClick={() => setOpenForgotModal(false)} 
                        sx={{ color: '#666' }}
                        disabled={isResetting}
                    >
                        Cancel
                    </Button>
                    {forgotStep === 1 ? (
                        <Button
                            variant="contained"
                            disabled={!resetEmail || isResetting}
                            onClick={async () => {
                                setIsResetting(true);
                                const resultAction = await dispatch(sendResetOTP(resetEmail));
                                if (sendResetOTP.fulfilled.match(resultAction)) {
                                    setForgotStep(2);
                                }
                                setIsResetting(false);
                            }}
                            sx={{ bgcolor: '#C6102E', '&:hover': { bgcolor: 'black' } }}
                        >
                            {isResetting ? "Sending..." : "Send OTP"}
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            disabled={!resetOtp || !newPassword || isResetting}
                            onClick={async () => {
                                setIsResetting(true);
                                const resultAction = await dispatch(resetPassword({ email: resetEmail, otp: resetOtp, newPassword }));
                                if (resetPassword.fulfilled.match(resultAction)) {
                                    setOpenForgotModal(false);
                                    setResetOtp("");
                                    setNewPassword("");
                                    setForgotStep(1);
                                }
                                setIsResetting(false);
                            }}
                            sx={{ bgcolor: '#C6102E', '&:hover': { bgcolor: 'black' } }}
                        >
                            {isResetting ? "Resetting..." : "Reset Password"}
                        </Button>
                    )}
                </DialogActions>
            </Dialog>

        </div>
    );
};

export default AdminHomePage;