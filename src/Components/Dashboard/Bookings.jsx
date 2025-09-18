import { useState, useEffect } from 'react'
import { FaCalendarCheck, FaUser, FaClock, FaSpinner, FaSyringe, FaEllipsisH, FaCalendarAlt, FaInfoCircle } from "react-icons/fa"
import apiClient from '../../Services/apiClient'

const Bookings = () => {
  const [bookings, setBookings] = useState([])
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    pending: 0,
    confirmed: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedBooking, setExpandedBooking] = useState(null)

  useEffect(() => {
    fetchBookings()
    fetchStats()
  }, [])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const response = await apiClient.get('/bookings/')
      setBookings(response.data.results)
    } catch (err) {
      setError('Failed to fetch bookings')
      console.error('Error fetching bookings:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await apiClient.get('/bookings/')
      const allBookings = response.data.results
      
      const today = new Date().toISOString().split('T')[0]
      const todayAppointments = allBookings.filter(
        booking => booking.first_dose_schedule.date === today
      ).length
      
      setStats({
        total: response.data.count,
        today: todayAppointments,
        pending: 0,
        confirmed: response.data.count
      })
    } catch (err) {
      console.error('Error fetching stats:', err)
    }
  }

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return
    }
    
    try {
      await apiClient.delete(`/bookings/${id}/delete/`)
      // Remove the cancelled booking from the list
      setBookings(bookings.filter(booking => booking.id !== id))
      // Refresh stats
      fetchStats()
    } catch (err) {
      console.error('Error cancelling booking:', err)
      alert('Failed to cancel booking. Please try again.')
    }
  }

  const formatTime = (timeString) => {
    if (!timeString) return ''
    const time = timeString.split(':')
    const hours = parseInt(time[0])
    const minutes = time[1]
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const formattedHours = hours % 12 || 12
    return `${formattedHours}:${minutes} ${ampm}`
  }

  const getDoseStatus = (doseSchedule) => {
    if (!doseSchedule) return 'pending'
    
    const today = new Date()
    const doseDate = new Date(doseSchedule.date)
    
    if (doseDate > today) return 'upcoming'
    if (doseDate < today) return 'completed'
    
    return 'today'
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700'
      case 'upcoming':
        return 'bg-blue-100 text-blue-700'
      case 'today':
        return 'bg-yellow-100 text-yellow-700'
      case 'pending':
        return 'bg-gray-100 text-gray-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const toggleBookingDetails = (id) => {
    setExpandedBooking(expandedBooking === id ? null : id)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading bookings...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={fetchBookings}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header for mobile */}
        <div className="md:hidden mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Bookings</h1>
          <p className="text-gray-600">Manage vaccination appointments</p>
        </div>

        {/* Stats Cards - Responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { 
              title: "Total Bookings", 
              value: stats.total, 
              icon: FaCalendarCheck, 
              color: "blue" 
            },
            { 
              title: "Today's Appointments", 
              value: stats.today, 
              icon: FaClock, 
              color: "green" 
            },
            { 
              title: "Upcoming Doses", 
              value: bookings.filter(booking => 
                getDoseStatus(booking.first_dose_schedule) === 'upcoming' || 
                getDoseStatus(booking.second_dose_schedule) === 'upcoming'
              ).length, 
              icon: FaSyringe, 
              color: "yellow" 
            },
            { 
              title: "Completed Doses", 
              value: bookings.filter(booking => 
                getDoseStatus(booking.first_dose_schedule) === 'completed' || 
                getDoseStatus(booking.second_dose_schedule) === 'completed'
              ).length, 
              icon: FaUser, 
              color: "teal" 
            }
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">{stat.title}</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-8 h-8 sm:w-10 sm:h-10 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bookings Table/Cards */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Vaccination Bookings</h2>
          </div>
          
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="px-4 py-3 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                  <th className="px-4 py-3 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Dose</th>
                  <th className="px-4 py-3 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Second Dose</th>
                  <th className="px-4 py-3 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 sm:px-6 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center">
                          <FaUser className="w-3 h-3 text-white" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{booking.patient_name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 sm:px-6 whitespace-nowrap">
                      <p className="text-sm font-medium text-gray-900">{booking.campaign_name}</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(booking.campaign_start_date)} to {formatDate(booking.campaign_end_date)}
                      </p>
                    </td>
                    <td className="px-4 py-4 sm:px-6 whitespace-nowrap">
                      {booking.first_dose_schedule ? (
                        <>
                          <p className="text-sm text-gray-900">{formatDate(booking.first_dose_schedule.date)}</p>
                          <p className="text-xs text-gray-500">
                            {formatTime(booking.first_dose_schedule.start_time)} - {formatTime(booking.first_dose_schedule.end_time)}
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-gray-500">Not scheduled</p>
                      )}
                    </td>
                    <td className="px-4 py-4 sm:px-6 whitespace-nowrap">
                      {booking.second_dose_schedule ? (
                        <>
                          <p className="text-sm text-gray-900">{formatDate(booking.second_dose_schedule.date)}</p>
                          <p className="text-xs text-gray-500">
                            {formatTime(booking.second_dose_schedule.start_time)} - {formatTime(booking.second_dose_schedule.end_time)}
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-gray-500">Not scheduled</p>
                      )}
                    </td>
                    <td className="px-4 py-4 sm:px-6 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        {booking.first_dose_schedule && (
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(getDoseStatus(booking.first_dose_schedule))}`}>
                            1st: {getDoseStatus(booking.first_dose_schedule)}
                          </span>
                        )}
                        {booking.second_dose_schedule && (
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(getDoseStatus(booking.second_dose_schedule))}`}>
                            2nd: {getDoseStatus(booking.second_dose_schedule)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 sm:px-6 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => handleCancelBooking(booking.id)}
                        className="text-red-600 hover:text-red-900 text-xs sm:text-sm">
                          Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden">
            {bookings.map((booking) => (
              <div key={booking.id} className="border-b border-gray-200 last:border-b-0">
                <div 
                  className="p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => toggleBookingDetails(booking.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center">
                        <FaUser className="w-4 h-4 text-white" />
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-gray-900">{booking.patient_name}</p>
                        <p className="text-sm text-gray-600">{booking.campaign_name}</p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <FaEllipsisH className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <FaCalendarAlt className="w-3 h-3 mr-1" />
                      <span>1st Dose</span>
                    </div>
                    <div className="text-sm text-gray-900">
                      {booking.first_dose_schedule ? formatDate(booking.first_dose_schedule.date) : 'Not scheduled'}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <FaInfoCircle className="w-3 h-3 mr-1" />
                      <span>Status</span>
                    </div>
                    <div>
                      {booking.first_dose_schedule && (
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(getDoseStatus(booking.first_dose_schedule))}`}>
                          {getDoseStatus(booking.first_dose_schedule)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Expanded details */}
                {expandedBooking === booking.id && (
                  <div className="px-4 pb-4 bg-gray-50">
                    <div className="grid grid-cols-1 gap-3 text-sm">
                      <div>
                        <p className="text-gray-600 font-medium">Campaign Period</p>
                        <p className="text-gray-900">
                          {formatDate(booking.campaign_start_date)} - {formatDate(booking.campaign_end_date)}
                        </p>
                      </div>
                      
                      {booking.first_dose_schedule && (
                        <div>
                          <p className="text-gray-600 font-medium">First Dose Schedule</p>
                          <p className="text-gray-900">{formatDate(booking.first_dose_schedule.date)}</p>
                          <p className="text-gray-600">
                            {formatTime(booking.first_dose_schedule.start_time)} - {formatTime(booking.first_dose_schedule.end_time)}
                          </p>
                        </div>
                      )}
                      
                      {booking.second_dose_schedule && (
                        <div>
                          <p className="text-gray-600 font-medium">Second Dose Schedule</p>
                          <p className="text-gray-900">{formatDate(booking.second_dose_schedule.date)}</p>
                          <p className="text-gray-600">
                            {formatTime(booking.second_dose_schedule.start_time)} - {formatTime(booking.second_dose_schedule.end_time)}
                          </p>
                          <span className={`inline-flex mt-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(getDoseStatus(booking.second_dose_schedule))}`}>
                            {getDoseStatus(booking.second_dose_schedule)}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex space-x-2 pt-2">
                        <button 
                          onClick={() => handleCancelBooking(booking.id)}
                          className="flex-1 bg-red-500 text-white py-2 px-3 rounded-lg text-xs font-medium hover:bg-red-600 transition-colors">
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Empty state */}
        {bookings.length === 0 && !loading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <FaCalendarCheck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600">You don't have any vaccination appointments scheduled yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Bookings