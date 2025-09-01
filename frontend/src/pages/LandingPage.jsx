import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Leaf } from "lucide-react"

export default function LandingPage() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50 flex items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
            <Leaf size={16} /> Welcome to SustainChain
          </div>
          <h1 className="mt-6 text-5xl md:text-6xl font-extrabold tracking-tight">
            Smarter <span className="text-indigo-600">Supply Chains</span>,  
            <br />
            Cleaner <span className="text-emerald-600">Future</span>
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
            Discover sustainable suppliers, reduce emissions, and take your company closer to net-zero goals.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/sustainchain"
              className="px-8 py-4 rounded-2xl bg-indigo-600 text-white font-semibold shadow-lg hover:bg-indigo-700 transition"
            >
              Explore SustainChain
            </Link>
            <Link
              to="/freshbites"
              className="px-8 py-4 rounded-2xl bg-white/80 backdrop-blur border border-gray-200 text-gray-700 font-semibold shadow hover:shadow-lg transition"
            >
              Visit FreshBites Case
            </Link>
          </div>
        </motion.div>
      </div>

      {/* About Us Section - Positioned below */}
      <div id="about-us" className="bg-white py-16 mt-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-extrabold text-center text-indigo-600">About Us</h2>
          <p className="mt-4 text-lg text-center text-gray-700">
            We are committed to making sustainability accessible to every business, 
            empowering them to take steps towards a greener future. Our platform offers 
            data-driven insights and tools to help companies reduce their carbon footprint.
          </p>
        </div>
      </div>
    </>
  )
}
