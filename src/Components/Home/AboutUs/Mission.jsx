import { FaShieldAlt } from "react-icons/fa"

const Mission = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <FaShieldAlt className="text-5xl text-teal-500 mx-auto mb-6" />
          </div>
          <h2 className="text-4xl font-bold text-slate-800 mb-8">Our Mission</h2>
          <p className="text-xl text-slate-600 leading-relaxed text-pretty">
            VaxChain is dedicated to revolutionizing vaccination management by providing a comprehensive platform that
            connects healthcare providers and patients. We believe in making vaccination accessible, efficient, and
            transparent for everyone in the community.
          </p>
        </div>
      </div>
    </section>
  )
}

export default Mission
