import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import CarCard from "../components/CarCard";
import { getCars } from "../app/redux/thunks/carThunks";

const Cars = () => {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((s) => s.car);

  useEffect(() => {
    dispatch(getCars());
  }, [dispatch]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      <main className="flex-grow pt-16">
        <section className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
          <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">Le catalogue CarHire</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">Nos voitures</h1>
          <p className="mt-3 mb-8 text-slate-600">Explorez nos véhicules et choisissez celui qui correspond à votre trajet.</p>
          {loading && <p className="text-center text-gray-600">Chargement...</p>}
          {error && <p className="text-center text-red-600">{error}</p>}
          {!loading && !error && list.length === 0 && (
            <p className="text-center text-gray-600">Aucune voiture disponible pour le moment.</p>
          )}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {list.map((car) => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Cars;
