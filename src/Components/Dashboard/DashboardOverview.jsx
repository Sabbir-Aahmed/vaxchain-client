import { useEffect, useState } from "react";
import DashboardCards from "./DashboardCards";
import RecentActivity from "./RecentActivity";
import QuickActions from "./QuickActions";
import apiClient from "../../Services/apiClient";

const DashboardOverview = () => {
  const [monthlyStats, setMonthlyStats] = useState({
    campaignsCompleted: 0,
    totalCampaigns: 0,
    bookingCount: 0,
    bookingTarget: 400,
  });

  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    // Fetch bookings for monthly performance
    const fetchBookings = async () => {
      try {
        const res = await apiClient.get("/bookings/");
        const bookings = res.data.results || [];

        const today = new Date();
        const campaignsCompleted = bookings.filter(
          (b) => new Date(b.campaign_end_date) < today
        ).length;

        setMonthlyStats({
          campaignsCompleted,
          totalCampaigns: bookings.length,
          bookingCount: bookings.length,
          bookingTarget: 400,
        });
      } catch (err) {
        console.error("Failed to fetch bookings", err);
      }
    };

    // Fetch upcoming events
    const fetchCampaigns = async () => {
      try {
        const res = await apiClient.get("/campaigns/");
        const campaigns = res.data.results || [];
        const activeUpcoming = campaigns
          .filter((c) => c.status === "UPCOMING")
          .sort(
            (a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
          )
          .slice(0, 5);

        setUpcomingEvents(activeUpcoming);
      } catch (err) {
        console.error("Failed to fetch campaigns", err);
      }
    };

    fetchBookings();
    fetchCampaigns();
  }, []);

  return (
    <>
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl p-6 mb-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
          <div className="w-full h-full bg-white rounded-full transform translate-x-16 -translate-y-16"></div>
        </div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2">Welcome to VaxChain Dashboard</h2>
          <p className="text-teal-100 mb-4">
            Manage your healthcare campaigns, track bookings, and monitor performance all in one place.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <DashboardCards />

      {/* Additional Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        <QuickActions />
      </div>

      {/* Additional Insights Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Monthly Performance */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Monthly Performance</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Campaigns Completed</span>
              <span className="text-sm font-semibold text-gray-900">
                {monthlyStats.campaignsCompleted}/{monthlyStats.totalCampaigns}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-teal-500 to-cyan-500 h-2 rounded-full"
                style={{
                  width: `${(monthlyStats.campaignsCompleted / monthlyStats.totalCampaigns) * 100}%`,
                }}
              />
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Booking Target</span>
              <span className="text-sm font-semibold text-gray-900">
                {monthlyStats.bookingCount}/{monthlyStats.bookingTarget}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full"
                style={{
                  width: `${(monthlyStats.bookingCount / monthlyStats.bookingTarget) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">System Health</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Server Uptime</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-semibold text-green-600">99.9%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Database Status</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-semibold text-green-600">Healthy</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">API Response</span>
              <span className="text-sm font-semibold text-gray-900">120ms</span>
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Upcoming Events</h3>
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center gap-3">
                <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{event.name}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(event.start_date).toLocaleString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardOverview;
