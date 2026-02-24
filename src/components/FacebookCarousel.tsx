import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Modèle de données pour un post Facebook
interface FacebookPost {
  id: number;
  date: string;
  content: string;
  imageSrc: string;
  link: string;
}

// Fausses données (en attendant la connexion API ou le widget)
const mockPosts: FacebookPost[] = [
  {
    id: 1,
    date: "Il y a 2 jours",
    content:
      "Un immense merci aux bénévoles présents ce matin pour la préparation des 50 nouveaux colis à destination de l'Ukraine ! 🌻📦",
    imageSrc: "/historique/pam-aerien.jpg", // Mets une vraie image de test
    link: "https://www.facebook.com",
  },
  {
    id: 2,
    date: "La semaine dernière",
    content:
      "Retour en images sur notre superbe atelier de peinture traditionnelle de Pâques (Pysanka). Merci aux enfants pour leur créativité ! 🎨",
    imageSrc: "/historique/premier-evenement.jpg",
    link: "https://www.facebook.com",
  },
  {
    id: 3,
    date: "Il y a 2 semaines",
    content:
      "Le camion est bien arrivé ! La génératrice a pu être livrée à l'hôpital de Kharkiv. Merci à tous nos donateurs. 💙💛",
    imageSrc: "/historique/dernier-evenement.jpg",
    link: "https://www.facebook.com",
  },
];

export default function FacebookCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextPost = () => {
    setCurrentIndex((prev) => (prev === mockPosts.length - 1 ? 0 : prev + 1));
  };

  const prevPost = () => {
    setCurrentIndex((prev) => (prev === 0 ? mockPosts.length - 1 : prev - 1));
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      {/* En-tête du Carrousel */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Actualités
          </h2>
          <p className="text-xl text-site-text font-medium">
            Suivez nos dernières actions en direct sur Facebook.
          </p>
        </div>

        {/* Flèches de navigation */}
        <div className="flex gap-4">
          <button
            onClick={prevPost}
            className="w-12 h-12 rounded-full border-2 border-primary text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
            aria-label="Précédent"
          >
            ←
          </button>
          <button
            onClick={nextPost}
            className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center hover:bg-hover-nav hover:text-primary transition-colors shadow-md"
            aria-label="Suivant"
          >
            →
          </button>
        </div>
      </div>

      {/* Zone du Carrousel */}
      <div className="relative h-112.5 w-full overflow-hidden rounded-[30px] bg-bg-2 shadow-inner border border-primary/10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute inset-0 flex flex-col md:flex-row h-full"
          >
            {/* Image du Post */}
            <div className="w-full md:w-1/2 h-48 md:h-full overflow-hidden">
              <img
                src={mockPosts[currentIndex].imageSrc}
                alt="Illustration du post"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Contenu du Post */}
            <div className="w-full md:w-1/2 h-full flex flex-col justify-center p-8 md:p-12 bg-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                  f
                </div>
                <div>
                  <h3 className="font-bold text-primary">Cœur UA PAM</h3>
                  <span className="text-sm text-site-text/70">
                    {mockPosts[currentIndex].date}
                  </span>
                </div>
              </div>

              <p className="text-lg text-site-text leading-relaxed mb-8 italic">
                "{mockPosts[currentIndex].content}"
              </p>

              <a
                href={mockPosts[currentIndex].link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block self-start px-6 py-3 rounded-full bg-bg-2 text-primary font-bold hover:bg-primary hover:text-white transition-colors border border-primary/10"
              >
                Voir sur Facebook
              </a>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
