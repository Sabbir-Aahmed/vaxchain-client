"use client"

import { useState } from "react"
import { FaLock, FaEye, FaEyeSlash, FaShieldAlt, FaSpinner } from "react-icons/fa"
import useAuth from "../../Hooks/useAuth"
import { Link } from "react-router"


export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [errors, setErrors] = useState({})

  const { loginUser, errorMsg, user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = "Invalid email address"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)

    try {
      const result = await loginUser({
        email: formData.email,
        password: formData.password,
      })

      if (result.success) {
        console.log("Login successful!", user)
        // You can add navigation logic here, e.g., router.push('/dashboard')
      }
    } catch (error) {
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-blue-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-teal-200/30 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-cyan-200/30 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-blue-200/30 rounded-full blur-lg"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full mb-4">
            <FaShieldAlt className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">VaxChain</h1>
          <p className="text-slate-600">Secure Vaccination Management Platform</p>
        </div>

        <div className="shadow-xl border-0 bg-white/80 backdrop-blur-sm rounded-lg">
          <div className="space-y-1 pb-6 p-6">
            <h2 className="text-2xl font-semibold text-center text-slate-800">Welcome Back</h2>
            <p className="text-center text-slate-600">Sign in to access your vaccination dashboard</p>
          </div>

          <div className="px-6 pb-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{errorMsg}</p>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-slate-700 font-medium mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="w-full h-11 px-3 bg-white border border-slate-200 rounded-md focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none transition-colors"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-slate-700 font-medium mb-2 flex items-center gap-2">
                  <FaLock className="w-3 h-3" />
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="w-full h-11 px-3 pr-10 bg-white border border-slate-200 rounded-md focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500 focus:ring-2"
                  />
                  <label htmlFor="rememberMe" className="text-sm text-slate-600 cursor-pointer">
                    Remember me
                  </label>
                </div>

                <button
                  type="button"
                  className="text-sm text-teal-600 hover:text-teal-500 transition-colors font-medium"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-teal-600 hover:to-cyan-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center ">
                    <FaSpinner className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>


              <div className="text-center space-y-4">
                <Link to="/register">
                  <button
                    type="button"
                    className="text-teal-600 hover:text-teal-500 transition-colors font-medium"
                  >
                    Create an account
                  </button>
                </Link>

                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <span className="relative px-4 bg-white text-slate-500 text-sm cursor-pointer">
                    <Link to="/forgot-password">Forgot Password?</Link>
                  </span>
                </div>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
