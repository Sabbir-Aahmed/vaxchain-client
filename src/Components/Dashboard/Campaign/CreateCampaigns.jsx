import { useState } from "react"
import { FaPlus, FaSave, FaCalendarAlt, FaMapMarkerAlt, FaSyringe, FaUsers, FaDollarSign, FaSpinner } from "react-icons/fa"
import apiClient from '../../../Services/apiClient'
import { useNavigate } from "react-router"

const CreateCampaigns = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [campaignImage, setCampaignImage] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    is_premium: false,
    premium_price: "",
    vaccine_type: "",
    location: "",
    start_date: "",
    end_date: "",
    dosage_interval_days: "",
    max_participants: "",
    status: "ACTIVE"
  })

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleFileChange = (e) => {
    setCampaignImage(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const fd = new FormData()
      Object.entries({
        ...formData,
        premium_price: formData.is_premium ? formData.premium_price : "0",
        dosage_interval_days: parseInt(formData.dosage_interval_days) || 0,
        max_participants: parseInt(formData.max_participants) || 0
      }).forEach(([key, value]) => fd.append(key, value))

      if (campaignImage) {
        fd.append('campaign_image', campaignImage)
      }

      const response = await apiClient.post('/campaigns/', fd, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (response.status === 201) {
        navigate(`/dashboard/campaigns/${response.data.id}/schedule`)
      }
    } catch (err) {
      console.error('Error creating campaign:', err)
      setError(err.response?.data?.message || 'Failed to create campaign. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const vaccineTypes = [
    "COVID-19", "Influenza (Flu)", "Hepatitis B", "MMR (Measles, Mumps, Rubella)",
    "HPV (Human Papillomavirus)", "Varicella (Chickenpox)", "Polio", "Tetanus", "Diphtheria", "Other"
  ]

  const statusOptions = [
    { value: "ACTIVE", label: "Active" },
    { value: "UPCOMING", label: "Upcoming" },
    { value: "COMPLETED", label: "Completed" }
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <FaPlus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create New Campaign</h1>
              <p className="text-gray-600">Launch a new vaccination campaign</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campaign Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Campaign Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., COVID-19 Booster Drive 2024"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                rows="4"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the campaign objectives and target audience..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              ></textarea>
            </div>

            {/* Campaign Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Campaign Image
              </label>
              <input
                type="file"
                name="campaign_image"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            {/* Vaccine Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaSyringe className="inline w-4 h-4 mr-2" />
                Vaccine Type *
              </label>
              <select
                name="vaccine_type"
                value={formData.vaccine_type}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              >
                <option value="">Select Vaccine Type</option>
                {vaccineTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Premium Campaign */}
            <div className="bg-gray-50 p-4 rounded-xl">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="is_premium"
                  checked={formData.is_premium}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Premium Campaign
                </span>
              </label>
              
              {formData.is_premium && (
                <div className="mt-3 pl-7">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaDollarSign className="inline w-4 h-4 mr-2" />
                    Premium Price *
                  </label>
                  <input
                    type="number"
                    name="premium_price"
                    value={formData.premium_price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required={formData.is_premium}
                  />
                </div>
              )}
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaCalendarAlt className="inline w-4 h-4 mr-2" />
                  Start Date *
                </label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaCalendarAlt className="inline w-4 h-4 mr-2" />
                  End Date *
                </label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Dosage Interval */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaSyringe className="inline w-4 h-4 mr-2" />
                Dosage Interval (Days)
              </label>
              <input
                type="number"
                name="dosage_interval_days"
                value={formData.dosage_interval_days}
                onChange={handleInputChange}
                placeholder="e.g., 28 days for second dose"
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            {/* Max Participants */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaUsers className="inline w-4 h-4 mr-2" />
                Maximum Participants
              </label>
              <input
                type="number"
                name="max_participants"
                value={formData.max_participants}
                onChange={handleInputChange}
                placeholder="e.g., 1000"
                min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaMapMarkerAlt className="inline w-4 h-4 mr-2" />
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., Central Community Health Center"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <FaSpinner className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <FaSave className="w-4 h-4" />
                    Create Campaign
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateCampaigns
