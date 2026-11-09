import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const Footer = () => (
  <footer className="bg-slate-950 px-6 py-14 text-slate-300">
    <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">
      <div>
        <Link to="/" className="text-2xl font-bold tracking-tight text-white">Car<span className="text-indigo-400">Hire</span></Link>
        <p className="mt-4 max-w-xs text-sm leading-7 text-slate-400">Une façon simple de trouver et de réserver votre prochaine voiture.</p>
      </div>
      <div>
        <h2 className="text-sm font-bold uppercase tracking-widest text-white">Navigation</h2>
        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
          {[["Home", "/"], ["About", "/about"], ["Our Cars", "/cars"], ["Reservation", "/reservation"], ["Contact", "/contact"]].map(([label, path]) => (
            <Link key={path} to={path} className="hover:text-white">{label}</Link>
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-sm font-bold uppercase tracking-widest text-white">Une question ?</h2>
        <p className="mt-5 text-sm leading-6 text-slate-400">Notre formulaire de contact est à votre disposition.</p>
        <Link to="/contact" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-indigo-300 hover:text-white">Nous contacter <ArrowUpRight size={16} /></Link>
        <p className="mt-4 text-sm text-slate-400">contact@carhire.tn · +216 12 345 678</p>
        <div className="mt-4 flex gap-4 text-sm">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">Facebook</a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">Instagram</a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">Twitter</a>
        </div>
      </div>
    </div>
    <div className="mx-auto mt-12 max-w-7xl border-t border-slate-800 pt-6 text-sm text-slate-500">
      &copy; {new Date().getFullYear()} CarHire. Tous droits réservés.
    </div>
  </footer>
);

export default Footer;
