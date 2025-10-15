import { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router";
import apiClient from "../../../Services/apiClient";
import Swal from "sweetalert2";

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

  const showDeleteConfirmation = (campaignName) => {
    return Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete the campaign "${campaignName}". This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      focusCancel: true,
      customClass: {
        confirmButton: 'swal2-confirm-delete',
        cancelButton: 'swal2-cancel-delete'
      }
    });
  };

  const showDeleteSuccess = (campaignName) => {
    Swal.fire({
      title: 'Deleted!',
      text: `Campaign "${campaignName}" has been deleted successfully.`,
      icon: 'success',
      confirmButtonColor: '#14b8a6',
      confirmButtonText: 'OK',
      timer: 3000,
      timerProgressBar: true,
    });
  };

  const showDeleteError = (campaignName, errorMessage) => {
    Swal.fire({
      title: 'Error!',
      text: `Failed to delete campaign "${campaignName}". ${errorMessage}`,
      icon: 'error',
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'OK',
    });
  };

  const handleDeleteCampaign = async (campaign) => {
    const result = await showDeleteConfirmation(campaign.name);
    
    if (!result.isConfirmed) return;

    try {
      setDeletingId(campaign.id);
      await apiClient.delete(`/campaigns/${campaign.id}/`);
      
      // Remove campaign from state
      setCampaigns(campaigns.filter(c => c.id !== campaign.id));
      
      // Show success message
      showDeleteSuccess(campaign.name);
      
    } catch (err) {
      console.error("Error deleting campaign:", err);
      
      let errorMessage = "Please try again.";
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data.detail) {
          errorMessage = err.response.data.detail;
        }
      }
      
      setError("Failed to delete campaign");
      showDeleteError(campaign.name, errorMessage);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FaSpinner className="w-8 h-8 text-teal-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading campaigns...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">All Campaigns</h1>
          <button
            onClick={() => navigate("/dashboard/campaigns/create")}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl hover:from-teal-600 hover:to-cyan-600 transition-all duration-200"
          >
            <FaPlus className="w-4 h-4" />
            Create Campaign
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {campaigns.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
            <FaCalendarAlt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Campaigns Found</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first vaccination campaign.</p>
            <button
              onClick={() => navigate("/dashboard/campaigns/create")}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl hover:from-teal-600 hover:to-cyan-600 transition-all duration-200 mx-auto"
            >
              <FaPlus className="w-4 h-4" />
              Create Your First Campaign
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-200"
              >
                {/* Campaign Header */}
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-xl font-semibold text-gray-900 flex-1 pr-2">{campaign.name}</h2>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    campaign.status === 'ACTIVE' 
                      ? 'bg-green-100 text-green-800' 
                      : campaign.status === 'UPCOMING'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {campaign.status}
                  </span>
                </div>

                {/* Campaign Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{campaign.description}</p>

                {/* Campaign Details */}
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700">Vaccine:</span>
                    <span>{campaign.vaccine_type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700">Location:</span>
                    <span>{campaign.location || "-"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700">Dates:</span>
                    <span>
                      {new Date(campaign.start_date).toLocaleDateString()} - {" "}
                      {new Date(campaign.end_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700">Capacity:</span>
                    <span>{campaign.max_participants}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700">Premium:</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      campaign.is_premium 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {campaign.is_premium ? "Yes" : "No"}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => navigate(`/dashboard/campaigns/${campaign.id}/schedule`)}
                    className="flex items-center gap-2 px-3 py-2 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-colors text-sm"
                    title="Add Schedule"
                  >
                    <FaCalendarAlt className="w-3 h-3" />
                    Schedule
                  </button>

                  <button
                    onClick={() => navigate(`/dashboard/campaigns/update/${campaign.id}`)}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors text-sm"
                    title="Edit Campaign"
                  >
                    <FaEdit className="w-3 h-3" />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDeleteCampaign(campaign)}
                    disabled={deletingId === campaign.id}
                    className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete Campaign"
                  >
                    {deletingId === campaign.id ? (
                      <FaSpinner className="w-3 h-3 animate-spin" />
                    ) : (
                      <FaTrash className="w-3 h-3" />
                    )}
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardCampaign;