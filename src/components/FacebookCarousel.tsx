import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Modèle de données pour un post Facebook
interface FacebookPost {
  id: number | string;
  date: string;
  content: string;
  imageSrc: string;
  link: string;
}

// Interface pour la réponse de l'API Facebook
interface FacebookApiPost {
  id: string;
  created_time: string;
  message?: string;
  full_picture?: string;
  permalink_url: string;
  attachments?: {
    data: Array<{
      title?: string;
      media?: {
        image?: { src: string };
      };
    }>;
  };
}

// Interface pour la récupération des comptes (pages)
interface FacebookAccountResponse {
  data: Array<{
    id: string;
    access_token: string;
  }>;
}

// Composant Spinner
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-full w-full">
    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const ErrorMessage = () => (
  <div className="flex flex-col items-center justify-center h-full w-full text-primary font-medium p-6 text-center">
    <p className="mb-6 italic text-lg text-site-text/70">
      Suivez nos dernières actions directement sur Facebook.
    </p>
    <a
      href="https://www.facebook.com/profile.php?id=819434444588954"
      target="_blank"
      rel="noopener noreferrer"
      className="px-8 py-3 rounded-full bg-primary text-white font-bold uppercase tracking-wider hover:bg-heading-accent transition-all shadow-lg text-sm"
    >
      Voir la page Facebook
    </a>
  </div>
);

// Utilitaire pour formater la date (ex: "Il y a 2 jours")
const timeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "À l'instant";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `Il y a ${minutes} minute${minutes > 1 ? "s" : ""}`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Il y a ${hours} heure${hours > 1 ? "s" : ""}`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `Il y a ${days} jour${days > 1 ? "s" : ""}`;
  const months = Math.floor(days / 30);
  if (months < 12) return `Il y a ${months} mois`;
  return `Il y a ${Math.floor(days / 365)} an(s)`;
};

export default function FacebookCarousel() {
  const [posts, setPosts] = useState<FacebookPost[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Gestion du défilement automatique
  useEffect(() => {
    // On n'active pas l'autoplay si : chargement, erreur, pas assez de posts, ou pause (souris dessus)
    if (loading || error || posts.length < 2 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === posts.length - 1 ? 0 : prev + 1));
    }, 5000); // Change toutes les 5 secondes

    return () => clearInterval(interval);
  }, [loading, error, posts.length, isPaused]);

  useEffect(() => {
    const fetchFacebookPosts = async () => {
      const pageId = import.meta.env.VITE_FACEBOOK_PAGE_ID;
      const accessToken = import.meta.env.VITE_FACEBOOK_ACCESS_TOKEN;

      if (!accessToken || accessToken.includes("ton_token")) {
        setLoading(false);
        setError(true);
        return;
      }

      const baseUrl = import.meta.env.DEV
        ? "/api/facebook"
        : "https://graph.facebook.com/v19.0";

      const fields =
        "id,created_time,message,full_picture,permalink_url,attachments";

      try {
        let url = `${baseUrl}/${pageId}/posts?fields=${fields}&limit=6&access_token=${accessToken}`;
        // 'credentials: omit' évite d'envoyer des cookies tiers, ce qui réduit les blocages CORS/Pistage
        let response = await fetch(url, {
          mode: "cors",
          credentials: "omit",
        });
        let data = await response.json();

        // --- MODE DEV UNIQUEMENT : Récupération automatique du Page Token ---
        // Si l'API rejette le token (Code 190 = Invalid OAuth, souvent car c'est un User Token au lieu d'un Page Token)
        if (
          import.meta.env.DEV &&
          data.error &&
          (data.error.code === 190 || data.error.code === 100)
        ) {
          console.log(
            "🔄 Token rejeté. Tentative de récupération du Page Token via l'API...",
          );
          try {
            const accountsRes = await fetch(
              `${baseUrl}/me/accounts?access_token=${accessToken}`,
            );
            const accountsData =
              (await accountsRes.json()) as FacebookAccountResponse;
            const pageData = accountsData.data?.find((p) => p.id === pageId);

            if (pageData?.access_token) {
              console.log(
                "%c✅ SUCCÈS ! Voici le TOKEN DE PAGE à mettre dans votre .env :",
                "color: green; font-weight: bold; font-size: 12px;",
              );
              console.log(pageData.access_token);

              // On réessaie la requête avec le bon token
              url = `${baseUrl}/${pageId}/posts?fields=${fields}&limit=6&access_token=${pageData.access_token}`;
              response = await fetch(url);
              data = await response.json();
            }
          } catch {
            console.warn(
              "Impossible de récupérer le Page Token automatiquement.",
            );
          }
        }

        if (!response.ok || data.error) {
          console.error(
            "Erreur API Facebook:",
            data.error || response.statusText,
          );
          throw new Error("API Error");
        }

        if (data.data && data.data.length > 0) {
          const formattedPosts = (data.data as FacebookApiPost[]).map(
            (post) => {
              let imageSrc =
                post.full_picture ||
                post.attachments?.data[0]?.media?.image?.src ||
                "/logo.png";

              // En DEV : On passe par le proxy pour éviter le blocage "Tracking Protection" du navigateur
              if (import.meta.env.DEV && imageSrc.startsWith("http")) {
                imageSrc = `/api/proxy-image?url=${encodeURIComponent(imageSrc)}`;
              }

              return {
                id: post.id,
                date: timeAgo(post.created_time),
                content:
                  post.message ||
                  post.attachments?.data[0]?.title ||
                  "Découvrez ce contenu directement sur notre page Facebook.",
                imageSrc,
                link: post.permalink_url,
              };
            },
          );

          if (formattedPosts.length > 0) {
            setPosts(formattedPosts);
          }
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchFacebookPosts();
  }, []);

  const nextPost = () => {
    setCurrentIndex((prev) => (prev === posts.length - 1 ? 0 : prev + 1));
  };

  const prevPost = () => {
    setCurrentIndex((prev) => (prev === 0 ? posts.length - 1 : prev - 1));
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
        {posts.length > 0 && !loading && !error && (
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
        )}
      </div>

      {/* Zone du Carrousel */}
      <div
        className="relative h-112.5 w-full overflow-hidden rounded-[30px] bg-bg-2 shadow-inner border border-primary/10"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {loading ? (
          <LoadingSpinner />
        ) : error || posts.length === 0 ? (
          <ErrorMessage />
        ) : (
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
                  src={posts[currentIndex].imageSrc}
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
                      {posts[currentIndex].date}
                    </span>
                  </div>
                </div>

                <p className="text-lg text-site-text leading-relaxed mb-8 italic line-clamp-6">
                  "{posts[currentIndex].content}"
                </p>

                <a
                  href={posts[currentIndex].link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block self-start px-6 py-3 rounded-full bg-bg-2 text-primary font-bold hover:bg-primary hover:text-white transition-colors border border-primary/10"
                >
                  Voir sur Facebook
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
