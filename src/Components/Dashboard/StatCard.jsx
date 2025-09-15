import { FaArrowUp, FaArrowDown } from "react-icons/fa"

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  changeType = 'positive', 
  subtitle,
  color = 'teal',
  loading = false 
}) => {
  const colorClasses = {
    teal: {
      bg: 'from-teal-500 to-cyan-500',
      text: 'text-teal-600',
      bgLight: 'bg-teal-50',
      border: 'border-teal-200'
    },
    blue: {
      bg: 'from-blue-500 to-indigo-500',
      text: 'text-blue-600',
      bgLight: 'bg-blue-50',
      border: 'border-blue-200'
    },
    green: {
      bg: 'from-green-500 to-emerald-500',
      text: 'text-green-600',
      bgLight: 'bg-green-50',
      border: 'border-green-200'
    },
    purple: {
      bg: 'from-purple-500 to-pink-500',
      text: 'text-purple-600',
      bgLight: 'bg-purple-50',
      border: 'border-purple-200'
    },
    orange: {
      bg: 'from-orange-500 to-red-500',
      text: 'text-orange-600',
      bgLight: 'bg-orange-50',
      border: 'border-orange-200'
    }
  }

  const colors = colorClasses[color] || colorClasses.teal

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 animate-pulse">
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
          <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border ${colors.border} group overflow-hidden relative`}>
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
        <div className={`w-full h-full bg-gradient-to-br ${colors.bg} rounded-full transform translate-x-16 -translate-y-16`}></div>
      </div>

      <div className="p-6 relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* Title */}
            <h3 className="text-sm font-medium text-gray-600 mb-2">
              {title}
            </h3>
            
            {/* Value */}
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-3xl font-bold text-gray-900">
                {value?.toLocaleString() || '0'}
              </span>
              {change && (
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
                  ${changeType === 'positive' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                  }`}>
                  {changeType === 'positive' ? (
                    <FaArrowUp className="w-3 h-3" />
                  ) : (
                    <FaArrowDown className="w-3 h-3" />
                  )}
                  {Math.abs(change)}%
                </div>
              )}
            </div>

            {/* Subtitle */}
            {subtitle && (
              <p className="text-sm text-gray-500">
                {subtitle}
              </p>
            )}
          </div>

          {/* Icon */}
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors.bg} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Progress Bar (optional) */}
        {change && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
              <span>Progress</span>
              <span>{Math.abs(change)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className={`h-1.5 rounded-full bg-gradient-to-r ${colors.bg} transition-all duration-500`}
                style={{ width: `${Math.min(Math.abs(change), 100)}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default StatCard