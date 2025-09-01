import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BadgeCheck, XCircle } from "lucide-react"
import CompanyDashboard from "./CompanyDashboard"

export default function CompanyTile({ company, allCompanies }) {
  const [open, setOpen] = useState(false)

  const CertifiedBadge = () => (
    company.certified ? (
      <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full text-xs font-medium">
        <BadgeCheck size={14} /> Certified
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 text-red-600 bg-red-100 px-2.5 py-1 rounded-full text-xs font-medium">
        <XCircle size={14} /> Not Certified
      </span>
    )
  )

  return (
    <>
      <motion.div
        whileHover={{ y: -3 }}
        className="relative bg-white/80 backdrop-blur border border-gray-100 rounded-2xl shadow hover:shadow-xl transition overflow-hidden"
      >
        <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-indigo-500 via-emerald-500 to-cyan-500" />
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-bold tracking-tight">{company.company}</h3>
            <CertifiedBadge />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <div className="bg-indigo-50 rounded-xl p-3">
              <div className="text-xs text-indigo-800">Revenue</div>
              <div className="font-semibold">${company.revenue_musd} M</div>
            </div>
            <div className="bg-emerald-50 rounded-xl p-3">
              <div className="text-xs text-emerald-800">Emissions</div>
              <div className="font-semibold">{company.emissions_ton} tons</div>
            </div>
            <div className="bg-cyan-50 rounded-xl p-3">
              <div className="text-xs text-cyan-800">Net-zero Target</div>
              <div className="font-semibold">{company.target_year ?? "N/A"}</div>
            </div>
            {/* 🔹 Sustainability Score */}
            <div className="bg-purple-50 rounded-xl p-3">
              <div className="text-xs text-purple-800">Sustainability</div>
              <div className="font-semibold">
                {company.sustainability !== undefined
                  ? company.sustainability.toFixed(3)
                  : "N/A"}
              </div>
            </div>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition shadow"
          >
            View Dashboard
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          >
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 220, damping: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-[95%] max-w-5xl max-h-[92vh] overflow-y-auto"
            >
              <div className="sticky top-0 z-10 bg-white/70 backdrop-blur border-b border-gray-100 px-5 py-3 flex justify-end">
                <button
                  onClick={() => setOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-gray-900 text-white text-sm hover:bg-black"
                >
                  Close
                </button>
              </div>
              <div className="p-6">
                <CompanyDashboard company={company} allCompanies={allCompanies} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
