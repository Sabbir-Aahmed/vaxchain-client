import { FaCalendarAlt, FaUser, FaSyringe, FaDollarSign, FaClock } from "react-icons/fa"

const RecentActivity = () => {
  // Mock recent activities data
  const activities = [
    {
      id: 1,
      type: "booking",
      title: "New booking confirmed",
      description: "John Doe booked COVID-19 vaccination",
      time: "2 hours ago",
      icon: FaCalendarAlt,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      id: 2,
      type: "campaign",
      title: "Campaign launched",
      description: "Flu Vaccination Drive 2024 is now active",
      time: "4 hours ago",
      icon: FaSyringe,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      id: 3,
      type: "payment",
      title: "Payment received",
      description: "₹2,500 payment for premium vaccination package",
      time: "6 hours ago",
      icon: FaDollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      id: 4,
      type: "user",
      title: "New user registered",
      description: "Sarah Wilson joined as healthcare provider",
      time: "8 hours ago",
      icon: FaUser,
      color: "text-teal-600",
      bgColor: "bg-teal-50"
    },
    {
      id: 5,
      type: "booking",
      title: "Appointment reminder sent",
      description: "Reminder sent to 25 patients for tomorrow",
      time: "12 hours ago",
      icon: FaClock,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ]

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
        <button className="text-sm text-teal-600 hover:text-teal-700 font-medium hover:underline">
          View All
        </button>
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
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  {activity.title}
                </h3>
                <p className="text-sm text-gray-600 mb-1">
                  {activity.description}
                </p>
                <p className="text-xs text-gray-500">
                  {activity.time}
                </p>
              </div>

              {/* Action Button */}
              <button className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )
        })}
      </div>

      {/* Load More Button */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <button className="w-full text-center text-sm text-gray-600 hover:text-gray-900 font-medium py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
          Load More Activities
        </button>
      </div>
    </div>
  )
}

export default RecentActivity