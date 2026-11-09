import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import StatusBadge from "../components/StatusBadge";
import { formatDate } from "../app/utils/api";
import { fetchMyReservations, cancelReservation } from "../app/redux/thunks/reservationThunks";
import { clearReservationError } from "../app/redux/slices/reservationSlice";

const MyReservations = () => {
  const dispatch = useDispatch();
  const { mine, loading, error } = useSelector((s) => s.reservation);

  useEffect(() => {
    dispatch(clearReservationError());
    dispatch(fetchMyReservations());
  }, [dispatch]);

  const handleCancel = (id) => {
    if (window.confirm("Annuler cette réservation ?")) dispatch(cancelReservation(id));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow px-4 py-12 pt-24">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-widest text-indigo-600">Votre espace</p>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Mes réservations</h1>
              <p className="mt-2 text-slate-600">Retrouvez vos demandes et suivez leur statut.</p>
            </div>
            <Link to="/reservation" className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700">
              Nouvelle réservation
            </Link>
          </div>

          {loading && <p className="text-gray-600">Chargement...</p>}
          {error && <p role="alert" className="mb-4 text-red-600">{error}</p>}
          {!loading && mine.length === 0 && (
            <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-600">
              Vous n'avez pas encore de réservation.
            </div>
          )}

          <ul className="space-y-4">
            {mine.map((r) => (
              <li key={r._id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div>
                  <p className="font-semibold text-gray-900">{r.carId?.name || "Voiture supprimée"}</p>
                  <p className="text-sm text-gray-600">
                    Du {formatDate(r.startDate)} au {formatDate(r.endDate)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <StatusBadge status={r.status} />
                  {r.status !== "cancelled" && (
                    <button onClick={() => handleCancel(r._id)} className="text-red-600 font-medium hover:underline">
                      Annuler
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyReservations;
