"use client"

import { useEffect, useState } from "react"
import { Navigation } from "swiper/modules"
import { SwiperSlide, Swiper } from "swiper/react"
import "swiper/css"
import "swiper/css/navigation"
import { FaSpinner, FaExclamationTriangle } from "react-icons/fa"
import CampaignCard from "./CampaignCard"
import apiClient from "../../Services/apiClient"
import { Link } from "react-router"


const CampaignSlider = () => {
  const [campaigns, setCampaigns] = useState([])
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    setLoading(true)
    apiClient
      .get("/campaigns/")
      .then((res) => setCampaigns(res.data.results || res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="bg-white py-16">
      <div className="px-4 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">Vaccination Campaigns</h2>
          </div>
          <Link to={'/campaigns'}>
            <button className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200">
              View All
            </button>
          </Link>
        </div>

        {/* Loading spinner */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <FaSpinner className="animate-spin text-teal-500 w-8 h-8 mx-auto mb-4" />
              <p className="text-slate-600">Loading vaccination campaigns...</p>
            </div>
          </div>
        )}

        {/* Error alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8 max-w-md mx-auto">
            <div className="flex items-center gap-3">
              <FaExclamationTriangle className="text-red-500 w-5 h-5" />
              <div>
                <p className="text-red-800 font-medium">Unable to load campaigns</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Campaigns slider */}
        {!isLoading && !error && campaigns.length > 0 && (
          <Swiper
            modules={[Navigation]}
            spaceBetween={20}
            slidesPerView={1}
            navigation
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="mt-4"
          >
            {campaigns.map((campaign) => (
              <SwiperSlide key={campaign.id} className="flex justify-center">
                <CampaignCard campaign={campaign} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        {!isLoading && !error && campaigns.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 max-w-md mx-auto">
              <p className="text-slate-800 font-medium mb-2">No campaigns available</p>
              <p className="text-slate-600">Check back later for new vaccination campaigns</p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default CampaignSlider
