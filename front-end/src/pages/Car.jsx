import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { getCarById, getCars } from "../app/redux/thunks/carThunks";
import { clearCurrentCar } from "../app/redux/slices/carSlice";
import { imageUrl } from "../app/utils/api";

const formatDate = (value) => new Date(value).toLocaleDateString("fr-FR", { timeZone: "UTC" });

const Message = ({ title, text }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow px-4 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{title}</h1>
        <p className="text-gray-600">{text}</p>
      </div>
    </main>
    <Footer />
  </div>
);

const Car = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { current: car, list, loading, error } = useSelector((s) => s.car);

  useEffect(() => {
    dispatch(clearCurrentCar());
    dispatch(getCarById(id));
    dispatch(getCars());
  }, [dispatch, id]);

  const index = list.findIndex((c) => c._id === id);
  const goTo = (offset) => {
    if (list.length === 0) return;
    const target = list[(Math.max(index, 0) + offset + list.length) % list.length];
    navigate(`/car/${target._id}`);
  };

  if (loading && !car) return <Message title="Chargement..." text="" />;
  if (!car || car._id !== id) {
    return <Message title="Voiture non trouvée" text={error || "La voiture que vous recherchez n'existe pas."} />;
  }

  const upcoming = (car.reservedPeriods || []).filter((p) => new Date(p.endDate) >= new Date());

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow px-4 py-12 pt-24 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <nav className="text-sm mb-8">
            <span className="text-gray-500">Accueil</span>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-500">Voitures</span>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-indigo-600 font-medium">{car.name}</span>
          </nav>

          {list.length > 1 && (
            <div className="flex justify-between items-center mb-8">
              <button
                onClick={() => goTo(-1)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shadow-sm"
              >
                ← Précédent
              </button>
              <span className="text-sm text-gray-500">
                {index + 1} sur {list.length}
              </span>
              <button
                onClick={() => goTo(1)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shadow-sm"
              >
                Suivant →
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <img src={imageUrl(car.image)} alt={car.name} className="w-full h-[400px] object-cover" />
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Caractéristiques</h3>
                <dl className="grid grid-cols-2 gap-4 text-gray-700 mb-6">
                  <div>
                    <dt className="text-sm text-gray-500">Catégorie</dt>
                    <dd className="font-medium">{car.category || "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Carburant</dt>
                    <dd className="font-medium">{car.fuelType || "—"}</dd>
                  </div>
                </dl>
                {(car.options || []).length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {car.options.map((option) => (
                      <div
                        key={option}
                        className="bg-indigo-50 border border-indigo-100 text-indigo-700 px-4 py-3 rounded-xl text-center font-medium"
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-800 mb-3">{car.name}</h1>
                  <div className="inline-block rounded-xl bg-indigo-50 px-6 py-3 text-indigo-700">
                    <span className="text-2xl font-bold">{car.pricePerDay} TND/jour</span>
                  </div>
                </div>

                <div className="mb-8">
                  <h4 className="font-semibold text-gray-800 mb-2">Périodes déjà réservées</h4>
                  {upcoming.length === 0 ? (
                    <p className="text-green-600 text-sm">Disponible, aucune réservation à venir.</p>
                  ) : (
                    <ul className="text-sm text-gray-600 space-y-1">
                      {upcoming.map((p) => (
                        <li key={`${p.startDate}-${p.endDate}`}>
                          {formatDate(p.startDate)} → {formatDate(p.endDate)}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="space-y-4">
                  <button
                    className="w-full rounded-xl bg-indigo-600 px-6 py-4 font-semibold text-white transition hover:bg-indigo-700"
                    onClick={() => navigate(`/reservation/${car._id}`)}
                  >
                    Réserver maintenant
                  </button>
                  <button
                    className="w-full border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-semibold py-4 px-6 rounded-xl transition-all duration-300"
                    onClick={() => navigate("/contact")}
                  >
                    Demander des informations
                  </button>
                </div>

                <p className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm">
                  Permis de conduire valide requis. Âge minimum : 21 ans.
                </p>
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
