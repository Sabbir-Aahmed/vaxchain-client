import { FaArrowLeft, FaArrowRight, FaEllipsisH } from "react-icons/fa"

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  className = "",
  showPageNumbers = true,
  maxVisiblePages = 5
}) => {
  if (totalPages <= 1) return null

  const handlePrevious = (e) => {
    e.preventDefault()
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = (e) => {
    e.preventDefault()
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  const handlePageClick = (page, e) => {
    e.preventDefault()
    if (page !== currentPage) {
      onPageChange(page)
    }
  }

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = []
    const half = Math.floor(maxVisiblePages / 2)
    
    let start = Math.max(1, currentPage - half)
    let end = Math.min(totalPages, start + maxVisiblePages - 1)
    
    // Adjust start if we're near the end
    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1)
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    
    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className="flex items-center gap-2">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white rounded-xl disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200"
        >
          <FaArrowLeft className="w-4 h-4" />
          Previous
        </button>

        {showPageNumbers && (
          <div className="flex items-center gap-1 mx-2">
            {/* First page */}
            {!pageNumbers.includes(1) && (
              <>
                <button
                  onClick={(e) => handlePageClick(1, e)}
                  className="px-3 py-2 text-slate-600 hover:text-teal-600 font-medium transition-all duration-200"
                >
                  1
                </button>
                {!pageNumbers.includes(2) && (
                  <FaEllipsisH className="text-slate-400 mx-1" />
                )}
              </>
            )}

            {/* Page numbers */}
            {pageNumbers.map(page => (
              <button
                key={page}
                onClick={(e) => handlePageClick(page, e)}
                className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 min-w-[40px] ${
                  page === currentPage
                    ? 'bg-teal-500 text-white shadow-md'
                    : 'text-slate-600 hover:text-teal-600 hover:bg-teal-50'
                }`}
              >
                {page}
              </button>
            ))}

            {/* Last page */}
            {!pageNumbers.includes(totalPages) && (
              <>
                {!pageNumbers.includes(totalPages - 1) && (
                  <FaEllipsisH className="text-slate-400 mx-1" />
                )}
                <button
                  onClick={(e) => handlePageClick(totalPages, e)}
                  className="px-3 py-2 text-slate-600 hover:text-teal-600 font-medium transition-all duration-200"
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>
        )}

        {/* Show page info when page numbers are hidden */}
        {!showPageNumbers && (
          <span className="text-slate-600 mx-4 font-medium">
            Page {currentPage} of {totalPages}
          </span>
        )}

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white rounded-xl disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200"
        >
          Next
          <FaArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default Pagination