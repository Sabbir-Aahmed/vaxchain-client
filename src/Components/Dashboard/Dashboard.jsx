import { FaBell, FaUser, FaSearch, FaSun, FaMoon } from "react-icons/fa"
import { useState, useEffect } from "react"
import { Routes, Route, useLocation } from "react-router"
import Sidebar from "./Sidebar"
import DashboardCards from "./DashboardCards"
import RecentActivity from "./RecentActivity"
import QuickActions from "./QuickActions"
import CreateCampaigns from "./CreateCampaigns"
import Bookings from "./Bookings"
import Reviews from "./Reviews"

// Dashboard Overview Component
const DashboardOverview = () => {
  return (
    <>
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl p-6 mb-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
          <div className="w-full h-full bg-white rounded-full transform translate-x-16 -translate-y-16"></div>
        </div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2">Welcome to VaxChain Dashboard</h2>
          <p className="text-teal-100 mb-4">
            Manage your healthcare campaigns, track bookings, and monitor performance all in one place.
          </p>
          <div className="flex items-center gap-4 text-sm text-teal-100">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>System Status: Healthy</span>
            </div>
            <div>|</div>
            <div>Last updated: {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <DashboardCards />

      {/* Additional Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <RecentActivity />

        {/* Quick Actions */}
        <QuickActions />
      </div>

      {/* Additional Insights Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Monthly Performance */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Monthly Performance</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Campaigns Completed</span>
              <span className="text-sm font-semibold text-gray-900">12/15</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-teal-500 to-cyan-500 h-2 rounded-full" style={{ width: '80%' }}></div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Booking Target</span>
              <span className="text-sm font-semibold text-gray-900">342/400</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">System Health</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Server Uptime</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-semibold text-green-600">99.9%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Database Status</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-semibold text-green-600">Healthy</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">API Response</span>
              <span className="text-sm font-semibold text-gray-900">120ms</span>
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Upcoming Events</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">COVID Booster Drive</p>
                <p className="text-xs text-gray-500">Tomorrow, 9:00 AM</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Staff Training Session</p>
                <p className="text-xs text-gray-500">Dec 20, 2:00 PM</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Monthly Review</p>
                <p className="text-xs text-gray-500">Dec 25, 10:00 AM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const location = useLocation()

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return "Good Morning"
    if (hour < 18) return "Good Afternoon"
    return "Good Evening"
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Top Navigation Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            {/* Left Section - Greeting & Time */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {getGreeting()}, Admin! 👋
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {formatDate(currentTime)} • {formatTime(currentTime)}
              </p>
            </div>

            {/* Right Section - Search & Actions */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search campaigns, bookings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent w-64"
                />
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
              >
                {isDarkMode ? (
                  <FaSun className="w-5 h-5 text-yellow-600" />
                ) : (
                  <FaMoon className="w-5 h-5 text-gray-600" />
                )}
              </button>

              {/* Notifications */}
              <div className="relative">
                <button className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors duration-200">
                  <FaBell className="w-5 h-5 text-gray-600" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    3
                  </span>
                </button>
              </div>

              {/* Profile */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <FaUser className="w-4 h-4 text-white" />
                </div>
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-gray-900">Admin User</p>
                  <p className="text-xs text-gray-500">Healthcare Admin</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          <Routes>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="/campaigns" element={<CreateCampaigns />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/payment" element={
              <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Management</h2>
                <p className="text-gray-600">Payment processing features coming soon...</p>
              </div>
            } />
            <Route path="/analytics" element={
              <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Analytics Dashboard</h2>
                <p className="text-gray-600">Detailed analytics and reporting features coming soon...</p>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default Dashboard