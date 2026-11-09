import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { getCars } from "../app/redux/thunks/carThunks";
import { createReservation } from "../app/redux/thunks/reservationThunks";
import { clearReservationError } from "../app/redux/slices/reservationSlice";
import { imageUrl } from "../app/utils/api";

const toInputDate = (date) => {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

const inputClass =
  "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";

const Reservation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { list: cars } = useSelector((s) => s.car);
  const { user } = useSelector((s) => s.auth);
  const { submitting, error } = useSelector((s) => s.reservation);

  const today = toInputDate(new Date());
  const [carId, setCarId] = useState(id || "");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    dispatch(getCars());
    dispatch(clearReservationError());
  }, [dispatch]);

  const selectedCar = cars.find((c) => c._id === carId);
  const days =
    startDate && endDate && endDate >= startDate
      ? Math.round((new Date(endDate) - new Date(startDate)) / 86400000) + 1
      : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(createReservation({ carId, startDate, endDate }));
    if (createReservation.fulfilled.match(result)) navigate("/my-reservations");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow px-4 py-12 pt-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              {selectedCar ? `Réserver ${selectedCar.name}` : "Réservation"}
            </h1>
            <p className="text-gray-600 text-lg">Choisissez votre voiture et vos dates de location.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Informations de réservation</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="carId" className="block text-sm font-medium text-gray-700 mb-2">
                    Voiture *
                  </label>
                  <select
                    id="carId"
                    value={carId}
                    onChange={(e) => setCarId(e.target.value)}
                    className={inputClass}
                    required
                  >
                    <option value="">Sélectionnez une voiture</option>
                    {cars.map((car) => (
                      <option key={car._id} value={car._id}>
                        {car.name} - {car.pricePerDay} TND/jour
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                      Date de début *
                    </label>
                    <input
                      id="startDate"
                      type="date"
                      value={startDate}
                      min={today}
                      onChange={(e) => setStartDate(e.target.value)}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                      Date de fin *
                    </label>
                    <input
                      id="endDate"
                      type="date"
                      value={endDate}
                      min={startDate || today}
                      onChange={(e) => setEndDate(e.target.value)}
                      className={inputClass}
                      required
                    />
                  </div>
                </div>

                <p className="text-sm text-gray-500">
                  La réservation sera faite au nom de {user?.FirstName} {user?.LastName} ({user?.Email}).
                </p>

                {error && (
                  <p role="alert" className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 disabled:opacity-60 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg"
                >
                  {submitting ? "Envoi..." : "Confirmer la réservation"}
                </button>
              </form>
            </div>

            <aside className="bg-white rounded-2xl shadow-lg p-8 h-fit lg:sticky lg:top-24">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Résumé</h3>
              {selectedCar ? (
                <div className="space-y-4">
                  <img
                    src={imageUrl(selectedCar.image)}
                    alt={selectedCar.name}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <h4 className="font-semibold text-gray-800">{selectedCar.name}</h4>
                  <p className="text-indigo-600 font-bold text-lg">{selectedCar.pricePerDay} TND/jour</p>
                  {days > 0 && (
                    <p className="text-gray-700 border-t pt-4">
                      {days} jour{days > 1 ? "s" : ""} :{" "}
                      <span className="font-bold">{days * selectedCar.pricePerDay} TND</span>
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">Sélectionnez une voiture pour voir le résumé.</p>
              )}
              <p className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 text-sm">
                Votre réservation est en attente jusqu'à sa confirmation par notre équipe.
              </p>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Reservation;
