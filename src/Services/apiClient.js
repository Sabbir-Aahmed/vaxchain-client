// import axios from 'axios'

// const apiClient = axios.create({
//     baseURL: "https://vaxchain-theta.vercel.app/api/v1",
// })

// export default apiClient

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

apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear storage and redirect to login
      localStorage.removeItem("authTokens")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

export default apiClient

