import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import CarCard from "../components/CarCard";
import carsData from "../data/cars.json";

const Cars = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow  px-4 ">
        <section className="py-20 px-6 bg-white">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">List of Cars</h2>
          <div className="flex flex-wrap justify-center gap-8 max-w-7xl mx-auto">
            {carsData.map((car) => (
              <CarCard 
                key={car.id}
                car={car}
              />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Cars;
