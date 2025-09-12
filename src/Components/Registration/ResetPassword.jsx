"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { useParams, useNavigate } from "react-router"
import {FaSpinner, FaLock, FaShieldAlt, FaCheckCircle, FaExclamationTriangle, FaEye, FaEyeSlash } from "react-icons/fa"
import useAuth from "../../Hooks/useAuth"

const ResetPasswordPage = () => {
  const { uid, token } = useParams()
  const navigate = useNavigate()
  const { resetPassword, errorMsg } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const watchPassword = watch("new_password")

  const onSubmit = async (data) => {
    setIsLoading(true)
    const response = await resetPassword({
      uid,
      token,
      new_password: data.new_password,
    })

    if (response.success) {
      setSuccessMessage(response.message)
      setTimeout(() => {
        navigate("/login")
      }, 3000)
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md my-8">
        {/* VaxChain Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full mb-4">
            <FaShieldAlt className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">VaxChain</h1>
          <p className="text-slate-600">Secure Vaccination Management Platform</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
              <FaCheckCircle className="text-green-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-green-800 font-medium">Password Reset Successful!</p>
                <p className="text-green-700 text-sm mt-1">{successMessage}</p>
                <p className="text-green-600 text-xs mt-2">Redirecting to login page...</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <FaExclamationTriangle className="text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-red-800 font-medium">Error</p>
                <p className="text-red-700 text-sm mt-1">{errorMsg}</p>
              </div>
            </div>
          )}

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Reset Your Password</h2>
            <p className="text-gray-600">Please enter your new password below. Make sure it's strong and secure.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* New Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your new password"
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors ${
                    errors.new_password ? "border-red-300 bg-red-50" : "border-gray-300 bg-gray-50"
                  }`}
                  {...register("new_password", {
                    required: "New password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters long",
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message:
                        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
                    },
                  })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
                  ) : (
                    <FaEye className="text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.new_password && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <FaExclamationTriangle className="mr-1" />
                  {errors.new_password.message}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your new password"
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors ${
                    errors.confirm_password ? "border-red-300 bg-red-50" : "border-gray-300 bg-gray-50"
                  }`}
                  {...register("confirm_password", {
                    required: "Please confirm your password",
                    validate: (value) => value === watchPassword || "Passwords do not match",
                  })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
                  ) : (
                    <FaEye className="text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.confirm_password && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <FaExclamationTriangle className="mr-1" />
                  {errors.confirm_password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || successMessage}
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white py-3 px-4 rounded-lg font-medium hover:from-cyan-700 hover:to-teal-700 focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <div className="flex items-center justify-center ">
                    <FaSpinner className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    Updating Password...
                  </div>
              ) : (
                <>
                  <FaLock className="mr-2" />
                  Update Password
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 text-center">
              Your password should be at least 8 characters long and include uppercase, lowercase, and numeric
              characters for maximum security.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordPage
