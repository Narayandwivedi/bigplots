import React, { useState, useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import GoogleLogin from '../components/GoogleLogin'

const Login = () => {
  const { login, signup, BACKEND_URL } = useContext(AppContext)
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [otpSent, setOtpSent] = useState(false)

  // Emerald Tech Logo Component
  const EmeraldTechLogo = () => (
    <svg width="56" height="56" viewBox="0 0 56 56" className="filter drop-shadow-2xl">
      <defs>
        {/* Emerald Tech Gradient */}
        <linearGradient id="emeraldGradientLogin" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="1" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="1" />
        </linearGradient>
        
        {/* Glow Effect */}
        <filter id="emeraldGlowLogin">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Outer diamond */}
      <path d="M28,8 L40,20 L28,48 L16,20 Z" 
        stroke="url(#emeraldGradientLogin)" 
        strokeWidth="2" 
        fill="none" 
        opacity="0.9"
        filter="url(#emeraldGlowLogin)"
        transform="scale(1.05)"
        transformOrigin="28 28" />
      
      {/* Inner diamond fill */}
      <path d="M28,12 L36,20 L28,40 L20,20 Z" 
        fill="url(#emeraldGradientLogin)" 
        opacity="0.3"
        transform="scale(1.05)"
        transformOrigin="28 28" />
      
      {/* Center section */}
      <path d="M20,20 L36,20 L32,28 L24,28 Z" 
        fill="url(#emeraldGradientLogin)" 
        opacity="0.7"
        transform="scale(1.05)"
        transformOrigin="28 28" />
      
      {/* Gaming controller in center */}
      <g transform="translate(28, 24) scale(1.05)">
        <rect x="-6" y="-2" width="12" height="4" rx="2" 
          fill="#fff" 
          opacity="0.9"/>
        <rect x="-4" y="-0.5" width="2" height="1" 
          fill="#10b981"/>
        <rect x="2" y="-0.5" width="2" height="1" 
          fill="#3b82f6"/>
        <circle cx="-3" cy="0" r="0.5" fill="#10b981" opacity="0.8"/>
        <circle cx="3" cy="0" r="0.5" fill="#3b82f6" opacity="0.8"/>
      </g>
      
      {/* Sparkle effects */}
      <circle cx="28" cy="20" r="1" fill="#fff" opacity="0.8" transform="scale(1.05)" transformOrigin="28 28" />
      <circle cx="20" cy="20" r="0.8" fill="#10b981" opacity="0.6" transform="scale(1.05)" transformOrigin="28 28" />
      <circle cx="36" cy="20" r="0.8" fill="#3b82f6" opacity="0.6" transform="scale(1.05)" transformOrigin="28 28" />
      
      {/* Tech lines */}
      <path d="M28,12 L28,8 M20,20 L16,20 M36,20 L40,20" 
        stroke="url(#emeraldGradientLogin)" 
        strokeWidth="1" 
        opacity="0.8"
        transform="scale(1.05)"
        transformOrigin="28 28" />
    </svg>
  )

  // Login form state
  const [loginData, setLoginData] = useState({
    emailOrMobile: '',
    password: ''
  })

  // Signup form state
  const [signupData, setSignupData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  })

  // Forgot password state
  const [forgotData, setForgotData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmNewPassword: ''
  })

  const [errors, setErrors] = useState({})

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      const result = await login(loginData)
      
      if (result.success) {
        navigate('/')
      } else {
        setErrors({
          login: result.error
        })
      }
    } catch (error) {
      setErrors({
        login: 'Login failed'
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle signup
  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    // Validate passwords match
    if (signupData.password !== signupData.confirmPassword) {
      setErrors({ signup: 'Passwords do not match' })
      setLoading(false)
      return
    }

    try {
      const { confirmPassword, ...submitData } = signupData
      const result = await signup(submitData)
      
      if (result.success) {
        navigate('/')
      } else {
        setErrors({
          signup: result.error
        })
      }
    } catch (error) {
      setErrors({
        signup: 'Signup failed'
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle forgot password - send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/forgot-password`, {
        email: forgotData.email
      })
      
      if (response.data.success) {
        setOtpSent(true)
      }
    } catch (error) {
      setErrors({
        forgot: error.response?.data?.message || 'Failed to send OTP'
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle reset password
  const handleResetPassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    // Validate passwords match
    if (forgotData.newPassword !== forgotData.confirmNewPassword) {
      setErrors({ forgot: 'Passwords do not match' })
      setLoading(false)
      return
    }

    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/reset-password`, {
        email: forgotData.email,
        otp: forgotData.otp,
        newPass: forgotData.newPassword
      })
      
      if (response.data.success) {
        setShowForgotPassword(false)
        setOtpSent(false)
        setForgotData({ email: '', otp: '', newPassword: '', confirmNewPassword: '' })
        // Navigate to login form
        setIsLogin(true)
      }
    } catch (error) {
      setErrors({
        forgot: error.response?.data?.message || 'Password reset failed'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className={`bg-gradient-to-br from-gray-900 via-gray-800 to-black ${isLogin && !showForgotPassword ? 'h-screen' : 'min-h-screen'} max-w-md mx-auto relative overflow-hidden`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-16 left-8 w-32 h-32 bg-cyan-300 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-6 w-24 h-24 bg-cyan-300 rounded-full blur-2xl"></div>
        <div className="absolute bottom-32 left-6 w-20 h-20 bg-cyan-300 rounded-full blur-2xl"></div>
        <div className="absolute bottom-16 right-10 w-28 h-28 bg-cyan-300 rounded-full blur-3xl"></div>
      </div>

      {/* Header with Logo */}
      <div className={`${isLogin && !showForgotPassword ? 'pt-12 pb-6' : 'pt-16 pb-8'} px-6 text-center relative z-10`}>
        <div className="mb-6">
          <div className="flex items-center justify-center space-x-0.5 mb-3">
            <div className="relative">
              <EmeraldTechLogo />
            </div>
            <div className="flex flex-col items-start">
              <div className="flex items-center">
                <span className="text-3xl font-black text-white tracking-tight">GC</span>
                <span className="text-3xl font-black text-white ml-1 tracking-tight">HUB</span>
                <span className="text-lg font-medium text-gray-300 ml-1 -mb-1">.in</span>
              </div>
              <span className="text-[10px] text-gray-400 font-medium tracking-widest uppercase -mt-1">
                Gamers & Creators
              </span>
            </div>
          </div>
          <p className="text-white text-opacity-80 text-base font-medium">
            {showForgotPassword ? 'Reset Your Password' : (isLogin ? 'Welcome Back!' : 'Join Us Today')}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className={`bg-white mx-3 rounded-t-[2rem] relative z-10 shadow-2xl ${isLogin && !showForgotPassword ? 'flex-1 overflow-hidden' : 'min-h-[65vh]'}`}>
        <div className={`px-6 ${isLogin && !showForgotPassword ? 'pt-8 pb-6' : 'pt-10 pb-8'} ${!isLogin ? 'max-h-[calc(100vh-200px)] overflow-y-auto' : ''}`}>
        {!showForgotPassword ? (
          <>
            {/* Google Sign-in at Top */}
            <div className={`w-full flex justify-center ${isLogin && !showForgotPassword ? 'mb-6' : 'mb-10'}`}>
              <GoogleLogin />
            </div>

            {/* Divider */}
            <div className={`relative ${isLogin && !showForgotPassword ? 'mb-6' : 'mb-8'}`}>
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-400 font-medium">OR</span>
              </div>
            </div>

            {/* Login/Signup Toggle */}
            <div className={`flex bg-gray-50 rounded-2xl p-1.5 ${isLogin && !showForgotPassword ? 'mb-6' : 'mb-8'} shadow-inner`}>
              <button
                className={`flex-1 py-3.5 px-4 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  isLogin ? 'bg-cyan-400 text-white shadow-lg transform scale-[1.02]' : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setIsLogin(true)}
              >
                Login
              </button>
              <button
                className={`flex-1 py-3.5 px-4 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  !isLogin ? 'bg-cyan-400 text-white shadow-lg transform scale-[1.02]' : 'text-gray-500 hover:text-gray-700'  
                }`}
                onClick={() => setIsLogin(false)}
              >
                Sign Up
              </button>
            </div>

            {isLogin ? (
              /* Login Form */
              <form onSubmit={handleLogin} className={`${isLogin && !showForgotPassword ? 'space-y-3' : 'space-y-4'}`}>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Email or Mobile Number
                  </label>
                  <input
                    type="text"
                    value={loginData.emailOrMobile}
                    onChange={(e) => setLoginData({...loginData, emailOrMobile: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all text-gray-800 text-sm placeholder:text-xs"
                    placeholder="Email or mobile"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all text-gray-800 text-sm placeholder:text-xs"
                    placeholder="Password"
                    required
                  />
                </div>

                {errors.login && (
                  <div className="text-red-500 text-sm font-medium bg-red-50 px-4 py-2 rounded-xl">{errors.login}</div>
                )}

                <div className={`${isLogin && !showForgotPassword ? 'pt-1' : 'pt-2'}`}>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white ${isLogin && !showForgotPassword ? 'py-3' : 'py-4'} px-6 rounded-2xl font-semibold hover:from-gray-900 hover:to-black disabled:from-gray-400 disabled:to-gray-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none`}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Logging in...
                      </div>
                    ) : 'Login'}
                  </button>
                </div>

                <div className={`text-center ${isLogin && !showForgotPassword ? 'pt-2' : 'pt-4'}`}>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-cyan-600 text-sm hover:text-cyan-700 font-semibold hover:underline transition-colors cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
              </form>
            ) : (
              /* Signup Form */
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={signupData.fullName}
                    onChange={(e) => setSignupData({...signupData, fullName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all text-gray-800 text-sm placeholder:text-xs"
                    placeholder="Full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={signupData.email}
                    onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all text-gray-800 text-sm placeholder:text-xs"
                    placeholder="Email"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Mobile Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={signupData.mobile}
                    onChange={(e) => setSignupData({...signupData, mobile: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all text-gray-800 text-sm placeholder:text-xs"
                    placeholder="Mobile number (optional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={signupData.password}
                    onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all text-gray-800 text-sm placeholder:text-xs"
                    placeholder="Password"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={signupData.confirmPassword}
                    onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all text-gray-800 text-sm placeholder:text-xs"
                    placeholder="Confirm password"
                    required
                  />
                </div>


                {errors.signup && (
                  <div className="text-red-500 text-sm font-medium bg-red-50 px-4 py-2 rounded-xl">{errors.signup}</div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white py-4 px-6 rounded-2xl font-semibold hover:from-gray-900 hover:to-black disabled:from-gray-400 disabled:to-gray-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Signing up...
                      </div>
                    ) : 'Sign Up'}
                  </button>
                </div>
              </form>
            )}
          </>
        ) : (
          /* Forgot Password Form */
          <>
            {!otpSent ? (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={forgotData.email}
                    onChange={(e) => setForgotData({...forgotData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all text-gray-800 text-sm placeholder:text-xs"
                    placeholder="Email address"
                    required
                  />
                </div>

                {errors.forgot && (
                  <div className="text-red-500 text-sm font-medium bg-red-50 px-4 py-2 rounded-xl">{errors.forgot}</div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white py-4 px-6 rounded-2xl font-semibold hover:from-gray-900 hover:to-black disabled:from-gray-400 disabled:to-gray-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Sending OTP...
                      </div>
                    ) : 'Send OTP'}
                  </button>
                </div>

                <div className="text-center pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="text-gray-600 text-sm hover:text-gray-800 font-semibold hover:underline transition-colors"
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    OTP
                  </label>
                  <input
                    type="text"
                    value={forgotData.otp}
                    onChange={(e) => setForgotData({...forgotData, otp: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                    placeholder="Enter 6-digit OTP"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={forgotData.newPassword}
                    onChange={(e) => setForgotData({...forgotData, newPassword: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                    placeholder="Enter new password"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={forgotData.confirmNewPassword}
                    onChange={(e) => setForgotData({...forgotData, confirmNewPassword: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                    placeholder="Confirm new password"
                    required
                  />
                </div>

                {errors.forgot && (
                  <div className="text-red-500 text-sm">{errors.forgot}</div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gray-800 text-white py-3 px-4 rounded-xl font-medium hover:bg-gray-900 disabled:bg-gray-400 transition-colors shadow-lg"
                >
                  {loading ? 'Resetting Password...' : 'Reset Password'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setOtpSent(false)
                    setForgotData({...forgotData, otp: '', newPassword: '', confirmNewPassword: ''})
                  }}
                  className="w-full text-gray-600 text-sm hover:underline"
                >
                  Resend OTP
                </button>
              </form>
            )}
          </>
        )}
        </div>
      </div>
    </div>
    </>
  )
}

export default Login
