
import { FaCalendarAlt, FaUsers, FaSyringe, FaMapMarkerAlt } from "react-icons/fa"
import { Link } from "react-router"

const CampaignCard = ({ campaign }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800"
      case "upcoming":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-teal-100 text-teal-800"
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto bg-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group">
      {/* Campaign Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={campaign.campaign_image || "/placeholder.svg?height=200&width=400&query=vaccination campaign"}
          alt={campaign.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
            {campaign.status || "Active"}
          </span>
        </div>
      </div>

      <div className="pb-3 ml-4">
        <h2 className="text-xl font-bold text-slate-800 line-clamp-2">{campaign.name}</h2>
        <p className="text-slate-600 line-clamp-2">{campaign.description}</p>
      </div>

      <div className="space-y-3 ml-4">
        {/* Vaccine Type */}
        <div className="flex items-center gap-2 text-sm text-slate-700">
          <FaSyringe className="text-teal-500 w-4 h-4" />
          <span className="font-medium">{campaign.vaccine_type}</span>
        </div>

        {/* Date Range */}
        <div className="flex items-center gap-2 text-sm text-slate-700">
          <FaCalendarAlt className="text-teal-500 w-4 h-4" />
          <span>
            {formatDate(campaign.start_date)} - {formatDate(campaign.end_date)}
          </span>
        </div>

        {/* Max Participants */}
        <div className="flex items-center gap-2 text-sm text-slate-700">
          <FaUsers className="text-teal-500 w-4 h-4" />
          <span>Max {campaign.max_participants} participants</span>
        </div>

        {/* Dosage Interval */}
        {campaign.dosage_interval_days && (
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <FaMapMarkerAlt className="text-teal-500 w-4 h-4" />
            <span>{campaign.dosage_interval_days} days interval</span>
          </div>
        )}
      </div>

      <div className="pt-4">
        <Link to={`/campaigns/details/${campaign.id}`}>
          <button className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-medium py-2 px-4 rounded-xl transition-all duration-200">
            Details
          </button>
        </Link>
      </div>
    </div>
  )
}

export default CampaignCard