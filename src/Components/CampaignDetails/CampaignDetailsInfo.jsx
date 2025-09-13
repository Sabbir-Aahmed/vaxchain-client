"use client"

import { FaInfoCircle, FaMapMarkerAlt, FaUserMd, FaCheckCircle } from "react-icons/fa"

const CampaignDetailsInfo = ({ campaign }) => {
  const formatDateTime = (dateTimeString) => {
    return new Date(dateTimeString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      {/* Campaign Overview */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <FaInfoCircle className="text-teal-500" />
          Campaign Overview
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-slate-700 mb-2">Description</h3>
            <p className="text-slate-600 leading-relaxed">{campaign.description}</p>
          </div>

          {campaign.location && (
            <div>
              <h3 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <FaMapMarkerAlt className="text-teal-500 w-4 h-4" />
                Location
              </h3>
              <p className="text-slate-600">{campaign.location}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-slate-700 mb-2">Campaign Duration</h3>
              <p className="text-slate-600">
                {formatDate(campaign.start_date)} - {formatDate(campaign.end_date)}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-700 mb-2">Maximum Participants</h3>
              <p className="text-slate-600">{campaign.max_participants} people</p>
            </div>
          </div>

          {campaign.dosage_interval_days > 0 && (
            <div>
              <h3 className="font-semibold text-slate-700 mb-2">Dosage Interval</h3>
              <p className="text-slate-600">{campaign.dosage_interval_days} days between doses</p>
            </div>
          )}
        </div>
      </div>

      {/* Campaign Metadata */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <FaUserMd className="text-teal-500" />
          Campaign Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {campaign.created_by && (
            <div>
              <h3 className="font-semibold text-slate-700 mb-2">Created By</h3>
              <p className="text-slate-600">{campaign.created_by}</p>
            </div>
          )}
          <div>
            <h3 className="font-semibold text-slate-700 mb-2">Status</h3>
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-green-500 w-4 h-4" />
              <span className="capitalize text-slate-600">{campaign.status}</span>
            </div>
          </div>
          {campaign.created_at && (
            <div>
              <h3 className="font-semibold text-slate-700 mb-2">Created</h3>
              <p className="text-slate-600">{formatDateTime(campaign.created_at)}</p>
            </div>
          )}
          {campaign.updated_at && (
            <div>
              <h3 className="font-semibold text-slate-700 mb-2">Last Updated</h3>
              <p className="text-slate-600">{formatDateTime(campaign.updated_at)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CampaignDetailsInfo
