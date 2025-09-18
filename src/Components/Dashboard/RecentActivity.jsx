import { useEffect, useState } from "react"
import { FaCalendarAlt, FaSyringe } from "react-icons/fa"
import apiClient from "../../Services/apiClient"

const RecentActivity = () => {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const [bookingsRes, campaignsRes] = await Promise.all([
          apiClient.get("/bookings/?ordering=-created_at&limit=5"),
          apiClient.get("/campaigns/?ordering=-created_at&limit=5"),
        ])

        const recentBookings = (bookingsRes.data.results || []).map(b => ({
          id: `booking-${b.id}`,
          type: "booking",
          name: `Booking confirmed`,
          description: `${b.patient_name} booked ${b.campaign_name}`,
          time: new Date(b.created_at).toLocaleString(),
          icon: FaCalendarAlt,
          color: "text-blue-600",
          bgColor: "bg-blue-50"
        }))

        const recentCampaigns = (campaignsRes.data.results || []).map(c => ({
          id: `campaign-${c.id}`,
          type: "campaign",
          name: `Campaign launched`,
          description: `${c.name} is now active`,
          time: new Date(c.created_at).toLocaleString(),
          icon: FaSyringe,
          color: "text-green-600",
          bgColor: "bg-green-50"
        }))

        setActivities(
          [...recentBookings, ...recentCampaigns]
            .sort((a, b) => new Date(b.time) - new Date(a.time))
            .slice(0, 5)
        )
      } catch (err) {
        console.error("Failed to fetch activities", err)
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [])

  if (loading) {
    return <p className="text-gray-600 text-center">Loading recent activities...</p>
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon
          return (
            <div
              key={activity.id}
              className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200"
            >
              {/* Icon */}
              <div className={`w-10 h-10 rounded-xl ${activity.bgColor} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-4 h-4 ${activity.color}`} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">{activity.name}</h3>
                <p className="text-sm text-gray-600 mb-1">{activity.description}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default RecentActivity
