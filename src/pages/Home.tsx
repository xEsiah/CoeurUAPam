import { Link } from "react-router-dom";
import AnimatedContent from "../components/AnimatedContent";

const Home = () => {
  return (
    <div className="w-full pb-20">
      {/* --- HERO SECTION --- */}
      <AnimatedContent distance={50} direction="vertical" duration={1}>
        <div className="relative w-full h-[80vh] min-h-150  overflow-hidden mb-12 shadow-2xl group">
          {/* Image de fond avec effet de zoom lent au survol */}
          <img
            src="/hero-section/accueil.jpg"
            alt="Accueil Association"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[10s] ease-linear group-hover:scale-105"
          />

          {/* Gradient Overlay pour lisibilité */}
          <div className="absolute inset-0 bg-linear-to-t from-primary/90 via-primary/40 to-transparent"></div>

          {/* Contenu Hero */}
          <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 flex flex-col items-start">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-none tracking-tight">
              Unir. Aider. <br />
              <span className="text-hover-nav">Partager.</span>
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mb-8 font-light">
              L'association franco-ukrainienne au cœur de l'action. Rejoignez
              notre mouvement pour la culture et la solidarité.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/evenements"
                className="px-8 py-4 rounded-full bg-white text-primary font-bold uppercase tracking-wider hover:bg-hover-nav hover:text-primary transition-all shadow-lg"
              >
                Nos Événements
              </Link>
              <a
                href="https://www.helloasso.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-full bg-heading text-white font-bold uppercase tracking-wider hover:bg-heading-accent transition-all shadow-lg"
              >
                Faire un don
              </a>
            </div>
          </div>
        </div>
      </AnimatedContent>

      {/* --- BENTO GRID NAVIGATION --- */}
      {/* Une grille moderne pour présenter les sections clés */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        {/* CARTE 1 : Historique (Prend 1 colonne) */}
        <div className="md:col-span-1">
          <AnimatedContent
            distance={30}
            direction="vertical"
            delay={0.2}
            className="h-full"
          >
            <Link to="/historique" className="block h-full group">
              <div className="relative h-full min-h-100 bg-bg-2  p-10 flex flex-col justify-between overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
                <div className="z-10">
                  <span className="inline-block px-4 py-1 rounded-full border border-heading text-heading text-xs font-bold uppercase tracking-widest mb-4">
                    Notre histoire
                  </span>
                  <h3 className="text-3xl font-bold text-primary mb-2">
                    D'où venons-nous ?
                  </h3>
                  <p className="text-site-text opacity-80">
                    Découvrez l'origine de notre engagement et nos fondateurs.
                  </p>
                </div>

                {/* Élément décoratif visuel */}
                <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-hover-nav rounded-full opacity-20 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="absolute bottom-8 right-8 w-12 h-12 rounded-full bg-white flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  ➝
                </div>
              </div>
            </Link>
          </AnimatedContent>
        </div>

        {/* CARTE 2 : Événement Phare (Prend 2 colonnes) */}
        <div className="md:col-span-2">
          <AnimatedContent
            distance={30}
            direction="vertical"
            delay={0.4}
            className="h-full"
          >
            <Link to="/evenements" className="block h-full group">
              <div className="relative h-full min-h-100  overflow-hidden shadow-lg">
                <img
                  src="/home/nos-grands-rdv.jpg"
                  alt="Événement à la une"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"></div>

                <div className="absolute bottom-0 left-0 p-10 w-full">
                  <span className="inline-block px-4 py-1 rounded-full bg-white text-heading-accent text-xs font-bold uppercase tracking-widest mb-4">
                    À ne pas manquer
                  </span>
                  <h3 className="text-4xl font-bold text-white mb-2">
                    Nos grands rendez-vous
                  </h3>
                  <p className="text-white/90 text-lg max-w-lg">
                    Octobre Rose, Noël Ukrainien... Participez à nos moments
                    forts de partage et de culture.
                  </p>
                </div>
              </div>
            </Link>
          </AnimatedContent>
        </div>
      </div>

      {/* --- SECTION CHIFFRES / IMPACT (Style minimaliste) --- */}
      <AnimatedContent
        distance={40}
        direction="vertical"
        delay={0.2}
        threshold={0.5}
      >
        <div className="bg-primary  p-12 md:p-24 text-center text-white relative overflow-hidden">
          {/* Pattern décoratif en fond (optionnel) */}
          <div
            className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle, #dfbe85 1px, transparent 1px)",
              backgroundSize: "30px 30px",
            }}
          ></div>

          <h2 className="text-3xl md:text-5xl font-bold mb-16 relative z-10">
            Ensemble, nous faisons la différence
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
            <div>
              <span className="block text-6xl md:text-7xl font-bold text-hover-nav mb-2">
                50+
              </span>
              <span className="text-lg uppercase tracking-widest opacity-80">
                Bénévoles Actifs
              </span>
            </div>
            <div>
              <span className="block text-6xl md:text-7xl font-bold text-hover-nav mb-2">
                100s
              </span>
              <span className="text-lg uppercase tracking-widest opacity-80">
                Colis Envoyés
              </span>
            </div>
            <div>
              <span className="block text-6xl md:text-7xl font-bold text-hover-nav mb-2">
                ∞
              </span>
              <span className="text-lg uppercase tracking-widest opacity-80">
                Moments Partagés
              </span>
            </div>
          </div>
        </div>
      </AnimatedContent>
    </div>
  );
};

export default Home;
