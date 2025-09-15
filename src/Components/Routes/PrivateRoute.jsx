
import { useEffect, useState } from "react"
import { Navigate } from "react-router"
import { FaSpinner } from "react-icons/fa"
import useAuth from "../../Hooks/useAuth"


const PrivateRoute = ({ children }) => {
  const { user, authTokens, fetchUserProfile } = useAuth()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      if (authTokens && !user) {
        await fetchUserProfile()
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [authTokens, user, fetchUserProfile])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-teal-500 w-8 h-8 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Verifying authentication...</p>
        </div>
      </div>
    )
  }

  if (!authTokens || !user) {
    return <Navigate to="/login" replace />
  }

  // Render protected content if authenticated
  return children
}

export default PrivateRoute
