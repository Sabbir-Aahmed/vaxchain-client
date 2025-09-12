
import { useState } from "react"
import { useForm } from "react-hook-form"
import { FaEnvelope, FaShieldAlt, FaCheckCircle, FaExclamationTriangle, FaArrowLeft } from "react-icons/fa"
import useAuth from "../../Hooks/useAuth"
import { Link } from "react-router"


const ForgotPassword = () => {
  const { forgotPassword, errorMsg } = useAuth()
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()

  const onSubmit = async (data) => {
    setIsLoading(true)
    const response = await forgotPassword(data)
    if (response.success) {
      setMessage(response.message)
      reset()
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
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
          {message && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
              <FaCheckCircle className="text-green-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-green-800 font-medium">Email Sent!</p>
                <p className="text-green-700 text-sm mt-1">{message}</p>
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
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Forgot Your Password?</h2>
            <p className="text-gray-600">
              Enter your registered email address and we'll send you a link to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  type="email"
                  placeholder="Enter your registered email"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors ${
                    errors.email ? "border-red-300 bg-red-50" : "border-gray-300 bg-gray-50"
                  }`}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Please enter a valid email address",
                    },
                  })}
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <FaExclamationTriangle className="mr-1" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white py-3 px-4 rounded-lg font-medium hover:from-cyan-600 hover:to-teal-700 focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Sending Reset Link...
                </>
              ) : (
                <>
                  <FaEnvelope className="mr-2" />
                  Send Reset Link
                </>
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link to={'/login'} className="text-cyan-600 hover:text-cyan-700 font-medium flex items-center justify-center mx-auto transition-colors">
              <FaArrowLeft className="mr-2" />
              Back to Login
            </Link>
          </div>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 text-center">
              For security reasons, we'll send the reset link only if the email is registered in our system.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
