import AdminLayout from "../../components/AdminLayout";

const users = [
  {
    fullName: 'Lindsay Walton',
    phone: '+1 (555) 123-4567',
    email: 'lindsay.walton@example.com',
  },
  {
    fullName: 'Courtney Henry',
    phone: '+1 (555) 987-6543',
    email: 'courtney.henry@example.com',
  },
  {
    fullName: 'Tom Cook',
    phone: '+1 (555) 111-2222',
    email: 'tom.cook@example.com',
  },
  {
    fullName: 'Whitney Francis',
    phone: '+1 (555) 333-4444',
    email: 'whitney.francis@example.com',
  },
  {
    fullName: 'Leonard Krasner',
    phone: '+1 (555) 555-6666',
    email: 'leonard.krasner@example.com',
  },
  {
    fullName: 'Floyd Miles',
    phone: '+1 (555) 777-8888',
    email: 'floyd.miles@example.com',
  },
];

const Users = () => {
  return (
    <AdminLayout>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Client</h2>
            <p className="text-gray-500 max-w-md">
              A list of all clients in your account, including their full name, phone, and email.
            </p>
          </div>
          <button className="mt-4 sm:mt-0 bg-indigo-600 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md hover:bg-indigo-700 transition">
            Add a CLient
          </button>
        </div>

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Full Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Phone
              </th>
              <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Email
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-100">
            {users.map((user, idx) => (
              <tr key={idx} className="hover:bg-indigo-50 transition-colors cursor-default">
                <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">{user.fullName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">{user.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-indigo-600 hover:underline cursor-pointer">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap space-x-4 text-indigo-600 font-semibold">
                  <button className="hover:underline">Edit</button>
                  <button className="hover:underline text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
    </AdminLayout>
  );
};

export default Users;
