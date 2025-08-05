import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import carsData from "../data/cars.json";

const Reservation = () => {
  const { id } = useParams();
  const [selectedCar, setSelectedCar] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    startDate: '',
    endDate: '',
    carId: id || ''
  });

  useEffect(() => {
    if (id) {
      const foundCar = carsData.find(car => car.id === parseInt(id));
      setSelectedCar(foundCar);
      setFormData(prev => ({ ...prev, carId: id }));
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Reservation data:', formData);
    // Ici vous pouvez ajouter la logique pour envoyer les données
    alert('Réservation envoyée avec succès !');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              {selectedCar ? `Réserver ${selectedCar.name}` : 'Réservation'}
            </h1>
            <p className="text-gray-600 text-lg">
              {selectedCar ? 'Complétez le formulaire pour réserver cette voiture' : 'Choisissez une voiture et complétez votre réservation'}
            </p>
          </div>

          <div className={`grid grid-cols-1 ${id ? 'lg:grid-cols-3' : 'lg:grid-cols-1'} gap-8`}>
            {/* Formulaire de réservation */}
            <div className={id ? 'lg:col-span-2' : 'lg:col-span-1 max-w-4xl mx-auto'}>
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Informations de réservation</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Sélection de voiture si pas d'ID */}
                  {!selectedCar && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Choisir une voiture
                      </label>
                      <select
                        name="carId"
                        value={formData.carId}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      >
                        <option value="">Sélectionnez une voiture</option>
                        {carsData.map(car => (
                          <option key={car.id} value={car.id}>
                            {car.name} - {car.price}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Informations personnelles */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prénom *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Dates de location */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date de début *
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date de fin *
                      </label>
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Confirmer la réservation
                  </button>
                </form>
              </div>
            </div>

            {/* Sidebar avec résumé - Affiché seulement si ID présent */}
            {id && (
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">Résumé de la réservation</h3>
                  
                  {selectedCar ? (
                    <div className="space-y-4">
                      <div className="border-b border-gray-200 pb-4">
                        <img
                          src={selectedCar.image}
                          alt={selectedCar.name}
                          className="w-full h-32 object-cover rounded-lg mb-3"
                        />
                        <h4 className="font-semibold text-gray-800">{selectedCar.name}</h4>
                        <p className="text-indigo-600 font-bold text-lg">{selectedCar.price}</p>
                      </div>
                      
                      <div className="space-y-2">
                        {selectedCar.features.map((feature, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-600">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-gray-400 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 104 0 2 2 0 00-4 0zm6 0a2 2 0 104 0 2 2 0 00-4 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-gray-500">Chargement des informations...</p>
                    </div>
                  )}
                  
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="flex items-center mb-2">
                      <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <span className="text-blue-800 font-semibold">Informations</span>
                    </div>
                    <p className="text-blue-700 text-sm">
                      Toutes les réservations sont confirmées dans les 24h. Un acompte de 30% est requis.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Reservation;
