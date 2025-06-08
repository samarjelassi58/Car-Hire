import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link , useLocation } from 'react-router-dom'; // ← pour connaître l'URL actuelle

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Our Cars', href: '/cars' },
  { name: 'Reservation', href: '/reservation' },
  { name: 'Contact', href: '/contact' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}
const Navbar = () => {
  const location = useLocation();

  return (
    <Disclosure as="nav" className="bg-white fixed top-0 left-0 right-0 z-50 shadow-md">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">

          {/* Mobile menu button */}
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset">
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="block h-6 w-6 group-data-open:hidden" />
              <XMarkIcon className="hidden h-6 w-6 group-data-open:block" />
            </DisclosureButton>
          </div>

          {/* Logo & Nav */}
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
               <Link to="/">
               <img className="h-10 w-auto" src="/images/logo.png" alt="CarHire" />
               </Link>
              
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;

                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        isActive
                          ? 'bg-indigo-600 text-white'
                          : 'text-gray-600 hover:bg-indigo-100 hover:text-indigo-700',
                        'rounded-md px-3 py-2 text-sm font-medium transition'
                      )}
                    >
                      {item.name}
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Login Button */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <a
              href="/login"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition"
            >
              Login
            </a>
          </div>
        </div>
      </div>

      {/* Mobile nav panel */}
      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;

            return (
              <DisclosureButton
                key={item.name}
                as="a"
                href={item.href}
                className={classNames(
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-700 hover:bg-indigo-100 hover:text-indigo-800',
                  'block rounded-md px-3 py-2 text-base font-medium'
                )}
              >
                {item.name}
              </DisclosureButton>
            );
          })}

          <a
            href="/login"
            className="block mt-2 rounded-md bg-indigo-600 text-white px-3 py-2 text-base font-medium text-center hover:bg-indigo-700 transition"
          >
            Login
          </a>
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
export default Navbar;