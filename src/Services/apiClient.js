import axios from "axios"

const apiClient = axios.create({
  baseURL: "https://vaxchain-theta.vercel.app/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
})

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authTokens")
    if (token) {
      const authTokens = JSON.parse(token)
      config.headers.Authorization = `JWT ${authTokens.access}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default apiClient