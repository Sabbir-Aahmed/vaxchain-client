import { useEffect, useState } from "react";
import { FaCalendarCheck, FaClock, FaStar } from "react-icons/fa";
import apiClient from "../../Services/apiClient";

const DashboardCards = () => {
  const [cardsData, setCardsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [campaignRes, bookingRes, reviewRes] = await Promise.all([
          apiClient.get("/campaigns/"),
          apiClient.get("/bookings/"),
          apiClient.get("/reviews/"),
        ]);

        const campaigns = campaignRes.data.results || [];
        const activeCount = campaigns.filter((c) => c.status === "ACTIVE").length;

        const bookings = bookingRes.data.results || [];
        const pendingCount = 0;

        const reviews = reviewRes.data.results || [];
        const avgRating =
          reviews.length > 0
            ? (
                reviews.reduce((acc, r) => acc + (r.rating || 0), 0) /
                reviews.length
              ).toFixed(1)
            : 0;

        setCardsData([
          {
            title: "Total Campaigns",
            value: campaignRes.data.count || 0,
            subtitle: `Active: ${activeCount}`,
            icon: FaCalendarCheck,
            bgClass: "bg-blue-100",
            iconClass: "text-blue-600",
          },
          {
            title: "Total Bookings",
            value: bookingRes.data.count || 0,
            subtitle: `Pending: ${pendingCount}`,
            icon: FaClock,
            bgClass: "bg-green-100",
            iconClass: "text-green-600",
          },
          {
            title: "Total Reviews",
            value: reviewRes.data.count || 0,
            subtitle: `Avg Rating: ${avgRating}`,
            icon: FaStar,
            bgClass: "bg-yellow-100",
            iconClass: "text-yellow-600",
          },
        ]);
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-6">
        <p className="text-gray-600">Loading dashboard cards...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center w-full mb-8">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
      {cardsData.map((card, index) => (
        <div
          key={index}
          className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex items-center justify-between"
        >
          {/* Text */}
          <div>
            <p className="text-lg text-gray-500">{card.title}</p>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            {card.subtitle && (
              <p className="text-sm text-gray-400">{card.subtitle}</p>
            )}
          </div>

          {/* Icon */}
          <div
            className={`w-14 h-14 flex items-center justify-center rounded-full ${card.bgClass}`}
          >
            <card.icon className={`${card.iconClass} w-7 h-7`} />
          </div>
        </div>
      ))}
    </div>
  </div>
  );
};

export default DashboardCards;
