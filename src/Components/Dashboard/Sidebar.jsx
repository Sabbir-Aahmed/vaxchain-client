import { FaPlus, FaCreditCard, FaCalendarCheck, FaStar, FaHome, FaChartBar } from "react-icons/fa"
import { Link, useLocation } from "react-router"

const Sidebar = () => {
  const location = useLocation()
  
  const menuItems = [
    { 
      id: 'overview', 
      label: 'Dashboard Overview', 
      icon: FaHome, 
      path: '/dashboard',
      description: 'Main dashboard view'
    },
    { 
      id: 'campaigns', 
      label: 'Create Campaigns', 
      icon: FaPlus, 
      path: '/dashboard/campaigns',
      description: 'Manage vaccination campaigns'
    },
    { 
      id: 'payment', 
      label: 'Payment', 
      icon: FaCreditCard, 
      path: '/dashboard/payment',
      description: 'Payment processing'
    },
    { 
      id: 'bookings', 
      label: 'Bookings', 
      icon: FaCalendarCheck, 
      path: '/dashboard/bookings',
      description: 'Manage bookings'
    },
    { 
      id: 'reviews', 
      label: 'Reviews', 
      icon: FaStar, 
      path: '/dashboard/reviews',
      description: 'Customer reviews'
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: FaChartBar, 
      path: '/dashboard/analytics',
      description: 'Performance insights'
    }
  ]

  const isActiveRoute = (path) => {
    return location.pathname === path || 
           (path === '/dashboard' && location.pathname === '/dashboard')
  }

  return (
    <div className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white h-screen fixed left-0 top-0 shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
          VaxChain Dashboard
        </h1>
        <p className="text-slate-400 text-sm mt-1">Healthcare Management</p>
      </div>

      {/* Navigation Menu */}
      <nav className="mt-6 px-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = isActiveRoute(item.path)
            
            return (
              <li key={item.id}>
                <Link
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                    group hover:bg-slate-700/50 relative
                    ${isActive 
                      ? 'bg-gradient-to-r from-teal-600 to-cyan-600 shadow-lg shadow-teal-500/25' 
                      : 'hover:translate-x-1'
                    }
                  `}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-0 w-1 h-full bg-teal-400 rounded-r-full"></div>
                  )}
                  
                  <Icon className={`
                    w-5 h-5 transition-colors duration-200
                    ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-teal-400'}
                  `} />
                  
                  <div className="flex-1">
                    <span className={`
                      font-medium transition-colors duration-200
                      ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}
                    `}>
                      {item.label}
                    </span>
                    <p className={`
                      text-xs mt-0.5 transition-colors duration-200
                      ${isActive ? 'text-slate-200' : 'text-slate-500 group-hover:text-slate-400'}
                    `}>
                      {item.description}
                    </p>
                  </div>
                  
                  {isActive && (
                    <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-700">
        <div className="bg-gradient-to-r from-teal-600/20 to-cyan-600/20 rounded-xl p-4 border border-teal-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">VX</span>
            </div>
            <div>
              <p className="text-sm font-medium text-white">Admin User</p>
              <p className="text-xs text-slate-400">Healthcare Provider</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar