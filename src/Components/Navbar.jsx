import { useState, useEffect } from "react";
import {
  ChevronDown,
  User,
  LogOut,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  Shield,
  Users,
  FileText,
  Grid,
  PieChart,
  Sliders,
  Home,
  HelpCircle,
  Globe,
  ShieldCheck,
} from "lucide-react";

import { useAppContext } from "../Context/AppContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const AdminNavbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);

  const { userData, logout, backendURL, sendVerificationOTP, verifyEmail } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  // Admin navigation items with icons
  const adminNavItems = [
    { name: "Dashboard", icon: Home, badge: null, path: "/dashboard" },
    {
      name: "Articles",
      icon: FileText,
      badge: "12",
      path: "/dashboard/articles",
    },
    {
      name: "Categories",
      icon: Grid,
      badge: null,
      path: "/dashboard/categories",
    },
    { name: "Users", icon: Users, badge: "3", path: "/dashboard/users" },
    // {
    //   name: "Analytics",
    //   icon: PieChart,
    //   badge: null,
    //   path: "/dashboard/analytics",
    // },
    // {
    //   name: "Settings",
    //   icon: Sliders,
    //   badge: null,
    //   path: "/dashboard/settings",
    // },
  ];

  const adminName = userData?.name || "Admin";
  const adminRole = userData?.role || "Administrator";

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Format time for display
  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileOpen && !event.target.closest(".profile-dropdown")) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isProfileOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      toast.error("Failed to logout");
      console.error("Logout error:", error);
    }
  };

  const handleVerifyEmail = async () => {
    try {
      const { data } = await axios.post(
        `${backendURL}/api/auth/send-verification`,
        {},
        { withCredentials: true }
      );
      if (data.success) {
        toast.success(data.message || "Verification email sent!");
      } else {
        toast.error(data.message || "Failed to send verification email.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send verification email."
      );
      console.error("Verification error:", error);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`bg-white shadow-lg border-b-4 border-red-800 sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "shadow-xl" : ""
      }`}
    >
      {/* Main Navbar */}
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Admin Panel Title */}
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 flex items-center space-x-3">
              <div className="bg-gradient-to-br from-red-800 to-red-600 text-white p-2 rounded-lg shadow-md transform transition-transform hover:scale-105">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
                <p className="text-xs text-gray-500">News Portal Management</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {adminNavItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`${
                  isActive(item.path)
                    ? "text-red-800 bg-red-50 border-b-2 border-red-800"
                    : "text-gray-700 hover:text-red-800 hover:bg-red-50"
                } px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out flex items-center space-x-2 group relative`}
              >
                <span className="flex items-center space-x-2">
                  {item.icon && (
                    <item.icon
                      className={`h-4 w-4 ${
                        isActive(item.path)
                          ? "text-red-800"
                          : "group-hover:scale-110 transition-transform"
                      }`}
                    />
                  )}
                  <span>{item.name}</span>
                </span>

                {item.badge && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium animate-pulse">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Right Section - Search, Notifications, Profile */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden sm:block relative transition-all duration-300 w-48">
              <input
                type="text"
                placeholder="Search..."
                className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-0 focus:border-red-800 transition-all duration-200 w-full"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>

            {/* Notifications */}
            <div className="relative">
              <button className="text-gray-500 hover:text-red-800 transition-colors duration-200 relative p-2 rounded-lg hover:bg-red-50 group focus:outline-none">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium group-hover:animate-bounce">
                  12
                </span>
              </button>
            </div>

            {/* Profile Dropdown */}
            <div className="relative profile-dropdown">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 text-gray-700 hover:text-red-800 transition-colors duration-200 focus:outline-none rounded-lg p-2 hover:bg-red-50"
                aria-expanded={isProfileOpen}
                aria-haspopup="true"
              >
                <div className="flex items-center space-x-2">
                  <div className="bg-gradient-to-r from-red-800 to-red-600 text-white rounded-full p-2 shadow-md">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-gray-900 mr-2">
                        {adminName}
                      </p>
                      {userData?.isAccountVerified ? (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full flex items-center">
                          <ShieldCheck className="h-3 w-3 mr-1" />
                          Verified
                        </span>
                      ) : (
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full flex items-center">
                          <ShieldCheck className="h-3 w-3 mr-1" />
                          Unverified
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{adminRole}</p>
                  </div>
                </div>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-300 ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-10 transform origin-top-right transition-all duration-200 animate-fadeIn">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {adminName}
                    </p>
                    <p className="text-xs text-gray-500">{adminRole}</p>
                    <div className="flex items-center mt-1">
                      <span className="h-2 w-2 bg-green-500 rounded-full mr-1"></span>
                      <p className="text-xs text-green-600">Online</p>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-1"></div>
                  {/* Show Verify Email only if not verified */}
                  {userData?.isAccountVerified === false && (
                    <div className="border-t border-gray-100 pt-1">
                      {!showOtpInput ? (
                        <button
                          onClick={async () => {
                            const sent = await sendVerificationOTP();
                            if (sent) setShowOtpInput(true);
                          }}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 transition-colors duration-200 flex items-center space-x-3 group"
                        >
                          <ShieldCheck className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          <span>Verify Email</span>
                        </button>
                      ) : (
                        <div className="flex flex-col px-4 py-2 space-y-2">
                          <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Enter OTP"
                            maxLength={6}
                            className="border rounded px-2 py-1 text-sm"
                          />
                          <button
                            onClick={async () => {
                              const verified = await verifyEmail(otp);
                              if (verified) setShowOtpInput(false);
                            }}
                            className="bg-red-800 text-white rounded px-2 py-1 text-sm hover:bg-red-700"
                          >
                            Verify Email
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="border-t border-gray-100 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center space-x-3 group"
                    >
                      <LogOut className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-gray-500 hover:text-red-800 transition-colors duration-200 p-2 rounded-lg hover:bg-red-50 focus:outline-none"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 pt-4 pb-3 space-y-2">
            {/* Mobile Search */}
            <div className="mb-4 relative">
              <input
                type="text"
                placeholder="Search admin panel..."
                className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 pl-10 text-sm focus:outline-none focus:border-red-800 focus:ring-0"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>

            {adminNavItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`${
                  isActive(item.path)
                    ? "text-red-800 bg-red-50 border-l-4 border-red-800"
                    : "text-gray-700 hover:text-red-800 hover:bg-red-50"
                } block px-3 py-3 rounded-lg text-base font-medium transition-all duration-200 flex items-center justify-between`}
              >
                <span className="flex items-center space-x-3">
                  {item.icon && (
                    <item.icon
                      className={`h-5 w-5 ${
                        isActive(item.path) ? "text-red-800" : ""
                      }`}
                    />
                  )}
                  <span>{item.name}</span>
                </span>

                {item.badge && (
                  <span className="bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}

            {/* Quick Actions in Mobile Menu */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                Quick Actions
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg hover:bg-red-50 transition-colors focus:outline-none">
                  <Bell className="h-5 w-5 text-gray-700" />
                  <span className="text-xs mt-1">Alerts</span>
                </button>
                <button className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg hover:bg-red-50 transition-colors focus:outline-none">
                  <Settings className="h-5 w-5 text-gray-700" />
                  <span className="text-xs mt-1">Settings</span>
                </button>
                <button className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg hover:bg-red-50 transition-colors focus:outline-none">
                  <HelpCircle className="h-5 w-5 text-gray-700" />
                  <span className="text-xs mt-1">Help</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Status Bar */}
      <div className="bg-gradient-to-r from-red-800 to-red-600 text-white py-2">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center">
                <span className="h-2 w-2 bg-white rounded-full mr-1 animate-pulse"></span>
                LIVE
              </span>
              <span className="hidden sm:inline">
                System Status: All services running normally
              </span>
              <span className="sm:hidden">All systems normal</span>
            </div>
            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center">
                <Globe className="h-3 w-3 mr-1" />
                <span>{formattedTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
