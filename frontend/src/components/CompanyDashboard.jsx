import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,   // needed for combined chart
  Line             // needed for line overlay
} from "recharts"

import { Factory, Leaf, Target, Trophy, Star } from "lucide-react"

export default function CompanyDashboard({ company, allCompanies }) {
  // Averages
  const avgEmissions =
    allCompanies.reduce((s, c) => s + (Number(c.emissions_ton) || 0), 0) /
    Math.max(allCompanies.length, 1)

  const avgRevenue =
    allCompanies.reduce((s, c) => s + (Number(c.revenue_musd) || 0), 0) /
    Math.max(allCompanies.length, 1)

  const avgSustainability =
    allCompanies.reduce((s, c) => s + (Number(c.sustainability) || 0), 0) /
    Math.max(allCompanies.length, 1)

  // Comparisons
  const emissionsDeltaPct = avgEmissions
    ? (((Number(company.emissions_ton) || 0) - avgEmissions) / avgEmissions) * 100
    : 0

  const revenueDeltaPct = avgRevenue
    ? (((Number(company.revenue_musd) || 0) - avgRevenue) / avgRevenue) * 100
    : 0

  // Sustainability ranking
  const sortedBySustainability = [...allCompanies].sort(
    (a, b) => (Number(b.sustainability) || 0) - (Number(a.sustainability) || 0)
  )
  const sustainRank = sortedBySustainability.findIndex(c => c.company === company.company) + 1

  // Chart data
  const chartData = [
    {
      name: "This Company",
      emissions: Number(company.emissions_ton) || 0,
      revenue: Number(company.revenue_musd) || 0,
    },
    {
      name: "Industry Avg",
      emissions: avgEmissions || 0,
      revenue: avgRevenue || 0,
    },
  ]

  // Breakdown for sustainability radar
  const scoreBreakdown = [
    {
      metric: "Emissions Efficiency",
      score: Number(company.emissionScore) || 0,
    },
    {
      metric: "Certification",
      score: Number(company.certificationScore) || 0,
    },
    {
      metric: "Net-zero Target",
      score: Number(company.netZeroScore) || 0,
    },
  ]

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
          {company.company} <span className="text-indigo-600">Dashboard</span>
        </h2>
        <p className="text-gray-600 mt-1">
          Detail view with comparison vs sector averages.
        </p>
      </div>

      {/* Highlight Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Revenue */}
        <div className="rounded-2xl border border-gray-100 bg-white/80 backdrop-blur p-4">
          <div className="flex items-center gap-3 text-gray-700">
            <Factory size={18} /><span className="text-sm">Revenue</span>
          </div>
          <div className="text-xl font-bold mt-1">${Number(company.revenue_musd) || 0} M</div>
          <div className="text-xs text-gray-500 mt-1">
            {Math.abs(revenueDeltaPct).toFixed(1)}% {revenueDeltaPct < 0 ? "below" : "above"} industry avg
          </div>
        </div>

        {/* Emissions */}
        <div className="rounded-2xl border border-gray-100 bg-white/80 backdrop-blur p-4">
          <div className="flex items-center gap-3 text-gray-700">
            <Leaf size={18} /><span className="text-sm">Emissions</span>
          </div>
          <div className="text-xl font-bold mt-1">{Number(company.emissions_ton) || 0} tons</div>
          <div className="text-xs text-gray-500 mt-1">
            {Math.abs(emissionsDeltaPct).toFixed(1)}% {emissionsDeltaPct < 0 ? "lower" : "higher"} than avg
          </div>
        </div>

        {/* Net-zero Target */}
        <div className="rounded-2xl border border-gray-100 bg-white/80 backdrop-blur p-4">
          <div className="flex items-center gap-3 text-gray-700">
            <Target size={18} /><span className="text-sm">Net-zero Target</span>
          </div>
          <div className="text-xl font-bold mt-1">{company.target_year ?? "N/A"}</div>
          <div className="text-xs text-gray-500 mt-1">
            {company.certified ? "Certification verified" : "No certification"}
          </div>
        </div>

        {/* Sustainability Rank */}
        <div className="rounded-2xl border border-gray-100 bg-white/80 backdrop-blur p-4">
          <div className="flex items-center gap-3 text-gray-700">
            <Trophy size={18} /><span className="text-sm">Sustainability Rank</span>
          </div>
          <div className="text-xl font-bold mt-1">#{sustainRank}</div>
          <div className="text-xs text-gray-500 mt-1">
            out of {allCompanies.length} suppliers
          </div>
        </div>
      </div>

      {/* Sustainability Score */}
      <div className="rounded-2xl border border-gray-100 bg-gradient-to-br from-emerald-50 to-indigo-50 p-4 mb-6">
        <div className="flex items-center gap-3 text-gray-700">
          <Star size={18} className="text-emerald-600" />
          <span className="text-sm font-semibold">Sustainability Score</span>
        </div>
        <div className="text-2xl font-bold mt-2 text-emerald-700">
          {company.sustainability?.toFixed(3) ?? "N/A"}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Industry avg: {avgSustainability.toFixed(3)}
        </div>
      </div>

      {/* Breakdown Radar Chart */}
      <div className="rounded-2xl border border-gray-100 bg-white/80 backdrop-blur p-4 mb-6">
        <h3 className="font-semibold mb-3">Score Breakdown</h3>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={scoreBreakdown}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" />
              <PolarRadiusAxis angle={30} domain={[0, 1]} />
              <Radar
                name="Score"
                dataKey="score"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.6}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white/80 backdrop-blur p-4">
        <h3 className="font-semibold mb-3">Visual Comparison</h3>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="emissions" name="Emissions (tons)" fill="#22c55e" />
              <Bar dataKey="revenue" name="Revenue (M USD)" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Comparison Bar Chart */}
      <div className="rounded-2xl border border-gray-100 bg-white/80 backdrop-blur p-4 mt-6">
        <h3 className="font-semibold mb-3">Year-wise Emissions Trend</h3>
        {(() => {
          // Parse emission1..4 fields
          const emissions = []
          for (let i = 1; i <= 4; i++) {
            const raw = company[`emissions${i}`]
            if (raw) {
              const match = raw.match(/([\d,]+)\s*\((\d{4})\)/)
              if (match) {
                const val = Number(match[1].replace(/,/g, ""))
                const year = match[2]
                emissions.push({ year, value: val })
              }
            }
          }

          if (emissions.length < 2) {
            return (
              <p className="text-gray-500 text-sm">
                Insufficient data for trend analysis.
              </p>
            )
          }

          return (
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={emissions}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip 
                      formatter={(value, name) => {
                      if (name === "value") return null; // Hide this line’s tooltip
                      return [value, name];
                    }}
                    />
                  {/* Thin light blue bars */}
                  <Bar
                    dataKey="value"
                    name="Emissions (tons)"
                    fill="#93c5fd"
                    barSize={20}
                  />
                  {/* Smooth line overlay */}
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#6366f1"
                    strokeWidth={2}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          )
        })()}
      </div>

    </div>

  )
}
