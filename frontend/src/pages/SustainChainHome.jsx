import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Building2, UploadCloud } from "lucide-react"

export default function SustainChainHome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
            <Building2 size={16} /> SustainChain Platform
          </div>
          <h1 className="mt-6 text-4xl md:text-5xl font-extrabold tracking-tight">
            Start Your <span className="text-indigo-600">Sustainability Journey</span>
          </h1>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Choose your industry to explore existing datasets, or upload your own CSV to analyze your supplier network.
          </p>
        </motion.div>

        {/* Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mt-16 grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
        >
          {/* Industry Selection */}
          <Link
            to="/sustainchain/industry"
            className="group relative rounded-2xl bg-white/80 backdrop-blur border border-gray-100 shadow-lg hover:shadow-2xl transition p-8 flex flex-col items-center text-center"
          >
            <div className="h-14 w-14 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition">
              <Building2 size={26} />
            </div>
            <h2 className="text-xl font-bold">Select Industry</h2>
            <p className="text-gray-600 mt-2">
              Browse preloaded supplier datasets for sectors like chemical, pharma, construction, and more.
            </p>
          </Link>

          {/* Upload CSV */}
          <Link
            to="/sustainchain/upload"
            className="group relative rounded-2xl bg-white/80 backdrop-blur border border-gray-100 shadow-lg hover:shadow-2xl transition p-8 flex flex-col items-center text-center"
          >
            <div className="h-14 w-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition">
              <UploadCloud size={26} />
            </div>
            <h2 className="text-xl font-bold">Upload CSV</h2>
            <p className="text-gray-600 mt-2">
              Import your own supplier CSV to get instant analysis, rankings, and dashboards.
            </p>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
