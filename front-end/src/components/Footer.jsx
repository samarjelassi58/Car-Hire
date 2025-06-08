import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-14 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Logo & Description */}
        <div>
          <h3 className="text-3xl font-bold mb-3 text-indigo-500">CarHire</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Your trusted partner for reliable car rentals across Tunisia. Discover freedom on the road with CarHire.
          </p>
        </div>

        {/* Navigation Links */}
        <div>
          <h4 className="text-lg font-semibold mb-5 text-indigo-400">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {[
              { label: 'Home', href: '/' },
              { label: 'About', href: '/about' },
              { label: 'Our Cars', href: '/cars' },
              { label: 'Reservation', href: '/reservation' },
              { label: 'Contact', href: '/contact' },
            ].map(({ label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact & Social Media */}
        <div>
          <h4 className="text-lg font-semibold mb-5 text-indigo-400">Contact</h4>
          <div className="text-gray-400 text-sm space-y-3">
            <p className="flex items-center gap-2">
              <EnvelopeIcon className="w-5 h-5 text-indigo-500" />
              contact@carhire.tn
            </p>
            <p className="flex items-center gap-2">
              <PhoneIcon className="w-5 h-5 text-indigo-500" />
              +216 12 345 678
            </p>
          </div>
          <div className="flex space-x-4 mt-6">
            {[
              { icon: <FaFacebookF />, href: 'https://facebook.com', color: 'hover:bg-blue-600' },
              { icon: <FaInstagram />, href: 'https://instagram.com', color: 'hover:bg-pink-600' },
              { icon: <FaTwitter />, href: 'https://twitter.com', color: 'hover:bg-sky-500' },
            ].map(({ icon, href, color }, i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:text-white transition-colors ${color}`}
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-12 pt-6 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} CarHire. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
