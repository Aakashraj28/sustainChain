import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { UploadCloud, CheckCircle2, Building2 } from "lucide-react"

// At the very top of ResultsPage.jsx (after imports)
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"


export default function UploadCSV() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const navigate = useNavigate()

  const handleUpload = async () => {
    if (!file) return alert("Please select a CSV file")
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      const res = await fetch("https://sustainchain-backend.onrender.com/api/upload", {
        method: "POST",
        body: fd
      })
      const data = await res.json()
      if (data.token) {
        setUploaded(true)
        setTimeout(() => {
          navigate(`/sustainchain/results?token=${data.token}`)
        }, 600)
      } else {
        alert(data.error || "Upload failed")
      }
    } catch (e) {
      console.error(e)
      alert("Upload failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium">
            <UploadCloud size={16} /> CSV Import
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mt-4">
            Upload Your <span className="text-emerald-600">Supplier CSV</span>
          </h1>
          <p className="text-gray-600 mt-3">
            Columns: <code>company, revenue_musd, emissions_ton, certified, target_year</code>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.45 }}
          className="mt-10 bg-white/70 backdrop-blur border border-emerald-100 rounded-2xl shadow-xl p-6"
        >
          <div className="flex flex-col items-center">
            <label
              className="w-full cursor-pointer border-2 border-dashed border-gray-300 hover:border-emerald-400 rounded-2xl p-8 text-center transition"
            >
              <input
                type="file"
                accept=".csv"
                onChange={e=>setFile(e.target.files?.[0])}
                className="hidden"
              />
              <div className="text-gray-600">
                {file ? (
                  <div className="font-semibold">{file.name}</div>
                ) : (
                  <>
                    <p className="font-medium">Drag & Drop your file here</p>
                    <p className="text-sm text-gray-500 mt-1">or click to browse</p>
                  </>
                )}
              </div>
            </label>

            <button
              onClick={handleUpload}
              disabled={loading}
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold shadow-lg hover:bg-emerald-700 disabled:opacity-60"
            >
              {uploaded ? (
                <>
                  <CheckCircle2 size={18} /> Uploaded
                </>
              ) : loading ? "Uploading..." : "Upload & Continue"}
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.45 }}
          className="mt-12 text-center text-sm text-gray-500"
        >
          Or{" "}
          <Link to="/sustainchain/industry" className="text-indigo-600 hover:underline inline-flex items-center gap-1">
            <Building2 size={14} /> Select from Industry Dataset
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
