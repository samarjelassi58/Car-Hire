import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarCheck, CarFront, Search } from "lucide-react";
import { getCars } from "../app/redux/thunks/carThunks";
import CarCard from "../components/CarCard";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const steps = [
  { icon: <Search size={22} />, title: "Explorez", text: "Parcourez notre sélection et trouvez la voiture qui vous convient." },
  { icon: <CalendarCheck size={22} />, title: "Réservez", text: "Choisissez vos dates et envoyez votre demande en quelques clics." },
  { icon: <CarFront size={22} />, title: "Prenez la route", text: "Suivez la confirmation de votre réservation dans votre espace." },
];

const Home = () => {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.car);

  useEffect(() => {
    dispatch(getCars());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-16">
        <section className="bg-slate-950 text-white">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 sm:py-28 lg:grid-cols-2 lg:py-32">
            <div>
              <p className="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-indigo-300">Votre voyage commence ici</p>
              <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
                La bonne voiture pour chaque trajet.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
                Trouvez votre prochaine voiture, choisissez vos dates et suivez votre réservation en toute simplicité.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link to="/cars" className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-6 py-4 font-semibold text-white transition hover:bg-indigo-400">
                  Découvrir les voitures <ArrowRight size={18} />
                </Link>
                <Link to="/reservation" className="inline-flex items-center rounded-xl border border-slate-600 px-6 py-4 font-semibold text-white transition hover:bg-white/10">
                  Faire une réservation
                </Link>
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-7 sm:p-10">
              <div className="flex h-48 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-400/20 to-slate-800 sm:h-60">
                <CarFront className="h-28 w-28 text-indigo-200 sm:h-36 sm:w-36" strokeWidth={1} aria-hidden="true" />
              </div>
              <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-indigo-300">Simple et pratique</p>
              <h2 className="mt-2 text-2xl font-semibold">Votre prochaine escapade, à votre rythme.</h2>
              <p className="mt-3 text-slate-300">Consultez les tarifs et les caractéristiques avant de faire votre choix.</p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">Notre catalogue</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Trouvez votre prochaine voiture</h2>
              <p className="mt-3 text-slate-600">Une sélection de véhicules pour vos déplacements.</p>
            </div>
            <Link to="/cars" className="inline-flex items-center gap-2 font-semibold text-indigo-700 hover:text-indigo-500">
              Voir toutes les voitures <ArrowRight size={18} />
            </Link>
          </div>
          {loading && <p className="mt-8 text-slate-600">Chargement...</p>}
          {error && <p role="alert" className="mt-8 text-red-600">{error}</p>}
          {!loading && !error && list.length === 0 && <p className="mt-8 text-slate-600">Aucune voiture disponible pour le moment.</p>}
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {list.slice(0, 3).map((car) => <CarCard key={car._id} car={car} />)}
          </div>
        </section>

        <section className="bg-slate-50 px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">Comment ça marche</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Trois étapes pour partir</h2>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {steps.map(({ icon, title, text }, index) => (
                <div key={title} className="rounded-2xl border border-slate-200 bg-white p-7">
                  <div className="flex items-center justify-between">
                    <span className="rounded-xl bg-indigo-50 p-3 text-indigo-600">{icon}</span>
                    <span className="text-sm font-bold text-slate-400">0{index + 1}</span>
                  </div>
                  <h3 className="mt-6 text-lg font-bold text-slate-900">{title}</h3>
                  <p className="mt-2 leading-relaxed text-slate-600">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
