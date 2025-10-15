import { useState, useEffect } from "react";
import { FaSave, FaSpinner, FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router";
import apiClient from "../../../Services/apiClient";
import Swal from "sweetalert2";

const UpdateCampaign = () => {
  const { campaignId } = useParams();
  const navigate = useNavigate();

  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [campaignImage, setCampaignImage] = useState(null);

  useEffect(() => {
    fetchCampaign();
  }, [campaignId]);

  const fetchCampaign = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/campaigns/${campaignId}/`);
      setCampaign(response.data);
    } catch (err) {
      console.error("Error fetching campaign:", err);
      setError("Failed to fetch campaign details");
      await showErrorAlert("Failed to fetch campaign details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setCampaign({ ...campaign, [field]: value });
  };

  const handleFileChange = (e) => {
    setCampaignImage(e.target.files[0]);
  };

  const showSuccessAlert = () => {
    return Swal.fire({
      title: "Success!",
      text: "Campaign has been updated successfully!",
      icon: "success",
      confirmButtonColor: "#14b8a6",
      confirmButtonText: "Continue to Campaigns",
      allowOutsideClick: false,
      allowEscapeKey: false,
    });
  };

  const showErrorAlert = (message) => {
    return Swal.fire({
      title: "Error!",
      text: message,
      icon: "error",
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Try Again",
    });
  };

  const showValidationError = (message) => {
    return Swal.fire({
      title: "Validation Error",
      text: message,
      icon: "warning",
      confirmButtonColor: "#f59e0b",
      confirmButtonText: "OK",
    });
  };

  const validateForm = () => {
    if (!campaign.name?.trim()) {
      showValidationError("Campaign name is required");
      return false;
    }

    if (!campaign.description?.trim()) {
      showValidationError("Campaign description is required");
      return false;
    }

    if (!campaign.vaccine_type?.trim()) {
      showValidationError("Vaccine type is required");
      return false;
    }

    if (!campaign.start_date) {
      showValidationError("Start date is required");
      return false;
    }

    if (!campaign.end_date) {
      showValidationError("End date is required");
      return false;
    }

    // Check if end date is after start date
    if (new Date(campaign.end_date) <= new Date(campaign.start_date)) {
      showValidationError("End date must be after start date");
      return false;
    }

    // Check premium campaign validation
    if (campaign.is_premium && (!campaign.premium_price || parseFloat(campaign.premium_price) <= 0)) {
      showValidationError("Premium price must be greater than 0 for premium campaigns");
      return false;
    }

    // Validate numbers
    if (campaign.dosage_interval_days < 0) {
      showValidationError("Dosage interval days cannot be negative");
      return false;
    }

    if (campaign.max_participants < 0) {
      showValidationError("Maximum participants cannot be negative");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setSaving(true);
    setError(null);

    // Validate form before submission
    if (!validateForm()) {
      setSaving(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", campaign.name);
      formData.append("description", campaign.description);
      formData.append("is_premium", campaign.is_premium);
      formData.append("premium_price", campaign.is_premium ? campaign.premium_price || "0" : "");
      formData.append("vaccine_type", campaign.vaccine_type);
      formData.append("location", campaign.location || "");
      formData.append("start_date", campaign.start_date);
      formData.append("end_date", campaign.end_date);
      formData.append("dosage_interval_days", campaign.dosage_interval_days ? parseInt(campaign.dosage_interval_days) : 0);
      formData.append("max_participants", campaign.max_participants ? parseInt(campaign.max_participants) : 0);
      formData.append("status", campaign.status || "ACTIVE");

      if (campaignImage) {
        formData.append("campaign_image", campaignImage);
      }

      await apiClient.put(`/campaigns/${campaignId}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const result = await showSuccessAlert();
      
      if (result.isConfirmed) {
        navigate("/dashboard/campaigns");
      }

    } catch (err) {
      console.error("Error updating campaign:", err);
      
      let errorMessage = "Failed to update campaign. Please try again.";
      
      if (err.response?.data) {
        // Handle different types of API errors
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data.detail) {
          errorMessage = err.response.data.detail;
        } else if (typeof err.response.data === 'object') {
          errorMessage = Object.values(err.response.data).flat().join(', ');
        }
      }
      
      setError(errorMessage);
      await showErrorAlert(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // Add a beforeunload handler to prevent accidental navigation during save
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (saving) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [saving]);

  if (loading || !campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FaSpinner className="w-8 h-8 text-teal-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading campaign details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <div className="flex items-center gap-4 mb-6">
          <button 
            type="button"
            onClick={() => navigate(-1)} 
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            disabled={saving}
          >
            <FaArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Update Campaign</h1>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              type="text"
              value={campaign.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
              disabled={saving}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              value={campaign.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
              disabled={saving}
              rows={4}
            />
          </div>

          {/* Vaccine Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vaccine Type *</label>
            <input
              type="text"
              value={campaign.vaccine_type}
              onChange={(e) => handleChange("vaccine_type", e.target.value)}
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
              disabled={saving}
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              value={campaign.location || ""}
              onChange={(e) => handleChange("location", e.target.value)}
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              disabled={saving}
            />
          </div>

          {/* Campaign Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              disabled={saving}
            />
            {campaign?.campaign_image && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-1">Current Image:</p>
                <img 
                  src={campaign.campaign_image} 
                  alt="Current campaign" 
                  className="w-32 h-32 object-cover rounded-xl border"
                />
              </div>
            )}
          </div>

          {/* Premium */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={campaign.is_premium}
                onChange={(e) => handleChange("is_premium", e.target.checked)}
                disabled={saving}
                className="w-4 h-4 text-teal-500 rounded focus:ring-teal-500"
              />
              <span className="font-medium text-gray-700">Premium Campaign</span>
            </label>
            {campaign.is_premium && (
              <div className="flex-1">
                <input
                  type="number"
                  placeholder="Premium Price"
                  value={campaign.premium_price || ""}
                  onChange={(e) => handleChange("premium_price", e.target.value)}
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  disabled={saving}
                  min="0"
                  step="0.01"
                />
              </div>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
              <input
                type="date"
                value={campaign.start_date}
                onChange={(e) => handleChange("start_date", e.target.value)}
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
                disabled={saving}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
              <input
                type="date"
                value={campaign.end_date}
                onChange={(e) => handleChange("end_date", e.target.value)}
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
                disabled={saving}
              />
            </div>
          </div>

          {/* Dosage Interval & Max Participants */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dosage Interval (days)</label>
              <input
                type="number"
                value={campaign.dosage_interval_days || 0}
                onChange={(e) => handleChange("dosage_interval_days", parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                disabled={saving}
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Participants</label>
              <input
                type="number"
                value={campaign.max_participants || 0}
                onChange={(e) => handleChange("max_participants", parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                disabled={saving}
                min="0"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={campaign.status}
              onChange={(e) => handleChange("status", e.target.value)}
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              disabled={saving}
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="UPCOMING">UPCOMING</option>
              <option value="INACTIVE">INACTIVE</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-medium py-3 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {saving ? <FaSpinner className="w-4 h-4 animate-spin" /> : <FaSave className="w-4 h-4" />}
            {saving ? " Saving Changes..." : " Update Campaign"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateCampaign;