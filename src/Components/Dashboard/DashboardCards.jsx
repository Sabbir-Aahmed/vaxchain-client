import { FaUsers, FaCalendarCheck, FaStar, FaSyringe, FaChartLine, FaUserMd } from "react-icons/fa"
import StatCard from "./StatCard"

const DashboardCards = ({ 
  campaignStats = {}, 
  bookingStats = {}, 
  reviewStats = {}, 
  loading = false 
}) => {
  // Mock data - replace with real data from API
  const defaultStats = {
    totalCampaigns: campaignStats.total || 24,
    activeCampaigns: campaignStats.active || 8,
    totalBookings: bookingStats.total || 342,
    pendingBookings: bookingStats.pending || 45,
    totalReviews: reviewStats.total || 156,
    avgRating: reviewStats.avgRating || 4.6,
    totalVaccinations: 1248,
    healthcareProviders: 12
  }

  const cardData = [
    {
      title: "Total Campaigns",
      value: defaultStats.totalCampaigns,
      icon: FaSyringe,
      change: 12,
      changeType: "positive",
      subtitle: `${defaultStats.activeCampaigns} currently active`,
      color: "teal"
    },
    {
      title: "Total Bookings",
      value: defaultStats.totalBookings,
      icon: FaCalendarCheck,
      change: 8,
      changeType: "positive",
      subtitle: `${defaultStats.pendingBookings} pending appointments`,
      color: "blue"
    },
    {
      title: "Reviews & Ratings",
      value: defaultStats.totalReviews,
      icon: FaStar,
      change: 15,
      changeType: "positive",
      subtitle: `${defaultStats.avgRating}/5.0 average rating`,
      color: "purple"
    },
    {
      title: "Total Vaccinations",
      value: defaultStats.totalVaccinations,
      icon: FaUsers,
      change: 23,
      changeType: "positive",
      subtitle: "Doses administered",
      color: "green"
    },
    {
      title: "Revenue Growth",
      value: "₹2.4L",
      icon: FaChartLine,
      change: 18,
      changeType: "positive",
      subtitle: "This month's earnings",
      color: "orange"
    },
    {
      title: "Healthcare Providers",
      value: defaultStats.healthcareProviders,
      icon: FaUserMd,
      change: 5,
      changeType: "positive",
      subtitle: "Active providers",
      color: "blue"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {cardData.map((card, index) => (
        <StatCard
          key={index}
          title={card.title}
          value={card.value}
          icon={card.icon}
          change={card.change}
          changeType={card.changeType}
          subtitle={card.subtitle}
          color={card.color}
          loading={loading}
        />
      ))}
    </div>
  )
}

export default DashboardCards