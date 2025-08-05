import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import carsData from "../data/cars.json";

const Car = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const foundCar = carsData.find(car => car.id === parseInt(id));
    setCar(foundCar);
    
    if (foundCar) {
      const index = carsData.findIndex(car => car.id === parseInt(id));
      setCurrentIndex(index);
    }
  }, [id]);

  const handlePrevious = () => {
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : carsData.length - 1;
    const prevCar = carsData[prevIndex];
    navigate(`/car/${prevCar.id}`);
  };

  const handleNext = () => {
    const nextIndex = currentIndex < carsData.length - 1 ? currentIndex + 1 : 0;
    const nextCar = carsData[nextIndex];
    navigate(`/car/${nextCar.id}`);
  };

  if (!car) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow px-4 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Voiture non trouvée</h1>
            <p className="text-gray-600">La voiture que vous recherchez n'existe pas.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-8">
            <nav className="text-sm">
              <span className="text-gray-500">Accueil</span>
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-gray-500">Voitures</span>
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-indigo-600 font-medium">{car.name}</span>
            </nav>
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={handlePrevious}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 shadow-sm"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Précédent
            </button>
            
            <div className="text-center">
              <span className="text-sm text-gray-500">
                {currentIndex + 1} sur {carsData.length}
              </span>
            </div>
            
            <button
              onClick={handleNext}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 shadow-sm"
            >
              Suivant
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Image de la voiture */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-full h-[400px] object-cover"
                />
              </div>
              
              {/* Description détaillée */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">À propos de cette voiture</h3>
                <p className="text-gray-700 leading-relaxed text-lg">{car.description}</p>
                
                <div className="mt-8">
                  <h4 className="text-xl font-semibold text-gray-800 mb-4">Caractéristiques principales</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {car.features.map((feature, index) => (
                      <div 
                        key={index}
                        className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 text-indigo-700 px-4 py-3 rounded-xl text-center font-medium hover:shadow-md transition-shadow"
                      >
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar avec détails et réservation */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-8">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-800 mb-3">{car.name}</h1>
                  <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3 rounded-full inline-block">
                    <span className="text-2xl font-bold">{car.price}</span>
                  </div>
                </div>

                <div className="space-y-6 mb-8">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Disponibilité</span>
                    <span className="text-green-600 font-semibold flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Disponible
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Transmission</span>
                    <span className="text-gray-800 font-medium">
                      {car.features.includes('Manual') ? 'Manuelle' : 'Automatique'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Places</span>
                    <span className="text-gray-800 font-medium">
                      {car.features.find(f => f.includes('Seats'))?.replace('Seats', 'Places') || '5 Places'}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <button 
                    className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                    onClick={() => navigate(`/reservation/${car.id}`)}
                  >
                    <span className="text-lg">Réserver maintenant</span>
                  </button>
                  
                  <button 
                    className="w-full border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-semibold py-4 px-6 rounded-xl transition-all duration-300"
                    onClick={() => navigate('/contact')}
                  >
                    Demander des informations
                  </button>
                </div>
                
                <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-amber-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-amber-800 font-semibold">Important</span>
                  </div>
                  <p className="text-amber-700 text-sm">
                    Permis de conduire valide requis. Âge minimum : 21 ans.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Car;
