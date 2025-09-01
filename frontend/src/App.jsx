import { Routes, Route, Navigate } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import Navbar from "./components/Navbar"  // Import Navbar component
import SustainChainHome from "./pages/SustainChainHome"
import IndustrySelection from "./pages/IndustrySelection"
import UploadCSV from "./pages/UploadCSV"
import ResultsPage from "./pages/ResultsPage"
import FreshBites from "./pages/FreshBites"

export default function App() {
  return (
    <div>
      <Navbar />
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/sustainchain" element={<SustainChainHome />} />
      <Route path="/sustainchain/industry" element={<IndustrySelection />} />
      <Route path="/sustainchain/upload" element={<UploadCSV />} />
      <Route path="/sustainchain/results" element={<ResultsPage />} />
      <Route path="/freshbites" element={<FreshBites />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
    </div>
  )
}
