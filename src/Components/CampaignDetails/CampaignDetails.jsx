
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import {
  FaSpinner,
  FaInfoCircle,
  FaCalendarCheck,
  FaCrown,
  FaCreditCard,
} from "react-icons/fa";
import CampaignDetailsInfo from "./CampaignDetailsInfo";
import CampaignSchedule from "./CampaignsScedule";
import apiClient from "../../Services/apiClient";
import CampaignReview from "./CampaignReviews";

const CampaignDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  useEffect(() => {
    const fetchCampaignDetails = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get(`/campaigns/${id}/`);
        setCampaign(response.data);
      } catch (err) {
        console.error("Error fetching campaign details:", err);
        setError("Failed to load campaign details");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchCampaignDetails();
  }, [id]);

  const handleBooking = async () => {
    if (!selectedSchedule) {
      alert("Please select a schedule first");
      return;
    }

    setIsBooking(true);
    try {
      const res = await apiClient.post(`/campaigns/${campaign.id}/booking/`, {
        first_dose_schedule_id: Number(selectedSchedule.id),
      });

      if (campaign.is_premium) {
        sessionStorage.setItem(
          "paymentData",
          JSON.stringify({
            payment_id: res.data.payment_id,
            campaignId: campaign.id,
            campaignName: campaign.name,
            scheduleId: selectedSchedule.id,
            scheduleName: `${selectedSchedule.date} at ${selectedSchedule.start_time}`,
            amount: campaign.premium_price,
          })
        );
        navigate("/dashboard/payment");
      } else {
        alert("Booking successful!");
        navigate("/dashboard/user");
      }
    } catch (err) {
      console.error(err.response?.data || err);
      alert(JSON.stringify(err.response?.data || "Booking failed."));
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-teal-500 w-8 h-8 mx-auto mb-4" />
          <p className="text-slate-600">Loading campaign details...</p>
        </div>
      </div>
    );

  if (error || !campaign)
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-blue-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md mx-auto">
          <div className="text-center">
            <FaInfoCircle className="text-red-500 w-8 h-8 mx-auto mb-4" />
            <p className="text-red-800 font-medium mb-2">Campaign not found</p>
            <p className="text-red-600 text-sm">
              The requested campaign could not be loaded.
            </p>
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white py-12">
        <div className="max-w-7xl text-center mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <h1 className="text-3xl md:text-4xl font-bold">{campaign.name}</h1>
            {campaign.is_premium && (
              <div className="bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-900 px-4 py-2 rounded-full flex items-center gap-2 text-sm font-semibold">
                <FaCrown className="w-4 h-4" />
                PREMIUM
              </div>
            )}
          </div>
          <p className="text-teal-100">
            {campaign.vaccine_type} Vaccination Campaign
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <img
                  src={
                    campaign.campaign_image ||
                    "/placeholder.svg?height=400&width=600&query=vaccination campaign"
                  }
                  alt={campaign.name}
                  className="w-full h-64 md:h-80 object-cover"
                />
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">
                    {campaign.name}
                  </h2>
                  <p className="text-teal-600 font-medium mb-4">
                    {campaign.vaccine_type}
                  </p>

                  {campaign.is_premium && (
                    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-4 mb-4">
                      <div className="flex items-center gap-3 mb-2">
                        <FaCrown className="text-amber-600 w-5 h-5" />
                        <h3 className="text-lg font-semibold text-amber-800">
                          Premium Campaign
                        </h3>
                      </div>
                      <p className="text-amber-700 text-sm mb-3">
                        This is a premium vaccination campaign with enhanced
                        services and priority booking.
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-amber-700 font-medium">
                          Campaign Fee:
                        </span>
                        <span className="text-2xl font-bold text-amber-800">
                          ${campaign.premium_price || 0}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Campaign Details */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <CampaignDetailsInfo campaign={campaign} />

              <CampaignSchedule
                schedules={campaign.schedules}
                selectedSchedule={selectedSchedule}
                onScheduleSelect={setSelectedSchedule}
              />

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <button
                  onClick={handleBooking}
                  disabled={isBooking || !selectedSchedule}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                    campaign.is_premium
                      ? "bg-gradient-to-r from-amber-500 to-yellow-600 text-white hover:from-amber-600 hover:to-yellow-700"
                      : "bg-gradient-to-r from-teal-500 to-cyan-600 text-white hover:from-teal-600 hover:to-cyan-700"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isBooking ? (
                    <>
                      <FaSpinner className="animate-spin w-5 h-5" />
                      Processing...
                    </>
                  ) : campaign.is_premium ? (
                    <>
                      <FaCreditCard className="w-5 h-5" />
                      Proceed to Payment
                    </>
                  ) : (
                    <>
                      <FaCalendarCheck className="w-5 h-5" />
                      Book Appointment
                    </>
                  )}
                </button>
                {!selectedSchedule && (
                  <p className="text-slate-500 text-sm text-center mt-2">
                    Please select a schedule to{" "}
                    {campaign.is_premium
                      ? "proceed with payment"
                      : "book your appointment"}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        {campaign && <CampaignReview campaignId={campaign.id} />}
      </div>
    </div>
  );
};

export default CampaignDetails;
