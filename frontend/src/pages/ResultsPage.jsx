import { useEffect, useMemo, useState } from "react"
import { useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Filter, BadgeCheck, AlertCircle } from "lucide-react"
import CompanyTile from "../components/CompanyTile"

function useQuery() {
  const { search } = useLocation()
  return useMemo(() => new URLSearchParams(search), [search])
}

export default function ResultsPage() {
  const q = useQuery()
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [certFilter, setCertFilter] = useState("all")

  // Weights
  const [weights, setWeights] = useState({
    emissions: 0.4,
    certification: 0.3,
    netzero: 0.3,
  })

  useEffect(() => {
    const token = q.get("token")
    const industry = q.get("industry")
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        let url = null
        if (token) url = `http://localhost:5000/api/results?token=${token}`
        else if (industry) url = `http://localhost:5000/api/results/industry?industry=${encodeURIComponent(industry)}`
        if (!url) {
          setError("Missing token or industry.")
          setSuppliers([])
          return
        }
        const res = await fetch(url)
        const data = await res.json()
        if (data.suppliers && Array.isArray(data.suppliers)) {
          setSuppliers(data.suppliers)
        } else {
          setError(data.error || "No suppliers found.")
          setSuppliers([])
        }
      } catch (e) {
        console.error(e)
        setError("Failed to fetch results.")
        setSuppliers([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [q])

  // Calculate normalized sustainability scores
const enrichedSuppliers = useMemo(() => {
  if (!suppliers.length) return []

  // --- Emissions per revenue ---
  const emissionsPerRevenue = suppliers.map(c =>
    (Number(c.emissions_ton) || 0) / Math.max(Number(c.revenue_musd) || 1, 1)
  )
  const minE = Math.min(...emissionsPerRevenue)
  const maxE = Math.max(...emissionsPerRevenue)

  // --- Net Zero Duration ---
  const durations = suppliers
    .map(c => {
      const base = Number(c.base_year)
      const target = Number(c.target_year)
      return target && base && target > base ? target - base : null
    })
    .filter(d => d !== null)

  const minDur = durations.length ? Math.min(...durations) : 0
  const maxDur = durations.length ? Math.max(...durations) : 1

  // --- Num Target Types ---
  const targetTypes = suppliers.map(c => Number(c.num_target_types) || 0)
  const minT = Math.min(...targetTypes)
  const maxT = Math.max(...targetTypes)

  return suppliers.map(c => {
    // Emission score
    const epr = (Number(c.emissions_ton) || 0) / Math.max(Number(c.revenue_musd) || 1, 1)
    const emissionScore = maxE > minE ? 1 - (epr - minE) / (maxE - minE) : 1

    // Certification score
    const certificationScore = c.certified ? 1 : 0

    // Net zero score
    const base = Number(c.base_year)
    const target = Number(c.target_year)

    let durScore = null
    if (target && base && target > base) {
      const duration = target - base
      durScore = maxDur > minDur ? 1 - (duration - minDur) / (maxDur - minDur) : 1
    }

    const tTypes = Number(c.num_target_types) || 0
    const typeScore = maxT > minT ? (tTypes - minT) / (maxT - minT) : 0

    let netZeroScore
    if (durScore === null) {
      // Choice: penalize, neutral, or ignore
      netZeroScore = 0.5 * 0 + 0.5 * typeScore // penalize missing years
      // netZeroScore = 0.5 * 1 + 0.5 * typeScore // neutral
      // netZeroScore = typeScore                 // ignore duration
    } else {
      netZeroScore = 0.5 * durScore + 0.5 * typeScore
    }

    // Combine scores with weights
    const sum_weights = weights.certification + weights.emissions + weights.netzero
    const sustainability =
      emissionScore * weights.emissions / sum_weights +
      certificationScore * weights.certification / sum_weights +
      netZeroScore * weights.netzero / sum_weights

    return {
      ...c,
      emissionScore,
      certificationScore,
      netZeroScore,
      sustainability,
    }
  })
}, [suppliers, weights])



  const filteredAll = enrichedSuppliers.filter(c => {
    if (certFilter === "certified") return c.certified === true
    if (certFilter === "not_certified") return c.certified === false
    return true
  })

  const filteredTop10 = [...filteredAll]
    .sort((a, b) => (b.sustainability || 0) - (a.sustainability || 0))
    .slice(0, 10)

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-indigo-50 to-emerald-50">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="flex items-start md:items-center justify-between gap-6 flex-col md:flex-row"
        >
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">
              Supplier <span className="text-indigo-600">Rankings</span>
            </h1>
            <p className="text-gray-600 mt-2">
              Adjust weights & filters to explore detailed dashboards for each supplier.
            </p>
          </div>
          <div className="bg-white/70 backdrop-blur border border-indigo-100 rounded-2xl shadow px-4 py-3">
            <div className="flex items-center gap-2 text-indigo-700">
              <BadgeCheck size={18} />
              <span className="text-sm">Ranked by Sustainability Score</span>
            </div>
          </div>
        </motion.div>

        {/* Filter + Weights Bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.4 }}
          className="mt-8 bg-white/70 backdrop-blur border border-gray-100 rounded-2xl shadow-lg p-5"
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-gray-700 font-semibold">
              <Filter size={18} /> Filters
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-700">Certification</label>
                <select
                  value={certFilter}
                  onChange={(e) => setCertFilter(e.target.value)}
                  className="px-4 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Companies</option>
                  <option value="certified">Certified Only</option>
                  <option value="not_certified">Not Certified Only</option>
                </select>
              </div>
            </div>

            {/* Weight sliders */}
            <div className="grid md:grid-cols-3 gap-4">
              {["emissions", "certification", "netzero"].map((key) => (
                <div key={key}>
                  <label className="text-sm font-medium capitalize">
                    {key} Weight: {weights[key].toFixed(2)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={weights[key]}
                    onChange={(e) =>
                      setWeights({ ...weights, [key]: parseFloat(e.target.value) })
                    }
                    className="w-full accent-indigo-600"
                  />
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* States */}
        {loading && (
          <div className="flex items-center gap-2 text-gray-700 mt-6">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4A4 4 0 004 12z"
              />
            </svg>
            Loading results…
          </div>
        )}
        {!loading && error && (
          <div className="flex items-center gap-3 text-red-600 mt-6">
            <AlertCircle size={18} />
            {error}
          </div>
        )}
        {!loading && !error && !suppliers.length && (
          <div className="text-gray-700 mt-6">No suppliers found.</div>
        )}

        {/* Top 10 */}
        {!loading && !error && suppliers.length > 0 && (
          <>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="text-xl font-semibold mt-10 mb-4"
            >
              Top 10 (Highest Sustainability Scores)
            </motion.h2>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.04 } },
              }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {filteredTop10.map((c, i) => (
                  <motion.div
                    key={`${c.company}-${i}`}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 16 }}
                    transition={{ duration: 0.35 }}
                  >
                    <CompanyTile company={c} allCompanies={filteredAll} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Full rankings */}
            <details className="mt-10 group">
              <summary className="cursor-pointer text-indigo-700 font-semibold group-open:text-indigo-900">
                View Full Rankings
              </summary>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                {filteredAll
                  .sort((a, b) => (b.sustainability || 0) - (a.sustainability || 0))
                  .map((c, i) => (
                    <CompanyTile
                      key={`${c.company}-full-${i}`}
                      company={c}
                      allCompanies={filteredAll}
                    />
                  ))}
              </div>
            </details>
          </>
        )}
      </div>
    </div>
  )
}
