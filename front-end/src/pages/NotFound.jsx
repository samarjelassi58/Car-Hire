import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const NotFound = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4 m-30">
        <h1 className="text-6xl font-bold text-indigo-600 mb-4">404</h1>
        <p className="text-2xl font-semibold mb-2">Page non trouvée</p>
        <p className="text-gray-600 mb-6">
          Désolé, la page que vous cherchez n'existe pas.
        </p>
        <Link
          to="/"
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300"
        >
          Retour à l'accueil
        </Link>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
