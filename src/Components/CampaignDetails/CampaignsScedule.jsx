"use client"

import { useState } from "react"
import { FaCalendarAlt, FaClock, FaChevronDown } from "react-icons/fa"

const CampaignSchedule = ({ schedules, selectedSchedule, onScheduleSelect }) => {
  const [isOpen, setIsOpen] = useState(false)

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (!schedules || schedules.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Schedule Selection</h3>
        <p className="text-slate-500">No schedules available for this campaign.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <FaCalendarAlt className="text-teal-500" />
        Select Schedule
      </h3>

      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-left flex items-center justify-between hover:border-teal-300 transition-colors"
        >
          {selectedSchedule ? (
            <div className="flex items-center gap-3">
              <div className="bg-teal-50 p-2 rounded-lg">
                <FaCalendarAlt className="text-teal-600 w-4 h-4" />
              </div>
              <div>
                <p className="font-medium text-slate-800">{formatDate(selectedSchedule.date)}</p>
                <p className="text-slate-600 text-sm flex items-center gap-1">
                  <FaClock className="w-3 h-3" />
                  {selectedSchedule.start_time} - {selectedSchedule.end_time}
                </p>
              </div>
            </div>
          ) : (
            <span className="text-slate-500">Choose a schedule...</span>
          )}
          <FaChevronDown className={`text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
            {schedules.map((schedule) => (
              <button
                key={schedule.id}
                onClick={() => {
                  onScheduleSelect(schedule)
                  setIsOpen(false)
                }}
                className="w-full p-4 text-left hover:bg-slate-50 border-b border-slate-100 last:border-b-0 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-teal-50 p-2 rounded-lg">
                      <FaCalendarAlt className="text-teal-600 w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{formatDate(schedule.date)}</p>
                      <p className="text-slate-600 text-sm flex items-center gap-1">
                        <FaClock className="w-3 h-3" />
                        {schedule.start_time} - {schedule.end_time}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-teal-600">{schedule.available_slots} slots</p>
                    <p className="text-slate-500 text-xs">available</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CampaignSchedule
