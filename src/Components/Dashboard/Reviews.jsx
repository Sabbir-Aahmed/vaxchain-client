import { useState, useEffect } from 'react'
import { FaStar, FaUser, FaSpinner } from "react-icons/fa"
import apiClient from '../../Services/apiClient'

const Reviews = () => {
  const [reviews, setReviews] = useState([])
  const [stats, setStats] = useState({
    total: 0,
    fiveStar: 0,
    thisMonth: 0,
    responseRate: 0
  })
  const [ratingDistribution, setRatingDistribution] = useState({
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchReviews()
    fetchReviewStats()
  }, [])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const response = await apiClient.get('/reviews/')
      setReviews(response.data.results || response.data)
    } catch (err) {
      setError('Failed to fetch reviews')
      console.error('Error fetching reviews:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchReviewStats = async () => {
    try {
      
      // For now, calculate from reviews data
      const response = await apiClient.get('/reviews/')
      const allReviews = response.data.results || response.data
      
      // Calculate stats
      const total = allReviews.length
      const fiveStar = allReviews.filter(review => review.rating === 5).length
      const thisMonth = allReviews.filter(review => {
        const reviewDate = new Date(review.date || review.created_at)
        const currentMonth = new Date().getMonth()
        const currentYear = new Date().getFullYear()
        return reviewDate.getMonth() === currentMonth && reviewDate.getFullYear() === currentYear
      }).length
      
      // Calculate rating distribution
      const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      allReviews.forEach(review => {
        if (review.rating >= 1 && review.rating <= 5) {
          distribution[review.rating]++
        }
      })

      setStats({
        total,
        fiveStar,
        thisMonth,
        responseRate: Math.round((allReviews.filter(r => r.response).length / total) * 100) || 0
      })

      setRatingDistribution(distribution)
    } catch (err) {
      console.error('Error fetching review stats:', err)
    }
  }

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FaStar
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      />
    ))
  }

  const getAverageRating = () => {
    if (reviews.length === 0) return '0.0'
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
    return (totalRating / reviews.length).toFixed(1)
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getPercentage = (count) => {
    if (stats.total === 0) return 0
    return Math.round((count / stats.total) * 100)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="w-8 h-8 text-teal-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading reviews...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={fetchReviews}
            className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center">
                <FaStar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Reviews & Feedback</h1>
                <p className="text-gray-600">Monitor patient satisfaction</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Average Rating</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-900">{getAverageRating()}</span>
                <div className="flex">{renderStars(Math.round(getAverageRating()))}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Review Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <FaStar className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">5-Star Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{stats.fiveStar}</p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FaStar className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">{stats.thisMonth}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FaStar className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Response Rate</p>
                <p className="text-2xl font-bold text-gray-900">{stats.responseRate}%</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaUser className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h2>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-4">
                <div className="flex items-center gap-2 w-16">
                  <span className="text-sm text-gray-600">{star}</span>
                  <FaStar className="w-4 h-4 text-yellow-400" />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full"
                    style={{ width: `${getPercentage(ratingDistribution[star])}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-12">
                  {getPercentage(ratingDistribution[star])}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Reviews</h2>
            <span className="text-sm text-gray-600">{reviews.length} reviews</span>
          </div>
          
          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <FaStar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
              <p className="text-gray-600">Patient reviews will appear here once they're submitted.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full flex items-center justify-center">
                        <FaUser className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {review.patient_name || review.patientName || 'Anonymous Patient'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {review.campaign_name || review.campaign || 'Vaccination Campaign'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-1">
                        {renderStars(review.rating)}
                      </div>
                      <p className="text-sm text-gray-500">
                        {formatDate(review.date || review.created_at || review.submitted_at)}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700">
                    {review.comment || review.feedback || 'No comment provided.'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Reviews