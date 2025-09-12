
import { useState } from "react"
import { useForm } from "react-hook-form"
import { FaEnvelope, FaShieldAlt, FaSpinner, FaCheckCircle, FaExclamationTriangle, FaPaperPlane } from "react-icons/fa"
import useAuth from "../../Hooks/useAuth"


const ResendActivation = () => {
  const { resentActivation, errorMsg } = useAuth()
  const [successMsg, setSuccessMsg] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    setIsLoading(true)
    setSuccessMsg("")

    const response = await resentActivation({ email: data.email })

    if (response.success) {
      setSuccessMsg(response.message)
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* VaxChain Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full mb-4 shadow-lg">
            <FaShieldAlt className="text-white text-3xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">VaxChain</h1>
          <p className="text-gray-600 text-sm">Vaccination Management System</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-teal-100 rounded-full mb-4">
              <FaEnvelope className="text-teal-600 text-xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Resend Activation Email</h2>
            <p className="text-gray-600 text-sm">
              Didn't receive the activation email? Enter your email address and we'll send it again.
            </p>
          </div>

          {/* Success Message */}
          {successMsg && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
              <FaCheckCircle className="text-green-500 text-lg flex-shrink-0" />
              <p className="text-green-700 text-sm">{successMsg}</p>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
              <FaExclamationTriangle className="text-red-500 text-lg flex-shrink-0" />
              <p className="text-red-700 text-sm">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400 text-sm" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors ${
                    errors.email ? "border-red-300 bg-red-50" : "border-gray-300"
                  }`}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Please enter a valid email address",
                    },
                  })}
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                  <FaExclamationTriangle className="text-xs" />
                  <span>{errors.email.message}</span>
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white py-3 px-4 rounded-lg font-medium hover:from-teal-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <FaPaperPlane />
                  <span>Resend Activation Email</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ResendActivation
