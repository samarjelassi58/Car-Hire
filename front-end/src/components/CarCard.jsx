import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { imageUrl } from "../app/utils/api";

const CarCard = ({ car }) => {
  const navigate = useNavigate();
  const { _id, name, pricePerDay, image, options = [], category, fuelType } = car;
  const subtitle = [category, fuelType].filter(Boolean).join(" · ");

  return (
    <div
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
      onClick={() => navigate(`/car/${_id}`)}
    >
      <div className="relative h-52 overflow-hidden bg-slate-100">
        <img src={imageUrl(image)} alt={name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
        {category && <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">{category}</span>}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h5 className="text-xl font-bold text-slate-900">
          <Link to={`/car/${_id}`} onClick={(event) => event.stopPropagation()} className="hover:text-indigo-700">{name}</Link>
        </h5>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
        <div className="mt-4 flex flex-wrap gap-2">
          {options.map((option) => <span key={option} className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">{option}</span>)}
        </div>
        <div className="mt-auto flex items-end justify-between gap-3 border-t border-slate-100 pt-5">
          <div><p className="text-xs text-slate-500">À partir de</p><p className="font-bold text-slate-900">{pricePerDay} TND/jour</p></div>
          <button type="button" className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700" onClick={(event) => {
            event.stopPropagation();
            navigate(`/reservation/${_id}`);
          }}>
            Réserver <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
