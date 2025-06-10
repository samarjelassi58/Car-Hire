import AdminLayout from "../../components/AdminLayout";


const Cars = () => {
  return (
    <AdminLayout>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Cars</h2>
            <p className="text-gray-500 max-w-md">
              A list of all Cars in your account, including their full name, phone, and email.
            </p>
          </div>
          <button className="mt-4 sm:mt-0 bg-indigo-600 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md hover:bg-indigo-700 transition">
            Add a Car
          </button>
        </div>
    </AdminLayout>
  );
};

export default Cars;
