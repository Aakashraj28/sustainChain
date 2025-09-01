import { Link, useNavigate } from "react-router-dom"; // Import `useNavigate`
import { Menu, ChevronDown, FilePlus, Database, Package } from "lucide-react"; // Improved icons
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState({
    sustainChain: false,
    freshBites: false,
  });
  
  const [dropdownTimeout, setDropdownTimeout] = useState(null); // State for handling timeout delay
  const navigate = useNavigate(); // React Router's hook to navigate programmatically

  const toggleMenu = () => setIsOpen((prev) => !prev);

  // Smooth scroll for About Us after navigation
  const handleAboutUsClick = () => {
    navigate("/"); // First, navigate to the home page
  };

  // Handle scroll to About Us once we are on the Home page
  useEffect(() => {
    if (window.location.pathname === "/") {
      const aboutUsSection = document.getElementById("about-us");
      if (aboutUsSection) {
        aboutUsSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [window.location.pathname]); // Run this whenever the pathname changes

  return (
    <nav className="bg-indigo-600 text-white px-4 py-3 fixed top-0 left-0 right-0 z-50 shadow-lg transition-all ease-in-out duration-500">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo or Home link */}
        <Link to="/" className="text-xl font-bold text-white">
          SustainChain
        </Link>

        {/* Menu Button for Mobile */}
        <button onClick={toggleMenu} className="lg:hidden p-2 rounded-full">
          <Menu size={24} />
        </button>

        {/* Desktop Navbar Links */}
        <div className="hidden lg:flex space-x-6">
          <Link to="/" className="hover:text-indigo-200 transition duration-300">
            Home
          </Link>

          {/* SustainChain Dropdown */}
          <div
            className="relative group"
            onMouseEnter={() => {
              setDropdownOpen((prevState) => ({ ...prevState, sustainChain: true }));
              if (dropdownTimeout) {
                clearTimeout(dropdownTimeout); // Prevent closing if hovering over links
              }
            }}
            onMouseLeave={() => {
              setDropdownTimeout(setTimeout(() => {
                setDropdownOpen((prevState) => ({ ...prevState, sustainChain: false }));
              }, 600)); // Delay closing after the timeout
            }}
          >
            <button className="flex items-center gap-1 hover:text-indigo-200 transition duration-300">
              SustainChain <ChevronDown size={16} />
            </button>
            {dropdownOpen.sustainChain && (
              <div
                className="absolute top-8 left-0 w-48 bg-white shadow-lg rounded-lg py-2 opacity-100 visible transform translate-y-0 transition-all ease-in-out duration-500"
                onMouseEnter={() => {
                  setDropdownOpen((prevState) => ({ ...prevState, sustainChain: true }));
                  if (dropdownTimeout) {
                    clearTimeout(dropdownTimeout); // Keep it open if hovering over the links
                  }
                }}
                onMouseLeave={() => {
                  setDropdownTimeout(setTimeout(() => {
                    setDropdownOpen((prevState) => ({ ...prevState, sustainChain: false }));
                  }, 600)); // Delay closing when mouse leaves both button and links
                }}
              >
                <Link
                  to="/sustainchain/upload"
                  className="block px-4 py-2 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-900"
                >
                  <FilePlus size={16} className="inline-block mr-2" /> Upload CSV
                </Link>
                <Link
                  to="/sustainchain/industry"
                  className="block px-4 py-2 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-900"
                >
                  <Database size={16} className="inline-block mr-2" /> Select Industry
                </Link>
              </div>
            )}
          </div>

          {/* FreshBites Dropdown */}
          <div
            className="relative group"
            onMouseEnter={() => {
              setDropdownOpen((prevState) => ({ ...prevState, freshBites: true }));
              if (dropdownTimeout) {
                clearTimeout(dropdownTimeout); // Prevent closing if hovering over links
              }
            }}
            onMouseLeave={() => {
              setDropdownTimeout(setTimeout(() => {
                setDropdownOpen((prevState) => ({ ...prevState, freshBites: false }));
              }, 600)); // Delay closing after the timeout
            }}
          >
            <button className="flex items-center gap-1 hover:text-indigo-200 transition duration-300">
              FreshBites <ChevronDown size={16} />
            </button>
            {dropdownOpen.freshBites && (
              <div
                className="absolute top-8 left-0 w-48 bg-white shadow-lg rounded-lg py-2 opacity-100 visible transform translate-y-0 transition-all ease-in-out duration-500"
                onMouseEnter={() => {
                  setDropdownOpen((prevState) => ({ ...prevState, freshBites: true }));
                  if (dropdownTimeout) {
                    clearTimeout(dropdownTimeout); // Keep it open if hovering over the links
                  }
                }}
                onMouseLeave={() => {
                  setDropdownTimeout(setTimeout(() => {
                    setDropdownOpen((prevState) => ({ ...prevState, freshBites: false }));
                  }, 600)); // Delay closing when mouse leaves both button and links
                }}
              >
                <Link
                  to="/freshbites"
                  className="block px-4 py-2 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-900"
                >
                  <Package size={16} className="inline-block mr-2" /> Visit FreshBites
                </Link>
              </div>
            )}
          </div>

          {/* About Us Link */}
          <button
            onClick={handleAboutUsClick} // Click to redirect to home and scroll to About Us
            className="hover:text-indigo-200 transition duration-300"
          >
            About Us
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`${
            isOpen ? "block" : "hidden"
          } lg:hidden absolute top-12 left-0 w-full bg-white shadow-lg rounded-b-lg transition-all ease-in-out duration-500`}
        >
          <Link
            to="/sustainchain/upload"
            className="block px-4 py-2 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-900"
          >
            <FilePlus size={16} className="inline-block mr-2" /> Upload CSV
          </Link>
          <Link
            to="/sustainchain/industry"
            className="block px-4 py-2 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-900"
          >
            <Database size={16} className="inline-block mr-2" /> Select Industry
          </Link>
          <Link
            to="/freshbites"
            className="block px-4 py-2 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-900"
          >
            <Package size={16} className="inline-block mr-2" /> Visit FreshBites
          </Link>
          <button
            onClick={handleAboutUsClick} // Click to redirect to home and scroll to About Us
            className="block px-4 py-2 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-900"
          >
            About Us
          </button>
        </div>
      </div>
    </nav>
  );
}
