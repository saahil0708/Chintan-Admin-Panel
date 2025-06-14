import { useState } from "react";
import { User, Shield, ChevronRight, Menu, X, Lock, Mail } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../Context/AppContext";  

const AdminHomePage = () => {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    
    const navigate = useNavigate();
    const { backendURL, login, isLoading, setIsLoading, getUserData } = useAppContext();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error("Please fill in all fields");
            return;
        }
        
        setIsLoading(true);
        
        try {
            const { data } = await axios.post(
                `${backendURL}/api/auth/login`,
                { email, password, rememberMe },
                { 
                    withCredentials: true, 
                    timeout: 10000,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (data?.success) {
                const user = await getUserData();
                if (user) {
                    login(user);
                    toast.success("Login successful");
                    navigate("/dashboard");
                } else {
                    throw new Error("Failed to fetch user data");
                }
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
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            {/* Navigation */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-3">
                            <div className="bg-red-800 p-2 rounded-lg">
                                <Shield className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-gray-800 text-xl font-bold">AdminPanel</span>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-6">
                            <button
                                onClick={() => setIsLoginOpen(true)}
                                className="bg-red-800 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-red-900 transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2"
                            >
                                <User className="h-4 w-4" />
                                <span>Login</span>
                            </button>
                        </div>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden text-gray-600 hover:text-gray-900 p-2"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200">
                        <div className="px-4 pt-2 pb-3 space-y-1">
                            <button
                                onClick={() => setIsLoginOpen(true)}
                                className="w-full text-left bg-red-800 text-white px-3 py-2.5 rounded-lg font-semibold hover:bg-red-900 transition-all mt-3 flex items-center space-x-2"
                            >
                                <User className="h-4 w-4" />
                                <span>Login</span>
                            </button>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[calc(100vh-4rem)]">
                <div className="text-center max-w-4xl">
                    <div className="mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-800 rounded-full mb-6">
                            <Shield className="h-10 w-10 text-white" />
                        </div>
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                        Welcome to the
                        <span className="block text-red-800">Admin Dashboard</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-4xl mx-auto leading-relaxed px-4">
                        Manage your system with powerful tools and comprehensive analytics. Your control center for seamless
                        administration and complete system oversight.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4">
                        <button
                            onClick={() => setIsLoginOpen(true)}
                            className="w-full sm:w-auto bg-red-800 text-white px-8 sm:px-10 py-4 rounded-xl font-semibold hover:bg-red-900 transition-all transform hover:scale-105 shadow-xl flex items-center justify-center space-x-3 text-lg group"
                        >
                            <User className="h-6 w-6 group-hover:rotate-12 transition-transform" />
                            <span>Access Dashboard</span>
                            <ChevronRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Login Modal */}
            {isLoginOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-md w-full mx-4 shadow-2xl border border-gray-100">
                        <div className="p-6 sm:p-8">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-red-800 p-2 rounded-lg">
                                        <Lock className="h-5 w-5 text-white" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">Admin Login</h2>
                                </div>
                                <button
                                    onClick={() => setIsLoginOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                                    aria-label="Close login modal"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <form className="space-y-6" onSubmit={handleLogin}>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="email"
                                            type="email"
                                            autoComplete="username"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-red-800 outline-none transition-colors"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="password"
                                            type="password"
                                            autoComplete="current-password"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-red-800 outline-none transition-colors"
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-300 text-red-800 focus:ring-red-800 h-4 w-4"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                        />
                                        <span className="ml-2 text-sm text-gray-600">Remember me</span>
                                    </label>
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            setIsLoginOpen(false);
                                            // You would navigate to a password reset page here
                                            toast.info("Password reset functionality coming soon");
                                        }}
                                        className="text-sm text-red-800 hover:text-red-900 font-medium"
                                    >
                                        Forgot password?
                                    </button>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`w-full bg-red-800 text-white py-3 rounded-lg font-semibold hover:bg-red-900 transition-all flex items-center justify-center space-x-2 group ${
                                        isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:scale-[1.02]'
                                    }`}
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>Signing In...</span>
                                        </>
                                    ) : (
                                        <>
                                            <User className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                                            <span>Sign In</span>
                                            <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminHomePage;