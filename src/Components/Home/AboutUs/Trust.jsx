import { FaUserMd, FaHeart, FaStar } from "react-icons/fa"

const Trust = () => {
  const stats = [
    { number: "10,000+", label: "Vaccinations Managed" },
    { number: "500+", label: "Healthcare Providers" },
    { number: "50+", label: "Cities Covered" },
  ]

  const testimonials = [
    {
      text: "VaxChain has transformed how we manage our vaccination campaigns. The platform is intuitive and has significantly improved our efficiency.",
      author: "Dr. Sarah Johnson",
      role: "Community Health Center",
      icon: FaUserMd,
    },
    {
      text: "Booking my vaccination was so easy with VaxChain. The reminders helped me stay on track with my immunization schedule.",
      author: "Maria Rodriguez",
      role: "Patient",
      icon: FaHeart,
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-teal-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-800 mb-4">Trusted by Healthcare Professionals</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto text-pretty">
            Join thousands of healthcare providers and patients who trust VaxChain
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold text-teal-500 mb-2">{stat.number}</div>
              <p className="text-slate-600">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 justify-items-center gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-lg text-center md:text-left">
              <div className="flex justify-center md:justify-start items-center mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FaStar key={i} className="text-yellow-400" size={20} />
                ))}
              </div>
              <p className="text-slate-600 mb-6 text-pretty">{testimonial.text}</p>
              
              <div className="flex flex-col md:flex-row items-center md:items-start gap-4 justify-center md:justify-start">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                  <testimonial.icon className="text-teal-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{testimonial.author}</p>
                  <p className="text-slate-500 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Trust
