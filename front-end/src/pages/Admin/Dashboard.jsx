import AdminLayout from "../../components/AdminLayout";
import { Link } from "react-router-dom";
import {
  Users,
  Car,
  Calendar,
  MessageSquare
} from "lucide-react";
 
const sections = [
  {
    title: "Clients",
    desc: "From here you can manage clients",
    to: "/admin/clients",
    color: "bg-orange-500 hover:bg-orange-600",
    icon: <Users size={36} className="mb-2" />
  },
  {
    title: "Cars",
    desc: "From here you can manage cars",
    to: "/admin/cars",
    color: "bg-teal-500 hover:bg-teal-600",
    icon: <Car size={36} className="mb-2" />
  },
  {
    title: "Reservations",
    desc: "From here you can manage reservations",
    to: "/admin/reservations",
    color: "bg-yellow-400 hover:bg-yellow-500",
    icon: <Calendar size={36} className="mb-2" />
  },
  {
    title: "Messages",
    desc: "From here you can manage client messages",
    to: "/admin/messages",
    color: "bg-indigo-500 hover:bg-indigo-600",
    icon: <MessageSquare size={36} className="mb-2" />
  }
];

const Dashboard = () => {
  return (

     <AdminLayout>
    <div className="flex flex-col items-center justify-center px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">Administration Zone</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl w-full">
        {sections.map((section, idx) => (
          <div
            key={idx}
            className={`rounded-xl text-white p-6 shadow-lg transform transition-transform duration-300 hover:scale-105 ${section.color}`}
          >
            <div className="flex flex-col items-center text-center h-full">
              {section.icon}
              <h2 className="text-xl font-semibold mb-2">{section.title}</h2>
              <p className="mb-4">{section.desc}</p>
              <Link
                to={section.to}
                className="mt-auto inline-block px-4 py-2 bg-black bg-opacity-20 rounded-md hover:bg-opacity-40 transition"
              >
                View List
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
    </AdminLayout>
  );
};

export default Dashboard;
