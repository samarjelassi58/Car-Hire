import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminLayout from "../../components/AdminLayout";
import { fetchClients, registerUser, updateClient, deleteClient } from "../../app/redux/thunks/userThunks";
import { clearUserError } from "../../app/redux/slices/userSlice";

const emptyForm = { FirstName: "", LastName: "", Phone: "", Email: "", Password: "" };
const inputClass = "mt-1 block w-full border rounded p-2";

const Clients = () => {
  const dispatch = useDispatch();
  const { clients, loading, error } = useSelector((s) => s.user);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    dispatch(clearUserError());
    dispatch(fetchClients());
  }, [dispatch]);

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
  };

  const onChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onEdit = (client) => {
    setForm({
      FirstName: client.FirstName,
      LastName: client.LastName,
      Phone: client.Phone,
      Email: client.Email,
      Password: "",
    });
    setEditingId(client._id);
    setShowForm(true);
    setFormError("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const profile = { FirstName: form.FirstName, LastName: form.LastName, Phone: form.Phone, Email: form.Email };
    const action = editingId
      ? await dispatch(updateClient({ id: editingId, update: profile }))
      : await dispatch(registerUser(form));

    if (action.error) {
      setFormError(action.payload || "Enregistrement impossible");
      return;
    }
    if (!editingId) dispatch(fetchClients());
    closeForm();
  };

  const onDelete = (client) => {
    if (window.confirm(`Supprimer ${client.FirstName} ${client.LastName} ?`)) dispatch(deleteClient(client._id));
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Clients</h2>
          <p className="text-gray-500 max-w-md">Liste des clients inscrits : nom, téléphone et email.</p>
        </div>
        <button
          onClick={() => (showForm ? closeForm() : setShowForm(true))}
          className="mt-4 sm:mt-0 bg-indigo-600 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md hover:bg-indigo-700 transition"
        >
          {showForm ? "Fermer" : "Ajouter un client"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={onSubmit} className="mb-6 bg-white p-4 rounded shadow">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block text-sm font-medium text-gray-700">
              Prénom
              <input name="FirstName" value={form.FirstName} onChange={onChange} className={inputClass} required />
            </label>
            <label className="block text-sm font-medium text-gray-700">
              Nom
              <input name="LastName" value={form.LastName} onChange={onChange} className={inputClass} required />
            </label>
            <label className="block text-sm font-medium text-gray-700">
              Téléphone
              <input name="Phone" value={form.Phone} onChange={onChange} className={inputClass} required />
            </label>
            <label className="block text-sm font-medium text-gray-700">
              Email
              <input name="Email" type="email" value={form.Email} onChange={onChange} className={inputClass} required />
            </label>
            {!editingId && (
              <label className="block text-sm font-medium text-gray-700">
                Mot de passe (8 caractères minimum)
                <input
                  name="Password"
                  type="password"
                  minLength={8}
                  value={form.Password}
                  onChange={onChange}
                  className={inputClass}
                  required
                />
              </label>
            )}
          </div>
          {formError && <p role="alert" className="mt-3 text-red-600 text-sm">{formError}</p>}
          <div className="mt-4 flex gap-3">
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
              {editingId ? "Enregistrer" : "Créer"}
            </button>
            <button type="button" onClick={closeForm} className="px-4 py-2 rounded border">
              Annuler
            </button>
          </div>
        </form>
      )}

      {loading && <p className="text-gray-600">Chargement...</p>}
      {error && <p role="alert" className="mb-4 text-red-600">{error}</p>}
      {!loading && clients.length === 0 && (
        <div className="rounded-lg border border-dashed border-gray-200 p-8 text-center text-gray-600">
          Aucun client.
        </div>
      )}

      {clients.length > 0 && (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["Nom complet", "Téléphone", "Email"].map((h) => (
                <th key={h} className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                  {h}
                </th>
              ))}
              <th className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {clients.map((client) => (
              <tr key={client._id} className="hover:bg-indigo-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                  {client.FirstName} {client.LastName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">{client.Phone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-indigo-600">{client.Email}</td>
                <td className="px-6 py-4 whitespace-nowrap space-x-4 font-semibold">
                  <button onClick={() => onEdit(client)} className="text-indigo-600 hover:underline">
                    Modifier
                  </button>
                  <button onClick={() => onDelete(client)} className="text-red-600 hover:underline">
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AdminLayout>
  );
};

export default Clients;
