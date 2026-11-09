import AdminLayout from "../../components/AdminLayout";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCar, getCars, updateCar, deleteCar, uploadCarImage } from "../../app/redux/thunks/carThunks";
import { imageUrl } from "../../app/utils/api";
import { clearCarError } from "../../app/redux/slices/carSlice";

const emptyForm = {
  name: "",
  pricePerDay: "",
  fuelType: "",
  category: "",
  tag: "",
  options: "",
  image: "",
};

const Cars = () => {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((s) => s.car || { list: [], loading: false, error: null });
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    dispatch(getCars());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      // clear error after a short time
      const t = setTimeout(() => dispatch(clearCarError()), 3000);
      return () => clearTimeout(t);
    }
  }, [error, dispatch]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      pricePerDay: Number(form.pricePerDay),
      fuelType: form.fuelType,
      category: form.category,
      tag: form.tag,
      options: form.options ? form.options.split(",").map((s) => s.trim()) : [],
      image: form.image,
    };

    // If an image file was selected, upload it first and use returned path
    if (imageFile) {
      const uploadRes = await dispatch(uploadCarImage(imageFile));
      if (!uploadCarImage.fulfilled.match(uploadRes)) {
        window.alert(uploadRes.payload || "Échec de l'envoi de l'image");
        return;
      }
      payload.image = uploadRes.payload.path;
    }

    const result =
      editMode && form._id
        ? await dispatch(updateCar({ id: form._id, update: payload }))
        : await dispatch(createCar(payload));
    if (result.error) return;

    setForm(emptyForm);
    setEditMode(false);
    setShowForm(false);
    setImageFile(null);
    setImagePreview(null);
  };

  const onEdit = (car) => {
    setForm({
      _id: car._id,
      name: car.name || "",
      pricePerDay: car.pricePerDay || "",
      fuelType: car.fuelType || "",
      category: car.category || "",
      tag: car.tag || "",
      options: (car.options || []).join(", "),
      image: car.image || "",
    });
    setEditMode(true);
    setShowForm(true);
  };

  const onDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this car?")) return;
    await dispatch(deleteCar(id));
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Cars</h2>
          <p className="text-gray-500 max-w-md">A list of all cars in your fleet.</p>
        </div>
        <button
          onClick={() => {
            setShowForm((s) => !s);
            setEditMode(false);
            setForm(emptyForm);
          }}
          className="mt-4 sm:mt-0 bg-indigo-600 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md hover:bg-indigo-700 transition"
        >
          {showForm ? "Close" : "Add a Car"}
        </button>
      </div>

      {error && <div role="alert" className="mb-4 text-red-600">{error}</div>}

      {showForm && (
        <form onSubmit={onSubmit} className="mb-6 bg-white p-4 rounded shadow">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input name="name" value={form.name} onChange={onChange} className="mt-1 block w-full border rounded p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Price / day</label>
              <input name="pricePerDay" value={form.pricePerDay} onChange={onChange} type="number" className="mt-1 block w-full border rounded p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Fuel Type</label>
              <input name="fuelType" value={form.fuelType} onChange={onChange} className="mt-1 block w-full border rounded p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <input name="category" value={form.category} onChange={onChange} className="mt-1 block w-full border rounded p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tag</label>
              <input name="tag" value={form.tag} onChange={onChange} className="mt-1 block w-full border rounded p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Options (comma separated)</label>
              <input name="options" value={form.options} onChange={onChange} className="mt-1 block w-full border rounded p-2" />
            </div>
            <div className="sm:col-span-2">
       
              <div className="mt-2 ">
                  <label className="block text-sm font-medium text-gray-700">Upload image file</label>
                  <div className="mt-1 flex items-center gap-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const f = e.target.files && e.target.files[0];
                        setImageFile(f || null);
                        if (f) {
                          const url = URL.createObjectURL(f);
                          setImagePreview(url);
                        } else {
                          setImagePreview(null);
                        }
                      }}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current && fileInputRef.current.click()}
                      className="bg-gray-200 px-3 py-1 rounded"
                    >
                      Choose file
                    </button>
                    <div className="text-sm text-gray-600">{imageFile ? imageFile.name : "No file chosen"}</div>
                  </div>

                  {imagePreview && (
                    <div className="mt-2">
                      <img src={imagePreview} alt="preview" className="h-24 w-40 object-cover rounded" />
                    </div>
                  )}
                </div>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">{editMode ? "Update" : "Create"}</button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditMode(false);
                setForm(emptyForm);
              }}
              className="bg-gray-200 px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Photo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price/day</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fuel</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tag</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading && (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">Loading...</td>
              </tr>
            )}
            {!loading && list.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">No cars found.</td>
              </tr>
            )}
            {list.map((car) => {
              return (
                <tr key={car._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <img src={imageUrl(car.image)} alt={car.name} className="h-16 w-24 object-cover rounded" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{car.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{car.pricePerDay}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{car.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{car.fuelType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{car.tag}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex gap-2 justify-end">
                    <button onClick={() => onEdit(car)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                    <button onClick={() => onDelete(car._id)} className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default Cars;
