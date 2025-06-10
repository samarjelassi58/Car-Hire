import { useState, useEffect } from "react";
import { Link, useLocation , useNavigate} from "react-router-dom";
import {  useDispatch } from "react-redux";
import {
  Menu, X, Users, Car, Calendar, MessageSquare, LogOut, ChevronRight
} from "lucide-react";
import { logoutUser } from "../app/redux/thunks/authThunks";
const AdminLayout = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Par défaut : sidebar ouverte si écran >= sm (640px), sinon fermée
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 640);
  const location = useLocation();

  // Gestion du resize pour mettre à jour sidebarOpen selon la taille d'écran
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const navItems = [
    { name: "Clients", path: "/admin/clients", icon: <Users size={18} /> },
    { name: "Cars", path: "/admin/cars", icon: <Car size={18} /> },
    { name: "Reservations", path: "/admin/reservations", icon: <Calendar size={18} /> },
    { name: "Messages", path: "/admin/messages", icon: <MessageSquare size={18} /> },
  ];

const handleLogout = async () => {
  try {
    await dispatch(logoutUser());
    navigate("/"); // Redirection après logout
  } catch (error) {
    console.error("Erreur lors de la déconnexion :", error);
  }
};


  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed z-40 top-0 left-0 h-full w-64 bg-gradient-to-b from-indigo-600 to-indigo-800 text-white transform transition-transform duration-500 ease-in-out shadow-2xl
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
<Link to="/dashboard">
  <div className="flex items-center justify-center h-20 border-b border-indigo-500 transition-all duration-300 hover:bg-indigo-700 cursor-pointer">
    <img
      className="h-10 w-auto transition-transform duration-300 hover:scale-110"
      src="/images/logo.svg"
      alt="CarHire"
    />
  </div>
</Link>

        {/* Navigation */}
        <nav className="mt-8 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center justify-between text-sm font-medium px-4 py-3 rounded-lg transition-all duration-300
                  ${isActive
                    ? "bg-white/20 shadow-md backdrop-blur-sm"
                    : "text-indigo-100 hover:bg-white/10 hover:pl-6"
                  }
                `}
              >
                <div className="flex items-center">
                  <span className="mr-3 transition-transform duration-300 group-hover:scale-125">
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </div>
                {isActive && (
                  <ChevronRight
                    size={16}
                    className="text-indigo-300 animate-pulse"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-6 w-full px-4">
          <button
          onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white py-2.5 rounded-lg
                      transition-all duration-300 hover:shadow-lg hover:gap-3 backdrop-blur-sm"
          >
            <LogOut className="transition-transform duration-300 group-hover:rotate-12" size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}>
        {/* Navbar */}
        <header className="bg-white shadow-sm p-4 flex items-center justify-between sticky top-0 z-30">
          {/* Bouton hamburger visible partout */}
          <button
            className={`p-2 rounded-md focus:outline-none transition-all duration-300
              ${sidebarOpen ? 'bg-indigo-100 text-indigo-600 rotate-90' : 'text-gray-600 hover:text-indigo-600'}`}
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? (
              <X size={24} className="transition-transform duration-500 rotate-180 scale-110" />
            ) : (
              <Menu size={24} className="transition-transform duration-500 hover:scale-110" />
            )}
          </button>

          {/* Info Admin */}
          <div className="hidden sm:flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium
                            transition-transform duration-300 hover:scale-110">
              A
            </div>
            <span className="font-medium text-gray-700">Admin</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
          <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
