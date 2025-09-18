import { useState, useEffect } from "react";
import { FaSave, FaSpinner, FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router";
import apiClient from "../../../Services/apiClient";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

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

      navigate("/dashboard/campaigns");
    } catch (err) {
      console.error("Error updating campaign:", err);
      setError(err.response?.data || "Failed to update campaign");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <FaSpinner className="w-8 h-8 text-teal-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-100">
            <FaArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Update Campaign</h1>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              type="text"
              value={campaign.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
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
            />
            {campaign?.campaign_image && (
              <img src={campaign.campaign_image} alt="Current" className="mt-2 w-32 h-32 object-cover rounded-xl border" />
            )}
          </div>

          {/* Premium */}
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={campaign.is_premium}
                onChange={(e) => handleChange("is_premium", e.target.checked)}
              />
              Premium Campaign
            </label>
            {campaign.is_premium && (
              <input
                type="text"
                placeholder="Premium Price"
                value={campaign.premium_price || ""}
                onChange={(e) => handleChange("premium_price", e.target.value)}
                className="px-4 py-2 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
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
                onChange={(e) => handleChange("dosage_interval_days", parseInt(e.target.value))}
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Participants</label>
              <input
                type="number"
                value={campaign.max_participants || 0}
                onChange={(e) => handleChange("max_participants", parseInt(e.target.value))}
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="UPCOMING">UPCOMING</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-medium py-3 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? <FaSpinner className="w-4 h-4 animate-spin" /> : <FaSave className="w-4 h-4" />}
            {saving ? " Saving..." : " Update Campaign"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateCampaign;
