import { Outlet, useLocation } from "react-router-dom";
import PillNav from "../components/PillNav";
import logo from "/logo.png";

export const MainLayout = () => {
  const location = useLocation();

  const themeColors = {
    primary: "#1a247f", // Bleu profond
    accent: "#f7f0e5", // Beige
    white: "#ffffff",
    red: "#751424",
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-1 font-sans text-site-text">
      {/* NAVIGATION */}
      <div className="fixed top-0 left-0 w-full z-50 flex justify-center pt-4 md:pt-6 pointer-events-none px-4 md:px-0">
        <div className="pointer-events-auto flex items-center justify-between w-full md:w-auto md:justify-center gap-4 max-w-400">
          <PillNav
            logo={logo}
            logoAlt="Coeur UA PAM Logo"
            items={[
              { label: "Accueil", href: "/" },
              { label: "L'Association", href: "/a-propos" },
              { label: "Notre histoire", href: "/notre-histoire" },
              { label: "Événements", href: "/evenements" },
            ]}
            activeHref={location.pathname}
            baseColor={themeColors.accent}
            pillColor={themeColors.accent}
            pillTextColor={themeColors.primary}
            hoveredPillTextColor={themeColors.white}
            ease="power2.out"
            initialLoadAnimation={true}
          />

          <a
            href="https://www.leetchi.com/fr/c/coeur-ua-pam-6398197"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center justify-center h-10.5 px-6 rounded-full bg-heading text-white font-semibold uppercase tracking-wider text-sm hover:bg-heading-accent hover:scale-105 transition-all shadow-lg border-2 border-transparent"
          >
            Soutenir
          </a>
        </div>
      </div>

      {/* CONTENU PRINCIPAL */}
      <div className="flex flex-1">
        <main className="flex-1 pb-10">
          <div className="w-full mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="w-full py-10 border-t border-primary/10 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Copyright & Nom */}
          <div className="flex flex-col items-center md:items-start gap-1">
            <div className="text-sm text-primary font-bold uppercase tracking-wider">
              Cœur UA PAM
            </div>
            <div className="text-xs text-primary/50 font-medium">
              © {new Date().getFullYear()} — Tous droits réservés.
            </div>
          </div>

          {/* Contact & Réseaux */}
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12">
            {/* Email */}
            <a
              href="mailto:coeuruapam@gmail.com"
              className="group flex flex-col items-center md:items-end"
            >
              <span className="text-[10px] uppercase tracking-[0.2em] text-primary/40 mb-1">
                Nous contacter
              </span>
              <span className="text-sm font-semibold text-primary group-hover:text-heading-accent transition-colors">
                coeuruapam@gmail.com
              </span>
            </a>

            {/* Facebook */}
            <a
              href="https://www.facebook.com/profile.php?id=61581993284332&sk=about"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-primary font-bold hover:text-heading-accent transition-colors"
            >
              <span className="text-xs uppercase tracking-widest">
                Suivez-nous
              </span>
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white group-hover:bg-heading-accent transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </div>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
