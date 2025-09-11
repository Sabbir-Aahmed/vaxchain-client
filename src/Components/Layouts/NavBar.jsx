"use client"

import { useState } from "react"
import { FaUser, FaChevronDown, FaTh, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa"
import { MdDashboardCustomize } from "react-icons/md"

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen)
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-teal-400 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">V</span>
              </div>
              <span className="text-xl font-bold text-teal-400">VaxChain</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <ul className="flex items-baseline space-x-8">
                <li className="text-teal-500 hover:text-cyan-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-gray-50">
                    Home
                </li>
                <li className="text-gray-700 hover:text-cyan-500 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-gray-50">
                    About Us
                </li>
                <li className="text-gray-700 hover:text-cyan-500 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-gray-50">
                    Campaigns
                </li>
                <li className="text-gray-700 hover:text-cyan-500 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-gray-50">
                    Doctors
                </li>
                
              </ul>
            </div>
          </div>

          {/* Desktop Profile Dropdown */}
          <div className="hidden md:block relative">
            <button
              onClick={toggleProfile}
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-teal-400 hover:bg-gray-50 transition-colors duration-200"
            >
              <FaUser className="h-5 w-5 mr-1" />
              Profile
              <FaChevronDown className="h-4 w-4 ml-1" />
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <div className="py-1">
                  <a
                    href="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-teal-500"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <FaUser className="mr-3 h-4 w-4" />
                    Profile
                  </a>
                  <a
                    href="/dashboard"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-teal-500"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <MdDashboardCustomize className="mr-3 h-4 w-4" />
                    Dashboard
                  </a>
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <FaSignOutAlt className="mr-3 h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu button - Toggler */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-cyan-600 hover:bg-gray-50 transition-colors duration-200"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200 bg-white">
              <ul className="space-y-1">
                <li
                  className="text-teal-500 hover:text-teal-400 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                    Home
                </li>
                <li
                  className="text-gray-700 hover:text-teal-400 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                    About Us
                </li>
                <li
                  className="text-gray-700 hover:text-cyan-400 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                    Campaigns
                </li>
                <li
                  className="text-gray-700 hover:text-cyan-400 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                    Doctors
                </li>
                
              </ul>

              {/* Mobile Profile Options */}
              <div className="border-t border-gray-200 pt-4 pb-3">
                <div className="flex items-center px-3">
                  <div className="flex-shrink-0">
                    <FaUser className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-700">Profile</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <a
                    href="/dashboard"
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-teal-500 hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <MdDashboardCustomize className="mr-3 h-5 w-5" />
                    Dashboard
                  </a>
                  <button
                    className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FaSignOutAlt className="mr-3 h-5 w-5" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar