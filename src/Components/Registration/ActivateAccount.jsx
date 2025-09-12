"use client"

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { FaCheckCircle, FaExclamationTriangle, FaShieldAlt, FaSpinner, FaArrowRight, FaHome } from "react-icons/fa"
import apiClient from "../../Services/apiClient"


const ActivateAccount = () => {
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const { uid, token } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    setIsLoading(true)

    apiClient
      .post("/auth/users/activation/", { uid, token })
      .then(() => {
        setMessage("Account activated successfully")
        setError("")
        setIsLoading(false)
        setTimeout(() => navigate("/login"), 5000)
      })
      .catch((error) => {
        const errorMsg = error.response?.data?.detail || "Something went wrong. Please check your activation link"
        setError(errorMsg)
        setMessage("")
        setIsLoading(false)
      })
  }, [uid, token, navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-blue-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-teal-200/30 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-cyan-200/30 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-blue-200/30 rounded-full blur-lg"></div>
      </div>

      <div className="relative w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-600 rounded-full mb-4">
            <FaShieldAlt className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">VaxChain</h1>
          <p className="text-slate-600">Secure Vaccination Management Platform</p>
        </div>

        <div className="shadow-xl border-0 bg-white/80 backdrop-blur-sm rounded-lg p-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-slate-800 mb-6">Account Activation</h2>

            {isLoading && (
              <div className="flex flex-col items-center justify-center py-8">
                <FaSpinner className="w-12 h-12 text-teal-600 animate-spin mb-4" />
                <p className="text-slate-600">Activating your account...</p>
              </div>
            )}

            {message && !isLoading && (
              <div className="space-y-6">
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <FaCheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-green-800 mb-2">Success!</h3>
                  <p className="text-green-700 text-center">{message}</p>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700 text-center">
                    You will be redirected to the login page in 5 seconds...
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => navigate("/login")}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Sign In Now
                    <FaArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {error && !isLoading && (
              <div className="space-y-6">
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <FaExclamationTriangle className="w-10 h-10 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-red-800 mb-2">Activation Failed</h3>
                  <p className="text-red-700 text-center">{error}</p>
                </div>

                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700 text-center">
                    Please check your activation link or contact support if the problem persists.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => navigate("/signup")}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Try Again
                    <FaArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ActivateAccount
