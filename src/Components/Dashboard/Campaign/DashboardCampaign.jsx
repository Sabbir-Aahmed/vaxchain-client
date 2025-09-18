import { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router";
import apiClient from "../../../Services/apiClient";

const DashboardCampaign = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/campaigns/");
      setCampaigns(response.data.results || []);
    } catch (err) {
      console.error("Error fetching campaigns:", err);
      setError("Failed to fetch campaigns");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCampaign = async (id) => {
    if (!window.confirm("Are you sure you want to delete this campaign?")) return;

    try {
      setDeletingId(id);
      await apiClient.delete(`/campaigns/${id}/`);
      setCampaigns(campaigns.filter(c => c.id !== id));
    } catch (err) {
      console.error("Error deleting campaign:", err);
      setError("Failed to delete campaign");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <FaSpinner className="w-8 h-8 text-teal-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">All Campaigns</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 relative"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{campaign.name}</h2>
              <p className="text-gray-600 text-sm mb-2">{campaign.description}</p>
              <div className="text-sm text-gray-500 mb-4">
                <p><span className="font-medium">Vaccine:</span> {campaign.vaccine_type}</p>
                <p><span className="font-medium">Location:</span> {campaign.location || "-"}</p>
                <p><span className="font-medium">Dates:</span> {new Date(campaign.start_date).toLocaleDateString()} - {new Date(campaign.end_date).toLocaleDateString()}</p>
                <p><span className="font-medium">Max Participants:</span> {campaign.max_participants}</p>
                <p><span className="font-medium">Premium:</span> {campaign.is_premium ? "Yes" : "No"}</p>
              </div>

              <div className="flex gap-2 flex-wrap">
                {/* Add Schedule */}
                <button
                  onClick={() => navigate(`/dashboard/campaigns/${campaign.id}/schedule`)}
                  className="flex items-center gap-2 px-3 py-2 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition"
                >
                  <FaCalendarAlt />
                  Add Schedule
                </button>

                {/* Edit Campaign */}
                <button
                  onClick={() => navigate(`/dashboard/campaigns/update/${campaign.id}`)}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition"
                >
                  <FaEdit />
                  Edit
                </button>

                {/* Delete Campaign */}
                <button
                  onClick={() => handleDeleteCampaign(campaign.id)}
                  className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition disabled:opacity-50"
                  disabled={deletingId === campaign.id}
                >
                  {deletingId === campaign.id ? <FaSpinner className="animate-spin" /> : <FaTrash />}
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardCampaign;
