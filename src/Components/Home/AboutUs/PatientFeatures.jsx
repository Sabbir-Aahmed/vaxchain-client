import { FaMobile, FaBell, FaHistory } from "react-icons/fa"
import patientMobileImg from "../../../assets/patient.jpg"

const PatientFeatures = () => {
  const features = [
    {
      icon: FaMobile,
      title: "Easy Booking",
      description:
        "Book vaccination appointments with just a few clicks. Find available slots and secure your spot instantly.",
    },
    {
      icon: FaBell,
      title: "Smart Reminders",
      description: "Never miss a vaccination with automated reminders and notifications about upcoming appointments.",
    },
    {
      icon: FaHistory,
      title: "Vaccination History",
      description:
        "Access your complete vaccination history and certificates anytime, anywhere through your personal dashboard.",
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-800 mb-4">For Patients</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto text-pretty">
            Simple, convenient vaccination booking and management
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-6">
                <div className="bg-teal-100 p-4 rounded-full">
                  <feature.icon className="text-teal-600" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{feature.title}</h3>
                  <p className="text-slate-600 text-pretty">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-teal-200/30 to-cyan-300/30 rounded-3xl p-8">
              <img
                src={patientMobileImg}
                alt="Patient using VaxChain mobile app"
                className="w-full h-auto rounded-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PatientFeatures
