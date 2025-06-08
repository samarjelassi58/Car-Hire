import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaCarSide, FaShieldAlt, FaHeadset } from "react-icons/fa";

const Home = () => {
  return (
    <div>
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <section
          className="relative h-[100vh] flex items-center justify-center text-white bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(to bottom right, rgba(79, 70, 229, 0.7), rgba(0, 0, 0, 0.5)), url('/images/sousse-car-hero.jpg')`,
            backgroundAttachment: 'fixed',
          }}
        >
          <div className="absolute inset-0 backdrop-blur-sm bg-black/20"></div>
          <div className="relative z-10 text-center px-6 max-w-2xl">
            <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight mb-6 tracking-tight drop-shadow-xl">
              Rent the Car of Your Dreams
            </h1>
            <p className="text-lg sm:text-xl mb-8 text-white/90 drop-shadow-lg">
              Luxury, economy, or SUV — fully insured & ready to go.
            </p>
            <a
              href="/reservation"
              className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3 rounded-full shadow-xl ring-offset-2 ring-indigo-400 focus:ring-2 focus:outline-none transition duration-300"
            >
              Book Your Ride
            </a>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 px-6 text-center bg-gradient-to-b from-white via-indigo-50 to-white">
          <h2 className="text-3xl font-bold mb-10 text-gray-800">How it works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 max-w-5xl mx-auto">
            {[
              { step: "1", title: "Choose", desc: "Browse our vehicle selection." },
              { step: "2", title: "Book", desc: "Book online in just a few clicks." },
              { step: "3", title: "Drive", desc: "Pick up your car and hit the road." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="p-6 bg-white rounded-xl shadow-md">
                <div className="text-4xl font-bold text-indigo-600 mb-4">{step}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
                <p className="text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Cars */}
        <section className="py-20 px-6 bg-white">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Featured Cars</h2>
          <div className="grid sm:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { name: "Toyota Yaris", price: "80 TND/day", image: "/images/yaris.jpg" },
              { name: "BMW 3 Series", price: "200 TND/day", image: "/images/bmw.jpg" },
              { name: "Dacia Duster", price: "120 TND/day", image: "/images/duster.jpg" },
            ].map((car) => (
              <div key={car.name} className="bg-indigo-50 p-4 rounded-xl shadow text-center">
                <img src={car.image} alt={car.name} className="rounded-lg w-full h-40 object-cover mb-4" />
                <h3 className="font-semibold text-lg text-gray-800">{car.name}</h3>
                <p className="text-indigo-600 font-bold">{car.price}</p>
                <a
                  href="/reservation"
                  className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-500 transition"
                >
                  Reserve
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Services */}
        <section className="py-20 px-6 max-w-6xl mx-auto bg-white">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Our Services</h2>
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            {[{
              icon: <FaCarSide />, title: "Wide Vehicle Selection", desc: "From city cars to luxury models"
            }, {
              icon: <FaShieldAlt />, title: "Insurance Included", desc: "Drive with peace of mind"
            }, {
              icon: <FaHeadset />, title: "24/7 Assistance", desc: "We're here whenever you need"
            }].map((service, i) => (
              <div key={i} className="p-6 rounded-lg shadow bg-indigo-50">
                <div className="text-indigo-600 text-3xl mb-2 mx-auto">{service.icon}</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">{service.title}</h3>
                <p className="text-gray-600">{service.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-gradient-to-b from-indigo-50 to-white py-20 px-6">
          <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">What Our Customers Say</h2>
          <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-8 text-center">
            {[{ name: "Sami B.", quote: "Great service, clean car, easy process!" },
              { name: "Amira T.", quote: "Affordable and reliable. I’ll book again!" },
              { name: "Hatem Z.", quote: "Best car rental in Tunisia!" }].map((t, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow">
                <p className="italic text-gray-700 mb-4">"{t.quote}"</p>
                <h4 className="font-semibold text-indigo-600">{t.name}</h4>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-indigo-600 text-white py-16 px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to drive?</h2>
          <p className="text-lg mb-6">Book your vehicle online and hit the road today!</p>
          <a
            href="/reservation"
            className="bg-white text-indigo-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
          >
            Book Now
          </a>
        </section>

        {/* Location */}
        <section className="py-20 px-6 text-center bg-white">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Our Location</h2>
          <p className="mb-4 text-gray-600">Visit us in Tunis or get your car delivered anywhere in Tunisia!</p>
          <div className="w-full max-w-4xl mx-auto h-64 rounded-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3190.945490962908!2d10.64088887592437!3d35.82886632034769!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1302207f0eeb8b3f%3A0x637af93c00f0816e!2sSousse%2C%20Tunisia!5e0!3m2!1sen!2stn!4v1717841000000!5m2!1sen!2stn"
              width="100%"
              height="100%"
              allowFullScreen=""
              loading="lazy"
              title="CarHire Location"
              className="border-0 w-full h-full"
            ></iframe>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
};

export default Home;
