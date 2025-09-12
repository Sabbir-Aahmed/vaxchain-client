import axios from 'axios'

const apiClient = axios.create({
    baseURL: "https://vaxchain-theta.vercel.app/api/v1",
})

export default apiClient
