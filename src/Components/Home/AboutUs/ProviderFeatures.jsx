import { FaCalendarCheck, FaUsers, FaChartLine } from "react-icons/fa"

const ProviderFeatures = () => {
  const features = [
    {
      icon: FaCalendarCheck,
      title: "Campaign Management",
      description:
        "Organize and manage vaccination campaigns with ease. Schedule, track, and monitor your vaccination programs.",
    },
    {
      icon: FaUsers,
      title: "Patient Management",
      description:
        "Keep track of patient records, vaccination history, and appointment schedules in one centralized system.",
    },
    {
      icon: FaChartLine,
      title: "Analytics & Reporting",
      description:
        "Generate comprehensive reports and analytics to track vaccination progress and campaign effectiveness.",
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-r from-teal-50 to-cyan-50">
      <div className="container mx-auto px-6">
        <div className="text-center md:text-left mb-16">
          <h2 className="text-4xl font-bold text-slate-800 mb-4">For Healthcare Providers</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto text-pretty">
            Streamline your vaccination campaigns with powerful management tools
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl text-center md:text-left shadow-lg hover:shadow-xl transition-shadow duration-300 group"
            >
              <div className="text-teal-500 mb-6 group-hover:scale-110 transition-transform duration-300 flex justify-center md:justify-start">
                <feature.icon size={48} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">{feature.title}</h3>
              <p className="text-slate-600 text-pretty">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProviderFeatures
