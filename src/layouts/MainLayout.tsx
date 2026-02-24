import { Outlet, useLocation } from "react-router-dom";
import PillNav from "../components/PillNav";
import logo from "/logo.png";

export const MainLayout = () => {
  const location = useLocation();

  // On simplifie la palette pour le PillNav
  const themeColors = {
    primary: "#1a247f", // Bleu profond
    accent: "#f7f0e5", // Beige
    white: "#ffffff", // Blanc
    red: "#751424",
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-1 font-sans text-site-text">
      <div className="fixed top-0 left-0 w-full z-50 flex justify-center pt-4 md:pt-6 pointer-events-none px-4 md:px-0">
        <div className="pointer-events-auto flex items-center justify-between w-full md:w-auto md:justify-center gap-4 max-w-400">
          <PillNav
            logo={logo}
            logoAlt="Coeur UA PAM Logo"
            items={[
              { label: "Accueil", href: "/" },
              { label: "À Propos", href: "/a-propos" },
              { label: "Historique", href: "/historique" },
              { label: "Événements", href: "/evenements" },
            ]}
            activeHref={location.pathname}
            // LOGIQUE DES COULEURS RÉPARÉE :
            baseColor={themeColors.accent} // Fond de la barre : BEIGE
            pillColor={themeColors.accent} // Fond des boutons normaux : BEIGE
            pillTextColor={themeColors.primary} // Texte normal : Bleu sur BEIGE
            hoveredPillTextColor={themeColors.white} // Texte survolé : Blanc sur Bleu
            ease="power2.out"
            initialLoadAnimation={true}
          />

          {/* Bouton SOUTENIR */}
          <a
            href="https://www.leetchi.com/fr/c/coeur-ua-pam-6398197?utm_source=copylink&utm_medium=social_sharing://www.helloasso.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center justify-center h-10.5 px-6 rounded-full bg-heading text-white font-semibold uppercase tracking-wider text-sm hover:bg-heading-accent hover:scale-105 transition-all shadow-lg border-2 border-transparent"
          >
            Soutenir
          </a>
        </div>
      </div>

      <div className="flex flex-1">
        <main className="flex-1 pb-10 px md">
          <div className="w-full mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
