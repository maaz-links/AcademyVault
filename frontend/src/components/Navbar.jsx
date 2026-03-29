import { Link } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";

export default function Navbar() {
  const { setToken } = useAuthContext();

  const onLogout = (ev) => {
    ev.preventDefault();
    setToken(null);
  };

  return (
    <nav className="bg-indigo-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-white font-extrabold text-xl tracking-tight hover:text-indigo-100 transition-colors">
            AcademyVault
          </Link>
          <div className="flex items-center space-x-4">
            <button 
              onClick={onLogout} 
              className="bg-indigo-500 hover:bg-indigo-400 text-white px-5 py-2 rounded-md text-sm font-semibold transition-colors shadow-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
