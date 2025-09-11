const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-cyan-100 via-teal-50 to-blue-100 py-20 overflow-hidden">
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

      <div className="container mx-auto px-6 text-center">
        <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-6 text-balance">
          About <span className="text-teal-500">VaxChain</span>
        </h1>
        <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto text-pretty">
          Empowering Communities Through Seamless Vaccination Management
        </p>
      </div>
    </section>
  )
}

export default Hero
