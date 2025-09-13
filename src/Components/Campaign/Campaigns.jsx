import { useEffect, useState } from "react"
import { FaSearch, FaFilter, FaShieldAlt, FaSpinner, FaArrowLeft, FaArrowRight } from "react-icons/fa"
import CampaignList from "./CampaignList"
import apiClient from "../../Services/apiClient"

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([])
  const [filteredCampaigns, setFilteredCampaigns] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (searchTerm) params.append('search', searchTerm)
    if (selectedStatus !== "all") params.append('status', selectedStatus)
    params.append('page', currentPage)

    apiClient
      .get(`/campaigns/?${params.toString()}`)
      .then((res) => {
        const campaignData = res.data.results || res.data || []
        setCampaigns(campaignData)
        setFilteredCampaigns(campaignData)
        setTotalCount(res.data.count || 0) // Extract total count for pagination
      })
      .catch((err) => {
        setError(err.message)
        setCampaigns([])
        setFilteredCampaigns([])
        setTotalCount(0)
      })
      .finally(() => setLoading(false))
  }, [searchTerm, selectedStatus, currentPage])

  // Calculate total pages (assuming page_size from backend, e.g., 10)
  const pageSize = 10 // Adjust based on your DefaultPagination setting
  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-blue-50">
      {/* VaxChain Header */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-600  text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FaShieldAlt className="w-8 h-8 text-cyan-200" />
            <h1 className="text-4xl md:text-5xl font-bold">VaxChain Campaigns</h1>
          </div>
          <p className="text-xl text-gray-100 max-w-3xl mx-auto">
            Discover and book vaccination appointments from trusted healthcare providers. Stay protected with VaxChain's
            comprehensive immunization network.
          </p>
        </div>
      </div>

      {/* Search and Filters Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search campaigns, vaccines, or descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all duration-200"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="pl-10 pr-8 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none appearance-none bg-white min-w-[140px]"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-slate-600">
            Showing {filteredCampaigns.length} of {totalCount} campaigns
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <FaSpinner className="animate-spin text-teal-500 w-8 h-8 mx-auto mb-4" />
              <p className="text-slate-600">Loading vaccination campaigns...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Campaign Grid */}
            <CampaignList campaigns={filteredCampaigns} loading={isLoading} error={error} />

            {/* Pagination Controls */}
            {totalCount > 0 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-xl disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-teal-600 transition-all duration-200"
                >
                  <FaArrowLeft className="w-4 h-4" />
                  Previous
                </button>
                <span className="text-slate-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-xl disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-teal-600 transition-all duration-200"
                >
                  Next
                  <FaArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* No Results State */}
            {!isLoading && filteredCampaigns.length === 0 && (
              <div className="text-center py-20">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
                  <p className="text-slate-800 font-medium mb-2">No campaigns found</p>
                  <p className="text-slate-600 text-sm mb-4">Try adjusting your search or filters</p>
                  <button
                    onClick={() => {
                      setSearchTerm("")
                      setSelectedStatus("all")
                      setCurrentPage(1) // Reset to first page on clear
                    }}
                    className="text-teal-600 hover:text-teal-700 font-medium text-sm"
                  >
                    Clear all filters
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Campaigns