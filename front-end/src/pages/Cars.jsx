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
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow px-4 pt-16">
        <section className="py-20 px-6 bg-white">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Nos voitures</h2>
          {loading && <p className="text-center text-gray-600">Chargement...</p>}
          {error && <p className="text-center text-red-600">{error}</p>}
          {!loading && !error && list.length === 0 && (
            <p className="text-center text-gray-600">Aucune voiture disponible pour le moment.</p>
          )}
          <div className="flex flex-wrap justify-center gap-8 max-w-7xl mx-auto">
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
