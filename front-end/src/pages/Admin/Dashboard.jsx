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
    color: "text-indigo-600 bg-indigo-50",
    icon: <Users size={36} className="mb-2" />
  },
  {
    title: "Cars",
    desc: "From here you can manage cars",
    to: "/admin/cars",
    color: "text-teal-600 bg-teal-50",
    icon: <Car size={36} className="mb-2" />
  },
  {
    title: "Reservations",
    desc: "From here you can manage reservations",
    to: "/admin/reservations",
    color: "text-amber-600 bg-amber-50",
    icon: <Calendar size={36} className="mb-2" />
  },
  {
    title: "Messages",
    desc: "From here you can manage client messages",
    to: "/admin/messages",
    color: "text-violet-600 bg-violet-50",
    icon: <MessageSquare size={36} className="mb-2" />
  }
];

const Dashboard = () => {
  return (

     <AdminLayout>
    <div className="px-2 py-6 sm:px-4">
      <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">CarHire</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Administration Zone</h1>
      <p className="mt-2 mb-8 text-slate-600">Gérez votre activité depuis un seul espace.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl w-full">
        {sections.map((section, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
          >
            <div className="flex h-full flex-col items-start">
              <span className={`rounded-xl p-3 ${section.color}`}>{section.icon}</span>
              <h2 className="mt-5 text-xl font-semibold text-slate-900">{section.title}</h2>
              <p className="mt-2 mb-6 text-slate-600">{section.desc}</p>
              <Link
                to={section.to}
                className="mt-auto inline-block rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-600"
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
