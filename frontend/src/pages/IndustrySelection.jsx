import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Building2, ChevronRight, UploadCloud, ChevronDown } from "lucide-react"
import { Listbox } from "@headlessui/react"

const OPTIONS = [
  "Aerospace and Defense",
  "Air Freight Transportation and Logistics",
  "Air Transportation - Airlines",
  "Air Transportation - Airport Services",
  "Automobiles and Components",
  "Banks, Diverse Financials, Insurance",
  "Building Products",
  "Chemicals",
  "Construction Materials",
  "Construction and Engineering",
  "Construction and materials",
  "Consumer Durables, Household and Personal Products",
  "Containers and Packaging",
  "Education Services",
  "Electric Utilities and Independent Power Producers and Energy Traders (including fossil, alternative and nuclear energy)",
  "Electrical Equipment and Machinery",
  "Food Production - Agricultural Production",
  "Food Production - Animal Source Food Production",
  "Food and Beverage Processing",
  "Food and Staples Retailing",
  "Forest and Paper Products - Forestry, Timber, Pulp and Paper, Rubber",
  "Ground Transportation - Highways and Railtracks",
  "Ground Transportation - Railroads Transportation",
  "Ground Transportation - Trucking Transportation",
  "Healthcare Equipment and Supplies",
  "Healthcare Providers and Services, and Healthcare Technology",
  "Homebuilding",
  "Hotels, Restaurants and Leisure, and Tourism Services",
  "Media",
  "Mining - Iron, Aluminum, Other Metals",
  "Mining - Other (Rare Minerals, Precious Metals and Gems)",
  "Mining-iron, aluminium, other metals",
  "Pharmaceuticals, Biotechnology and Life Sciences",
  "Professional Services",
  "Real Estate",
  "Retailing",
  "Semiconductors and Semiconductors Equipment",
  "Software and Services",
  "Solid Waste Management Utilities",
  "Specialized Consumer Services",
  "Specialized Financial Services, Consumer Finance, Insurance Brokerage Firms",
  "Technology Hardware and Equipment",
  "Telecommunication Services",
  "Textile Manufacturing, Spinning, Weaving & Apparel",
  "Textiles, Apparel, Footwear and Luxury Goods",
  "Tires",
  "Tobacco",
  "Trading Companies and Distributors, and Commercial Services and Supplies",
  "Water Transportation - Ports and Services",
  "Water Transportation - Water Transportation",
  "Water Utilities",
  "unlisted"
]

export default function IndustrySelection() {
  const [industry, setIndustry] = useState(OPTIONS[0])
  const navigate = useNavigate()

  const handleGo = () => {
    if (!industry) return
    navigate(`/sustainchain/results?industry=${encodeURIComponent(industry)}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium">
            <Building2 size={16} /> SustainChain
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mt-4">
            Select Your <span className="text-indigo-600">Industry</span>
          </h1>
          <p className="text-gray-600 mt-3">
            We’ll load a curated dataset and rank suppliers instantly.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="max-w-2xl mx-auto bg-white/70 backdrop-blur border border-indigo-100 shadow-xl rounded-2xl p-6"
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Choose an industry
          </label>
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            
            {/* HeadlessUI Listbox */}
            <Listbox value={industry} onChange={setIndustry}>
              <div className="relative w-full max-w-md">
                <Listbox.Button className="w-full flex justify-between items-center px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-left">
                  <span className="truncate">{industry}</span>
                  <ChevronDown className="ml-2 text-gray-500" size={18} />
                </Listbox.Button>
                <Listbox.Options className="absolute mt-2 w-full max-h-60 overflow-auto rounded-xl border border-gray-200 bg-white shadow-lg z-50">
                  {OPTIONS.map((o) => (
                    <Listbox.Option
                      key={o}
                      value={o}
                      className="cursor-pointer px-4 py-2 hover:bg-indigo-50"
                    >
                      {o}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </Listbox>

            <button
              onClick={handleGo}
              className="shrink-0 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition shadow-lg"
            >
              Continue <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-12 text-center text-sm text-gray-500"
        >
          Or{" "}
          <Link
            to="/sustainchain/upload"
            className="text-emerald-600 hover:underline inline-flex items-center gap-1"
          >
            <UploadCloud size={14} /> Upload your own CSV
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
