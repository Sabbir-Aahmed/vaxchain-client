import { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaPlus,
  FaTrash,
  FaSave,
  FaArrowLeft,
  FaSpinner,
} from "react-icons/fa";
import apiClient from "../../../Services/apiClient";
import { useNavigate, useParams } from "react-router";
import Swal from "sweetalert2";

const AddSchedule = () => {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [campaign, setCampaign] = useState(null);

  const [schedules, setSchedules] = useState([
    {
      date: "",
      start_time: "",
      end_time: "",
      max_capacity: "",
    },
  ]);

  useEffect(() => {
    fetchCampaignDetails();
  }, [campaignId]);

  const fetchCampaignDetails = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/campaigns/${campaignId}/`);
      setCampaign(response.data);
    } catch (err) {
      setError("Failed to fetch campaign details");
      console.error("Error fetching campaign:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleChange = (index, field, value) => {
    const updatedSchedules = [...schedules];
    updatedSchedules[index][field] = value;
    setSchedules(updatedSchedules);
  };

  const addSchedule = () => {
    setSchedules([
      ...schedules,
      {
        date: "",
        start_time: "",
        end_time: "",
        max_capacity: "",
      },
    ]);
  };

  const removeSchedule = (index) => {
    if (schedules.length > 1) {
      setSchedules(schedules.filter((_, i) => i !== index));
    }
  };

  const showSuccessAlert = () => {
    return Swal.fire({
      title: "Success!",
      text: "Schedules have been added successfully!",
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
    Swal.fire({
      title: "Validation Error",
      text: message,
      icon: "warning",
      confirmButtonColor: "#f59e0b",
      confirmButtonText: "OK",
    });
  };

  const validateSchedules = () => {
    for (let i = 0; i < schedules.length; i++) {
      const schedule = schedules[i];

      // Check for empty fields
      if (
        !schedule.date ||
        !schedule.start_time ||
        !schedule.end_time ||
        !schedule.max_capacity
      ) {
        showValidationError(`Please fill in all fields for Schedule #${i + 1}`);
        return false;
      }

      // Check if start time is before end time
      if (schedule.start_time >= schedule.end_time) {
        showValidationError(
          `End time must be after start time for Schedule #${i + 1}`
        );
        return false;
      }

      // Check if capacity is valid
      const capacity = parseInt(schedule.max_capacity);
      if (isNaN(capacity) || capacity <= 0) {
        showValidationError(
          `Maximum capacity must be a number greater than 0 for Schedule #${
            i + 1
          }`
        );
        return false;
      }

      // Check if date is within campaign range
      if (campaign) {
        const scheduleDate = new Date(schedule.date);
        const campaignStart = new Date(campaign.start_date);
        const campaignEnd = new Date(campaign.end_date);

        if (scheduleDate < campaignStart || scheduleDate > campaignEnd) {
          showValidationError(
            `Date for Schedule #${
              i + 1
            } must be between ${campaignStart.toLocaleDateString()} and ${campaignEnd.toLocaleDateString()}`
          );
          return false;
        }
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling

    setSaving(true);
    setError(null);

    if (!validateSchedules()) {
      setSaving(false);
      return;
    }

    try {
      // Create all schedule promises
      const schedulePromises = schedules.map((schedule) => {
        const payload = {
          campaign: campaignId,
          date: schedule.date,
          start_time: schedule.start_time,
          end_time: schedule.end_time,
          available_slots: parseInt(schedule.max_capacity),
        };

        return apiClient.post(`/campaigns/${campaignId}/schedule/`, payload);
      });

      await Promise.all(schedulePromises);
      const result = await showSuccessAlert();

      if (result.isConfirmed) {
        navigate("/dashboard/campaigns?success=true");
      }
    } catch (err) {
      console.error("Error creating schedule:", err);

      let errorMessage = "Failed to create schedule. Please try again.";

      if (err.response?.data) {
        // Handle different types of API errors
        if (typeof err.response.data === "string") {
          errorMessage = err.response.data;
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data.detail) {
          errorMessage = err.response.data.detail;
        } else if (typeof err.response.data === "object") {
          errorMessage = Object.values(err.response.data).flat().join(", ");
        }
      }

      setError(errorMessage);
      await showErrorAlert(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // Add a beforeunload handler to prevent accidental navigation
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (saving) {
        e.preventDefault();
        e.returnValue =
          "You have unsaved changes. Are you sure you want to leave?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [saving]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="w-8 h-8 text-teal-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading campaign details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  if (!saving) {
                    navigate(-1);
                  }
                }}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                disabled={saving}
              >
                <FaArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Add Schedule
                </h1>
                <p className="text-gray-600">
                  Add vaccination schedules for {campaign?.name}
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-teal-100 to-cyan-100 px-3 py-2 rounded-lg">
              <span className="text-sm font-medium text-teal-800">
                Campaign ID: {campaignId}
              </span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Campaign Info */}
        {campaign && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Campaign Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Name:</span>
                <p className="font-medium text-gray-900">{campaign.name}</p>
              </div>
              <div>
                <span className="text-gray-600">Vaccine Type:</span>
                <p className="font-medium text-gray-900">
                  {campaign.vaccine_type}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Location:</span>
                <p className="font-medium text-gray-900">{campaign.location}</p>
              </div>
              <div>
                <span className="text-gray-600">Duration:</span>
                <p className="font-medium text-gray-900">
                  {new Date(campaign.start_date).toLocaleDateString()} -{" "}
                  {new Date(campaign.end_date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Schedule Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-6">
              {schedules.map((schedule, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-xl p-6 relative"
                >
                  {schedules.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSchedule(index)}
                      className="absolute top-4 right-4 p-2 text-red-500 hover:text-red-700 transition-colors"
                      disabled={saving}
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  )}

                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FaCalendarAlt className="w-5 h-5 text-teal-500" />
                    Schedule #{index + 1}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date *
                      </label>
                      <input
                        type="date"
                        value={schedule.date}
                        onChange={(e) =>
                          handleScheduleChange(index, "date", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        required
                        min={campaign?.start_date}
                        max={campaign?.end_date}
                        disabled={saving}
                      />
                    </div>

                    {/* Start Time */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FaClock className="inline w-4 h-4 mr-2" />
                        Start Time *
                      </label>
                      <input
                        type="time"
                        value={schedule.start_time}
                        onChange={(e) =>
                          handleScheduleChange(
                            index,
                            "start_time",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        required
                        disabled={saving}
                      />
                    </div>

                    {/* End Time */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FaClock className="inline w-4 h-4 mr-2" />
                        End Time *
                      </label>
                      <input
                        type="time"
                        value={schedule.end_time}
                        onChange={(e) =>
                          handleScheduleChange(
                            index,
                            "end_time",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        required
                        disabled={saving}
                      />
                    </div>

                    {/* Max Capacity */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Maximum Capacity *
                      </label>
                      <input
                        type="number"
                        value={schedule.max_capacity}
                        onChange={(e) =>
                          handleScheduleChange(
                            index,
                            "max_capacity",
                            e.target.value
                          )
                        }
                        placeholder="e.g., 50"
                        min="1"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        required
                        disabled={saving}
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* Add More Schedule Button */}
              <button
                type="button"
                onClick={addSchedule}
                className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-teal-400 hover:bg-teal-50 transition-all duration-200 flex items-center justify-center gap-2 text-gray-600 hover:text-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={saving}
              >
                <FaPlus className="w-5 h-5" />
                Add Another Schedule
              </button>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <FaSpinner className="w-4 h-4 animate-spin" />
                      Saving Schedules...
                    </>
                  ) : (
                    <>
                      <FaSave className="w-4 h-4" />
                      Save All Schedules
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!saving) {
                      navigate("/dashboard/campaigns");
                    }
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={saving}
                >
                  Skip for Now
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSchedule;
