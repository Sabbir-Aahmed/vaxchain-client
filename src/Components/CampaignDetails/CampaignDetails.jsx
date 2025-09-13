"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router"
import { FaSpinner, FaInfoCircle, FaCalendarCheck } from "react-icons/fa"
import apiClient from "../../Services/apiClient"
import CampaignSchedule from "./CampaignsScedule"
import CampaignDetailsInfo from "./CampaignDetailsInfo"


const CampaignDetails = () => {
  const { id } = useParams()
  const [campaign, setCampaign] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [isBooking, setIsBooking] = useState(false)
  const [selectedSchedule, setSelectedSchedule] = useState(null)

  useEffect(() => {
    const fetchCampaignDetails = async () => {
      try {
        setIsLoading(true)
        const response = await apiClient.get(`/campaigns/${id}/`)
        setCampaign(response.data)
      } catch (err) {
        console.error("Error fetching campaign details:", err)
        setError("Failed to load campaign details")
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchCampaignDetails()
    }
  }, [id])

  const handleBooking = async () => {
    if (!selectedSchedule) {
      alert("Please select a schedule first")
      return
    }

    setIsBooking(true)
    try {
      const response = await apiClient.post(`/campaigns/${campaign.id}/booking/`, {
        first_dose_schedule_id: selectedSchedule.id,
      })
      console.log("Booking successful:", response.data)
      alert("Booking successful!")
    } catch (error) {
      console.error("Booking failed:", error)
      alert("Booking failed. Please try again.")
    } finally {
      setIsBooking(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-teal-500 w-8 h-8 mx-auto mb-4" />
          <p className="text-slate-600">Loading campaign details...</p>
        </div>
      </div>
    )
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-blue-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md mx-auto">
          <div className="text-center">
            <FaInfoCircle className="text-red-500 w-8 h-8 mx-auto mb-4" />
            <p className="text-red-800 font-medium mb-2">Campaign not found</p>
            <p className="text-red-600 text-sm">The requested campaign could not be loaded.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white py-12">
        <div className="max-w-7xl text-center mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{campaign.name}</h1>
          <p className="text-teal-100">{campaign.vaccine_type} Vaccination Campaign</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <img
                  src={campaign.campaign_image || "/placeholder.svg?height=400&width=600&query=vaccination campaign"}
                  alt={campaign.name}
                  className="w-full h-64 md:h-80 object-cover"
                />
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">{campaign.name}</h2>
                  <p className="text-teal-600 font-medium mb-4">{campaign.vaccine_type}</p>
                  
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Campaign Details */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <CampaignDetailsInfo campaign={campaign} />

              <CampaignSchedule
                schedules={campaign.schedules}
                selectedSchedule={selectedSchedule}
                onScheduleSelect={setSelectedSchedule}
              />

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <button
                  onClick={handleBooking}
                  disabled={isBooking || !selectedSchedule}
                  className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-teal-600 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {isBooking ? (
                    <>
                      <FaSpinner className="animate-spin w-5 h-5" />
                      Booking...
                    </>
                  ) : (
                    <>
                      <FaCalendarCheck className="w-5 h-5" />
                      Book Appointment
                    </>
                  )}
                </button>
                {!selectedSchedule && (
                  <p className="text-slate-500 text-sm text-center mt-2">
                    Please select a schedule to book your appointment
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CampaignDetails
