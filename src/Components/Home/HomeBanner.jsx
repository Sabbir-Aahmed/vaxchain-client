import { FaCalendarAlt, FaUserMd } from "react-icons/fa";
import vaccinImg from "../../assets/vaccin2.jpg"
const HomeBanner = () => {
  return (
    <div className="relative bg-gradient-to-br from-cyan-100 via-teal-50 to-blue-100 min-h-[500px] overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-10 right-20 w-20 h-20 opacity-30">
        <div className="grid grid-cols-4 gap-1">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="w-2 h-2 bg-teal-400 rounded-full"></div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-20 left-10 w-16 h-16 opacity-20">
        <div className="grid grid-cols-4 gap-1">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
          ))}
        </div>
      </div>

      {/* Medical Icons */}
      <div className="absolute top-16 left-1/3 text-teal-300 opacity-40">
        <FaCalendarAlt size={24} />
      </div>

      <div className="absolute bottom-32 right-32 text-cyan-300 opacity-40">
        <FaUserMd size={28} />
      </div>

      <div className="container mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          {/* Left Content */}
          <div className="lg:w-1/2 mb-8 lg:mb-0">
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-4 leading-tight">
              Building a Healthier Tomorrow
            </h1>
            <h2 className="text-3xl lg:text-4xl font-semibold text-teal-500 mb-6 leading-tight">
              Manage, track, and protect your health with VaxChain
            </h2>
            

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-full font-medium transition-colors duration-200">
                Get appointment
              </button>
              <button className="border-2 border-slate-300 hover:border-slate-400 text-slate-700 px-8 py-3 rounded-full font-medium transition-colors duration-200 bg-white/50">
                Specialists
              </button>
            </div>
          </div>

          {/* Right Content - Doctor Image */}
          <div className="relative aspect-auto max-w-xs lg:max-w-sm mx-auto">
            
            <img
              src={vaccinImg}
              alt="vaccin img"
              className="z-10 w-full h-full object-contain rounded-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeBanner;
