import { useState } from "react"
import { FaPlus, FaSave, FaCalendarAlt, FaMapMarkerAlt, FaSyringe, FaUsers, FaDollarSign, FaSpinner } from "react-icons/fa"
import apiClient from '../../../Services/apiClient'
import { useNavigate } from "react-router"
import Swal from "sweetalert2"

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

  const showSuccessAlert = (campaignName, campaignId) => {
    return Swal.fire({
      title: "Campaign Created!",
      html: `
        <div class="text-left">
          <p class="mb-3"><strong>"${campaignName}"</strong> has been created successfully!</p>
          <p class="text-sm text-gray-600">Would you like to add schedules for this campaign now?</p>
        </div>
      `,
      icon: "success",
      showCancelButton: true,
      confirmButtonColor: "#14b8a6",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Add Schedules",
      cancelButtonText: "View Campaigns",
      reverseButtons: true,
      customClass: {
        confirmButton: 'swal2-confirm-success',
        cancelButton: 'swal2-cancel-success'
      }
    })
  }

  const showErrorAlert = (message) => {
    return Swal.fire({
      title: "Creation Failed!",
      text: message,
      icon: "error",
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Try Again",
    })
  }

  const showValidationError = (message) => {
    Swal.fire({
      title: "Validation Error",
      text: message,
      icon: "warning",
      confirmButtonColor: "#f59e0b",
      confirmButtonText: "OK",
    })
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      showValidationError("Campaign name is required");
      return false;
    }

    if (!formData.description.trim()) {
      showValidationError("Campaign description is required");
      return false;
    }

    if (!formData.vaccine_type) {
      showValidationError("Please select a vaccine type");
      return false;
    }

    if (!formData.location.trim()) {
      showValidationError("Location is required");
      return false;
    }

    if (!formData.start_date) {
      showValidationError("Start date is required");
      return false;
    }

    if (!formData.end_date) {
      showValidationError("End date is required");
      return false;
    }

    // Check if end date is after start date
    if (new Date(formData.end_date) <= new Date(formData.start_date)) {
      showValidationError("End date must be after start date");
      return false;
    }

    // Check premium campaign validation
    if (formData.is_premium && (!formData.premium_price || parseFloat(formData.premium_price) <= 0)) {
      showValidationError("Premium price must be greater than 0 for premium campaigns");
      return false;
    }

    // Validate numbers
    if (formData.dosage_interval_days && parseInt(formData.dosage_interval_days) < 0) {
      showValidationError("Dosage interval days cannot be negative");
      return false;
    }

    if (formData.max_participants && parseInt(formData.max_participants) < 1) {
      showValidationError("Maximum participants must be at least 1");
      return false;
    }

    return true;
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setLoading(true)
    setError(null)

    if (!validateForm()) {
      setLoading(false)
      return
    }

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
        const result = await showSuccessAlert(response.data.name, response.data.id)
        
        if (result.isConfirmed) {
          navigate(`/dashboard/campaigns/${response.data.id}/schedule`)
        } else {
          navigate('/dashboard/campaigns')
        }
      }
    } catch (err) {
      console.error('Error creating campaign:', err)
      
      let errorMessage = 'Failed to create campaign. Please try again.'
      
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message
        } else if (err.response.data.detail) {
          errorMessage = err.response.data.detail
        } else if (typeof err.response.data === 'object') {
          errorMessage = Object.values(err.response.data).flat().join(', ')
        }
      }
      
      setError(errorMessage)
      await showErrorAlert(errorMessage)
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
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
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
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
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
                  disabled={loading}
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
                    disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
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
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                disabled={loading}
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