import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

const aboutFeatures = [
  {
    title: "Un large choix",
    description:
      "Des citadines aux SUV, découvrez des véhicules adaptés à vos besoins.",
  },
  {
    title: "À votre écoute",
    description:
      "Notre équipe répond à vos questions sur les réservations.",
  },
  {
    title: "Des tarifs accessibles",
    description:
      "Consultez les tarifs de location avant de choisir votre véhicule.",
  },
];

const About = () => {
  return (
    <div className="bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-slate-50 px-4 pb-20 pt-32 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            À propos de <span className="text-indigo-600">CarHire</span>
          </h1>
          <p className="mt-6 text-xl md:text-2xl text-gray-600 leading-relaxed">
            Nous simplifions vos déplacements grâce à une sélection de véhicules et un service de réservation en ligne.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-2 bg-white px-4">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-3xl bg-slate-950 p-8 text-white sm:p-12">
            <h2 className="text-3xl font-bold mb-6">Notre mission</h2>
            <p className="text-lg md:text-xl leading-relaxed">
              Chez CarHire, nous vous aidons à trouver une voiture adaptée à vos déplacements, vos vacances et vos découvertes.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-gray-50 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pourquoi choisir CarHire ?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Une expérience de location pensée pour vous simplifier la vie.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {aboutFeatures.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-8 text-left shadow-sm transition hover:shadow-md"
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