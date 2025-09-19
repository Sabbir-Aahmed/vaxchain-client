import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa"

const Footer = () => {
  return (
    <footer className="bg-card bg-teal-50 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <FaMapMarkerAlt className="text-teal-500 w-5 h-5 flex-shrink-0" />
                <span className="text-muted-foreground text-sm">
                  123 VaxChain Ave
                  <br />
                  Medical District, MD 12345
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <FaPhone className="text-teal-500 w-5 h-5 flex-shrink-0" />
                <span className="text-muted-foreground text-sm">+880 199 519-3272</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-teal-500 w-5 h-5 flex-shrink-0" />
                <span className="text-muted-foreground text-sm">mdsabbir5820@.com</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-muted-foreground hover:text-teal-500 transition-colors text-sm">
                  Emergency Care
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-teal-500 transition-colors text-sm">
                  Telehealth Services
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-teal-500 transition-colors text-sm">
                  Wellness Programs
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-teal-500 transition-colors text-sm">
                  Preventive Care
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-teal-500 transition-colors text-sm">
                  Specialist Consultations
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-muted-foreground hover:text-teal-500 transition-colors text-sm">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-teal-500 transition-colors text-sm">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-teal-500 transition-colors text-sm">
                  Doctors
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-teal-500 transition-colors text-sm">
                  Campaign
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-teal-500 transition-colors text-sm">
                  Appointments
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter & Social */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">Stay Connected</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Subscribe to our newsletter for health tips and updates.
            </p>
            <div className="flex flex-col space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-teal-500 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">V</span>
              </div>
              <span className="text-lg font-semibold text-teal-600">VaxChain</span>
            </div>

            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <div className="flex space-x-4 text-sm">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Cookie Policy
                </a>
              </div>
              <p className="text-muted-foreground text-sm">© 2024 VaxChain. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
