import { FaPlus, FaFileDownload, FaCalendarCheck, FaEnvelope, FaChartBar, FaCog } from "react-icons/fa"
import { Link } from "react-router"

const QuickActions = () => {
  const actions = [
    {
      id: 1,
      title: "Create Campaign",
      description: "Launch new vaccination drive",
      icon: FaPlus,
      color: "from-teal-500 to-cyan-500",
      href: "/dashboard/create/campaigns"
    },
    {
      id: 2,
      title: "Export Reports",
      description: "Download analytics data",
      icon: FaFileDownload,
      color: "from-blue-500 to-indigo-500",
      href: "/dashboard/reports"
    },
    {
      id: 3,
      title: "View All Bookings",
      description: "Manage bookings",
      icon: FaCalendarCheck,
      color: "from-green-500 to-emerald-500",
      href: "/dashboard/bookings"
    },
    {
      id: 4,
      title: "Send Notifications",
      description: "Alert patients & providers",
      icon: FaEnvelope,
      color: "from-purple-500 to-pink-500",
      href: "/dashboard/notifications"
    },
    {
      id: 5,
      title: "View Analytics",
      description: "Detailed performance metrics",
      icon: FaChartBar,
      color: "from-orange-500 to-red-500",
      href: "/dashboard/analytics"
    },
    {
      id: 6,
      title: "Settings",
      description: "Configure system preferences",
      icon: FaCog,
      color: "from-gray-500 to-slate-500",
      href: "/dashboard/settings"
    }
  ]

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
        <span className="text-sm text-gray-500">Shortcuts</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Link
              key={action.id}
              to={action.href}
              className="group p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 hover:scale-105"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-200`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {action.description}
                  </p>
                </div>
                <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default QuickActions
