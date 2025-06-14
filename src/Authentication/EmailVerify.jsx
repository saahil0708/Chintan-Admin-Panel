import React, { useState, useRef, useEffect } from 'react';
import { Mail, ArrowLeft, RefreshCw, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../Context/AppContext';
import { toast } from 'react-toastify';

export default function EmailVerificationOTP() {
  const { userData, verifyEmail, sendVerificationOTP } = useAppContext();
  const navigate = useNavigate();
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const inputRefs = useRef([]);

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return;
    
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input if current input has value
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const newOtp = [...otp];
    
    for (let i = 0; i < pastedData.length && i < 6; i++) {
      if (/^\d$/.test(pastedData[i])) {
        newOtp[i] = pastedData[i];
      }
    }
    
    setOtp(newOtp);
    const lastFilledIndex = Math.min(pastedData.length - 1, 5);
    inputRefs.current[lastFilledIndex]?.focus();
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast.error("Please enter a complete 6-digit code");
      return;
    }
    
    setIsVerifying(true);
    try {
      const verified = await verifyEmail(otpString);
      if (verified) {
        toast.success("Email verified successfully!");
        navigate('/dashboard');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      const sent = await sendVerificationOTP();
      if (sent) {
        toast.success("New verification code sent to your email");
        setTimeLeft(120);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } finally {
      setIsResending(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isComplete = otp.every(digit => digit !== '');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <ShieldCheck className="w-8 h-8 text-red-800" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Verify Your Email
            </h1>
            <p className="text-gray-600 text-sm">
              We've sent a 6-digit verification code to
            </p>
            <p className="text-red-800 font-medium mt-1">
              {userData?.email || 'your email'}
            </p>
          </div>

          {/* OTP Input */}
          <div className="mb-8">
            <div className="flex justify-center gap-3 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={el => inputRefs.current[index] = el}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  onFocus={(e) => e.target.select()}
                  className={`w-12 h-12 text-center text-xl font-bold border-2 rounded-lg focus:ring-2 focus:ring-opacity-20 outline-none transition-all
                    ${digit ? 'border-red-800 focus:border-red-800 focus:ring-red-800' : 'border-gray-300 focus:border-gray-400 focus:ring-gray-400'}
                  `}
                />
              ))}
            </div>

            {/* Timer */}
            <div className="text-center mb-6">
              {timeLeft > 0 ? (
                <p className="text-gray-600 text-sm">
                  Code expires in{' '}
                  <span className="font-medium text-red-800">
                    {formatTime(timeLeft)}
                  </span>
                </p>
              ) : (
                <p className="text-gray-500 text-sm">
                  Your code has expired
                </p>
              )}
            </div>

            {/* Verify Button */}
            <button
              onClick={handleVerify}
              disabled={!isComplete || isVerifying}
              className={`w-full bg-red-800 text-white py-3 px-4 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-red-800 focus:ring-opacity-50 transition-all
                ${(!isComplete || isVerifying) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-900'}
              `}
            >
              {isVerifying ? (
                <div className="flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Verifying...
                </div>
              ) : (
                'Verify Email'
              )}
            </button>
          </div>

          {/* Resend Section */}
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-3">
              Didn't receive the code?
            </p>
            <button
              onClick={handleResend}
              disabled={timeLeft > 0 || isResending}
              className={`text-red-800 font-medium focus:outline-none transition-colors
                ${(timeLeft > 0 || isResending) ? 'opacity-50 cursor-not-allowed' : 'hover:text-red-900'}
              `}
            >
              {isResending ? (
                <span className="flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Sending...
                </span>
              ) : (
                'Resend Code'
              )}
            </button>
          </div>

          {/* Back Link */}
          <div className="mt-8 text-center">
            <button 
              onClick={() => navigate(-1)}
              className="text-gray-500 hover:text-gray-700 flex items-center justify-center gap-2 mx-auto transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to previous page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}