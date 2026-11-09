import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminLayout from "../../components/AdminLayout";
import StatusBadge from "../../components/StatusBadge";
import { formatDate } from "../../app/utils/api";
import { fetchAllReservations, updateReservationStatus } from "../../app/redux/thunks/reservationThunks";
import { clearReservationError } from "../../app/redux/slices/reservationSlice";

const FILTERS = [
  { value: "", label: "Toutes" },
  { value: "pending", label: "En attente" },
  { value: "confirmed", label: "Confirmées" },
  { value: "cancelled", label: "Annulées" },
];

const Reservations = () => {
  const dispatch = useDispatch();
  const { all, loading, error } = useSelector((s) => s.reservation);
  const [status, setStatus] = useState("");

  useEffect(() => {
    dispatch(clearReservationError());
    dispatch(fetchAllReservations(status));
  }, [dispatch, status]);

  const setReservationStatus = (id, next) => dispatch(updateReservationStatus({ id, status: next }));

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Réservations</h2>
          <p className="text-gray-500 max-w-md">Confirmez ou annulez les réservations des clients.</p>
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          aria-label="Filtrer par statut"
          className="border border-gray-300 rounded-md px-3 py-2 bg-white"
        >
          {FILTERS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="text-gray-600">Chargement...</p>}
      {error && <p role="alert" className="mb-4 text-red-600">{error}</p>}
      {!loading && all.length === 0 && (
        <div className="rounded-lg border border-dashed border-gray-200 p-8 text-center text-gray-600">
          Aucune réservation.
        </div>
      )}

      {all.length > 0 && (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["Client", "Voiture", "Période", "Statut", "Actions"].map((h) => (
                <th key={h} className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {all.map((r) => (
              <tr key={r._id} className="hover:bg-indigo-50">
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900">
                    {r.userId ? `${r.userId.FirstName} ${r.userId.LastName}` : "Client supprimé"}
                  </p>
                  <p className="text-sm text-gray-500">{r.userId?.Email}</p>
                </td>
                <td className="px-6 py-4 text-gray-700">{r.carId?.name || "Voiture supprimée"}</td>
                <td className="px-6 py-4 text-gray-700 whitespace-nowrap">
                  {formatDate(r.startDate)} → {formatDate(r.endDate)}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={r.status} />
                </td>
                <td className="px-6 py-4 space-x-4 font-semibold whitespace-nowrap">
                  {r.status === "pending" && (
                    <button
                      onClick={() => setReservationStatus(r._id, "confirmed")}
                      className="text-green-700 hover:underline"
                    >
                      Confirmer
                    </button>
                  )}
                  {r.status !== "cancelled" && (
                    <button
                      onClick={() => setReservationStatus(r._id, "cancelled")}
                      className="text-red-600 hover:underline"
                    >
                      Annuler
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AdminLayout>
  );
};

export default Reservations;
