import { useState } from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="bg-primary text-white shadow-lg z-50 relative font-semibold">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-20">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary font-bold text-2xl group-hover:scale-110 transition-transform">
            UA
          </div>
          <span className="uppercase tracking-widest text-lg">
            Coeur UA PAM
          </span>
        </Link>

        {/* MENU */}
        <ul className="hidden md:flex items-center space-x-10">
          {/* Dropdown Evenements */}
          <li
            className="relative h-20 flex items-center cursor-pointer"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <span className="hover:text-hover-nav transition-colors uppercase">
              Événements
            </span>

            {isDropdownOpen && (
              <ul className="absolute top-20 left-0 w-64 bg-primary border-t-2 border-hover-nav shadow-2xl py-2 animate-in fade-in slide-in-from-top-2">
                <li>
                  <Link
                    to="/evenements/octobre-rose"
                    className="block px-6 py-3 hover:bg-blue-accent hover:text-hover-nav transition-colors"
                  >
                    Octobre Rose
                  </Link>
                </li>
                <li>
                  <Link
                    to="/evenements/noel"
                    className="block px-6 py-3 hover:bg-blue-accent hover:text-hover-nav transition-colors"
                  >
                    Noël des Ukrainiens
                  </Link>
                </li>
              </ul>
            )}
          </li>

          <li>
            <Link
              to="/historique"
              className="hover:text-hover-nav transition-colors uppercase"
            >
              Historique
            </Link>
          </li>

          <li>
            <Link
              to="/a-propos"
              className="text-hover-nav border-b-2 border-hover-nav pb-1 uppercase"
            >
              À propos
            </Link>
          </li>
        </ul>

        {/* BOUTON DON (Action) */}
        <button className="bg-heading hover:bg-heading-accent text-white px-6 py-2 rounded-sm transition-all shadow-md uppercase text-sm">
          Soutenir
        </button>
      </div>
    </nav>
  );
};
