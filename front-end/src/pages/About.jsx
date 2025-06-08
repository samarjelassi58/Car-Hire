import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

const aboutFeatures = [
  {
    title: "Wide Selection",
    description:
      "From compact cars to luxury SUVs — we provide vehicles for every style, occasion, and budget.",
  },
  {
    title: "24/7 Support",
    description:
      "Our dedicated support team is available around the clock to assist with bookings and issues.",
  },
  {
    title: "Affordable Pricing",
    description:
      "Clear and transparent pricing with no hidden fees — just great cars at great rates.",
  },
];

const About = () => {
  return (
    <div className="bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-24 bg-gradient-to-br from-indigo-50 via-white to-white text-center px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            About <span className="text-indigo-600">CarHire</span>
          </h1>
          <p className="mt-6 text-xl md:text-2xl text-gray-600 leading-relaxed">
            We simplify your journey by offering top-notch vehicles, unmatched customer support, and pricing you can trust.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 bg-white px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-3xl p-12 text-white shadow-xl">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg md:text-xl leading-relaxed">
              At CarHire, our goal is to empower your travels. Whether you're commuting, vacationing, or exploring — we deliver
              the flexibility and freedom you need, backed by reliability and care.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-gray-50 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Us?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We go the extra mile to make your car rental experience seamless
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {aboutFeatures.map((item) => (
              <div
                key={item.title}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-left border border-gray-100"
              >
                <div className="bg-indigo-100 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                  <CheckCircleIcon className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;