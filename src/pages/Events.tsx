import { useLayoutEffect, useRef, useState, useCallback } from "react";
import AnimatedContent from "../components/AnimatedContent";

// --- INTERFACES TYPESCRIPT ---
interface EventIntro {
  type: "intro";
  year: string;
  title: string;
  bg: string;
  text: string;
}

interface EventImage {
  type: "image";
  src: string;
  alt: string;
  imageTitle?: string;
  imageDesc?: string;
}

type HistoryItem = EventIntro | EventImage;

interface Category {
  id: string;
  title: string;
  description: string;
  themeColor: string;
  history: HistoryItem[];
}

interface YearGroup {
  year: string;
  title: string;
  bg: string;
  text: string;
  images: EventImage[];
}

// ============================================================================
// SOUS-COMPOSANT : Gère l'effet "Scroll Vertical -> Glissement Horizontal"
// ============================================================================
const CategoryHorizontalScroll = ({ category }: { category: Category }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [maxTranslate, setMaxTranslate] = useState(0);

  // 1. On regroupe les images par année
  const groupedHistory: YearGroup[] = [];
  let currentYear: YearGroup | null = null;

  category.history.forEach((item: HistoryItem) => {
    if (item.type === "intro") {
      const newYearGroup: YearGroup = {
        year: item.year,
        title: item.title,
        bg: item.bg,
        text: item.text,
        images: [],
      };
      groupedHistory.push(newYearGroup);
      currentYear = newYearGroup;
    } else if (item.type === "image" && currentYear) {
      currentYear.images.push(item);
    }
  });

  // 2. Logique de calcul du scroll
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    const maxScroll = rect.height - windowHeight;
    const currentScroll = -rect.top;

    let p = currentScroll / maxScroll;
    p = Math.max(0, Math.min(1, p));
    setProgress(p);
  }, []);

  useLayoutEffect(() => {
    const updateMeasurements = () => {
      if (trackRef.current) {
        const max = trackRef.current.scrollWidth - window.innerWidth + 80;
        setMaxTranslate(max > 0 ? max : 0);
      }
    };

    updateMeasurements();
    window.addEventListener("resize", updateMeasurements);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("resize", updateMeasurements);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const containerHeight = `${(groupedHistory.length + 1) * 80}vh`;

  return (
    <section
      ref={containerRef}
      style={{ height: containerHeight }}
      className="relative w-full"
    >
      <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden bg-bg-1">
        <div
          ref={trackRef}
          className="flex items-center gap-12 md:gap-24 w-max px-6 md:px-20 will-change-transform"
          style={{
            transform: `translate3d(-${progress * maxTranslate}px, 0, 0)`,
          }}
        >
          <div className="w-[85vw] md:w-[40vw] shrink-0 pl-2">
            <h2
              className={`text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 ${category.themeColor}`}
            >
              {category.title}
            </h2>
            <div className="w-20 h-2 bg-heading-accent rounded-full mb-8"></div>
            <p className="text-xl md:text-2xl text-site-text/80 leading-relaxed font-light">
              {category.description}
            </p>
          </div>

          {groupedHistory.map((yearGroup, index) => (
            <div
              key={index}
              className={`w-[85vw] md:w-[65vw] lg:w-[50vw] h-[65vh] md:h-[75vh] shrink-0 rounded-[40px] shadow-2xl flex flex-col p-6 md:p-10 border border-black/5 ${yearGroup.bg} ${yearGroup.text}`}
            >
              <div className="mb-6 flex flex-col gap-1">
                <h3 className="text-6xl md:text-7xl font-black opacity-90 tracking-tighter">
                  {yearGroup.year}
                </h3>
                <p className="text-2xl md:text-3xl font-medium">
                  {yearGroup.title}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 flex-1">
                {yearGroup.images.map((img, idx) => {
                  const total = yearGroup.images.length;
                  let spanClass = "col-span-1 row-span-1";

                  if (total === 1) {
                    spanClass = "col-span-2 md:col-span-3 row-span-2";
                  } else if (total === 2) {
                    spanClass =
                      idx === 0
                        ? "col-span-2 md:col-span-2"
                        : "col-span-2 md:col-span-1";
                  } else if (total >= 3) {
                    if (idx === 0) {
                      spanClass = "col-span-2 row-span-2";
                    } else {
                      let mobileSpan = "col-span-1";
                      let desktopSpan = "md:col-span-1";

                      if (idx === total - 1) {
                        if (total % 2 === 0) mobileSpan = "col-span-2";
                        if ((total - 3) % 3 === 1)
                          desktopSpan = "md:col-span-3";
                        if ((total - 3) % 3 === 2)
                          desktopSpan = "md:col-span-2";
                      }

                      spanClass = `${mobileSpan} ${desktopSpan} row-span-1`;
                    }
                  }

                  const isVideo =
                    img.src?.toLowerCase().endsWith(".mp4") ||
                    img.src?.toLowerCase().endsWith(".webm");

                  return (
                    <div
                      key={idx}
                      className={`relative rounded-2xl overflow-hidden bg-black/10 ${spanClass} group`}
                    >
                      {isVideo ? (
                        <video
                          src={img.src}
                          autoPlay
                          loop
                          muted
                          playsInline
                          preload="metadata"
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : img.src ? (
                        <img
                          src={img.src}
                          alt={img.alt}
                          loading="lazy"
                          decoding="async"
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-sm opacity-50 bg-white/10">
                          Pas de média
                        </div>
                      )}

                      {(img.imageTitle || img.imageDesc) && (
                        <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 bg-linear-to-t from-black/90 via-black/40 to-transparent">
                          {img.imageTitle && (
                            <h4 className="text-white font-bold text-base md:text-lg mb-1 drop-shadow-md">
                              {img.imageTitle}
                            </h4>
                          )}
                          {img.imageDesc && (
                            <p className="text-white/90 text-sm md:text-base leading-snug hidden md:block drop-shadow-sm">
                              {img.imageDesc}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// PAGE PRINCIPALE : Rend toutes les catégories
// ============================================================================
export default function Events() {
  const eventCategories: Category[] = [
    // ---------------------------------------------------------
    // 1. OCTOBRE ROSE
    // ---------------------------------------------------------
    {
      id: "octobre-rose",
      title: "Octobre Rose",
      description:
        "Cœur UA PAM s'engage activement dans la lutte contre le cancer du sein. Une cause qui nous tient à cœur et pour laquelle nous marchons et courons ensemble chaque année.",
      themeColor: "text-[#dd3775]",
      history: [
        {
          type: "intro",
          year: "2022",
          title: "Nos premiers pas en Rose",
          bg: "bg-[#751424]",
          text: "text-white",
        },
        {
          type: "image",
          src: "/evenements/octobre-rose/2022octobre-rose-1.webp",
          alt: "Première participation Octobre rose 2022 à PàM - Coeur UA PAM",
        },
        {
          type: "image",
          src: "/evenements/octobre-rose/2022octobre-rose-2.webp",
          alt: "Première participation Octobre rose 2022 à PàM - Coeur UA PAM",
        },
        {
          type: "image",
          src: "/evenements/octobre-rose/2022octobre-rose-3.webp",
          alt: "Première participation Octobre rose 2022 à PàM - Coeur UA PAM",
        },

        {
          type: "intro",
          year: "2023",
          title: "",
          bg: "bg-[#dd3775]",
          text: "text-white",
        },
        {
          type: "image",
          src: "/evenements/octobre-rose/2023octobre-rose-1.webp",
          alt: "Octobre rose 2023 à PàM - Coeur UA PAM",
        },
        {
          type: "image",
          src: "/evenements/octobre-rose/2023octobre-rose-2.webp",
          alt: "Octobre rose 2023 à PàM - Coeur UA PAM",
        },
        {
          type: "image",
          src: "/evenements/octobre-rose/2023octobre-rose-3.webp",
          alt: "Octobre rose 2023 à PàM - Coeur UA PAM",
        },

        {
          type: "intro",
          year: "2024",
          title: "",
          bg: "bg-[#751424]",
          text: "text-white",
        },
        {
          type: "image",
          src: "/evenements/octobre-rose/2024octobre-rose-1.webp",
          alt: "Octobre rose 2024 à PàM - Coeur UA PAM",
        },
        {
          type: "image",
          src: "/evenements/octobre-rose/2024octobre-rose-2.webp",
          alt: "Octobre rose 2024 à PàM - Coeur UA PAM",
        },
        {
          type: "image",
          src: "/evenements/octobre-rose/2024octobre-rose-3.webp",
          alt: "NOctobre rose 2024 à PàM - Coeur UA PAM",
        },
        {
          type: "image",
          src: "/evenements/octobre-rose/2024octobre-rose-4.webp",
          alt: "Octobre rose 2024 à PàM - Coeur UA PAM",
        },
        {
          type: "image",
          src: "/evenements/octobre-rose/2024octobre-rose-5.webp",
          alt: "Octobre rose 2024 à PàM - Coeur UA PAM",
        },
        {
          type: "image",
          src: "/evenements/octobre-rose/2024octobre-rose-6.webp",
          alt: "Octobre rose 2024 à PàM - Coeur UA PAM",
        },

        {
          type: "intro",
          year: "2025",
          title: "Toujours présent !",
          bg: "bg-[#dd3775]",
          text: "text-white",
        },
        {
          type: "image",
          src: "/evenements/octobre-rose/2025octobre-rose-1.webp",
          alt: "Octobre rose 2025 à PàM - Coeur UA PAM",
        },
        {
          type: "image",
          src: "/evenements/octobre-rose/2025octobre-rose-2.webp",
          alt: "Octobre rose 2025 à PàM - Coeur UA PAM",
        },
        {
          type: "image",
          src: "/evenements/octobre-rose/2025octobre-rose-3.webp",
          alt: "Octobre rose 2025 à PàM - Coeur UA PAM",
        },
        {
          type: "image",
          src: "/evenements/octobre-rose/2025octobre-rose-4.webp",
          alt: "Octobre rose 2025 à PàM - Coeur UA PAM",
        },
        {
          type: "image",
          src: "/evenements/octobre-rose/2025octobre-rose-5.webp",
          alt: "Octobre rose 2025 PàM - Coeur UA à PàM - Coeur UA PAM",
        },
      ],
    },

    // ---------------------------------------------------------
    // 2. REPAS DE NOËL
    // ---------------------------------------------------------
    {
      id: "repas-noel",
      title: "Repas de Noël",
      description:
        "Chaque année, nous organisons un grand repas traditionnel pour rassembler la communauté ukrainienne et nos soutiens locaux autour de plats typiques.",
      themeColor: "text-[#1a247f]",
      history: [
        {
          type: "intro",
          year: "2022",
          title: "Notre premier rassemblement",
          bg: "bg-[#f7f0e5]",
          text: "text-[#1a247f]",
        },
        {
          type: "image",
          src: "/evenements/noel-ukrainiens/2022noel-ukrainien-1.webp",
          alt: "Premier repas de Noël des ukrainiens à PàM 2022 - Coeur UA PAM",
        },
        {
          type: "image",
          src: "/evenements/noel-ukrainiens/2022noel-ukrainien-2.webp",
          alt: "Premier repas de Noël des ukrainiens à PàM 2022 - Coeur UA PAM",
        },
        {
          type: "image",
          src: "/evenements/noel-ukrainiens/2022noel-ukrainien-3.webp",
          alt: "Premier repas de Noël des ukrainiens à PàM 2022 - Coeur UA PAM",
        },
        {
          type: "image",
          src: "/evenements/noel-ukrainiens/2022noel-ukrainien-4.webp",
          alt: "Premier repas de Noël des ukrainiens à PàM 2022 - Coeur UA PAM",
        },
        {
          type: "image",
          src: "/evenements/noel-ukrainiens/2022noel-ukrainien-5.webp",
          alt: "Premier repas de Noël des ukrainiens à PàM 2022 - Coeur UA PAM",
        },
        {
          type: "image",
          src: "/evenements/noel-ukrainiens/2022noel-ukrainien-6.webp",
          alt: "Premier repas de Noël des ukrainiens à PàM 2022 - Coeur UA PAM",
        },

        {
          type: "intro",
          year: "2023",
          title: "Partage et Découvertes",
          bg: "bg-[#1a247f]",
          text: "text-white",
        },
        {
          type: "image",
          src: "/evenements/noel-ukrainiens/2023noel-ukrainien-1.webp",
          alt: "Repas de Noël des ukrainiens à PàM 2023 - Coeur UA PAM",
        },
        {
          type: "image",
          src: "/evenements/noel-ukrainiens/2023noel-ukrainien-2.webp",
          alt: "Repas de Noël des ukrainiens à PàM 2023 - Coeur UA PAM",
        },
        {
          type: "image",
          src: "/evenements/noel-ukrainiens/2023noel-ukrainien-3.webp",
          alt: "Repas de Noël des ukrainiens à PàM 2023 - Coeur UA PAM",
        },
        {
          type: "image",
          src: "/evenements/noel-ukrainiens/2023noel-ukrainien-4.webp",
          alt: "Repas de Noël des ukrainiens à PàM 2023 - Coeur UA PAM",
        },
        {
          type: "image",
          src: "/evenements/noel-ukrainiens/2023noel-ukrainien-5.webp",
          alt: "Repas de Noël des ukrainiens à PàM 2023 - Coeur UA PAM",
        },
        {
          type: "image",
          src: "/evenements/noel-ukrainiens/2023noel-ukrainien-6.webp",
          alt: "Repas de Noël des ukrainiens à PàM 2023 - Coeur UA PAM",
        },

        {
          type: "intro",
          year: "2024",
          title: "Un Noël de Solidarité",
          bg: "bg-[#f7f0e5]",
          text: "text-[#1a247f]",
        },
        {
          type: "image",
          src: "/evenements/noel-ukrainiens/2024noel-ukrainien-1.mp4",
          alt: "epas de Noël des ukrainiens à PàM 2024 - Coeur UA PAM",
        },
        {
          type: "image",
          src: "/evenements/noel-ukrainiens/2024noel-ukrainien-1.webp",
          alt: "Repas de Noël des ukrainiens à PàM 2024 - Coeur UA PAM",
        },

        {
          type: "intro",
          year: "2025",
          title: "La tradition perdure",
          bg: "bg-[#1a247f]",
          text: "text-white",
        },
        {
          type: "image",
          src: "/evenements/noel-ukrainiens/2025noel-ukrainien-1.mp4",
          alt: "Repas de Noël des ukrainiens à PàM 2025 - Coeur UA PAM",
        },
        {
          type: "image",
          src: "/evenements/noel-ukrainiens/2025noel-ukrainien-1.webp",
          alt: "Repas de Noël des ukrainiens à PàM 2025 - Coeur UA PAM",
        },
        {
          type: "image",
          src: "/evenements/noel-ukrainiens/2025noel-ukrainien-2.webp",
          alt: "Repas de Noël des ukrainiens à PàM 2025 - Coeur UA PAM",
        },
      ],
    },

    // // ---------------------------------------------------------
    // // 3. MARCHÉ DE NOËL
    // // ---------------------------------------------------------
    // {
    //   id: "marche-noel",
    //   title: "Marchés de Noël",
    //   description:
    //     "Retrouvez-nous sur nos stands lors des marchés de Noël locaux pour découvrir l'artisanat ukrainien, parfait pour des cadeaux originaux et solidaires.",
    //   themeColor: "text-[#dfbe85]",
    //   history: [
    //     {
    //       type: "intro",
    //       year: "2022",
    //       title: "Premier marché",
    //       bg: "bg-white",
    //       text: "text-[#1a247f]",
    //     },
    //     {
    //       type: "image",
    //       src: "/evenements/marche-noel-2022-1.webp",
    //       alt: "Installation du stand",
    //     },

    //     {
    //       type: "intro",
    //       year: "2023",
    //       title: "Nos bénévoles mobilisés",
    //       bg: "bg-[#dfbe85]",
    //       text: "text-white",
    //     },
    //     {
    //       type: "image",
    //       src: "/evenements/marche-noel-2023-1.webp",
    //       alt: "Bénévoles au stand",
    //     },

    //     {
    //       type: "intro",
    //       year: "2024",
    //       title: "Succès solidaire",
    //       bg: "bg-[#1a247f]",
    //       text: "text-white",
    //     },
    //     {
    //       type: "image",
    //       src: "/evenements/marche-noel-2024-1.webp",
    //       alt: "Créations faites main",
    //     },

    //     {
    //       type: "intro",
    //       year: "2025",
    //       title: "L'artisanat à l'honneur",
    //       bg: "bg-[#dfbe85]",
    //       text: "text-white",
    //     },
    //     {
    //       type: "image",
    //       src: "/evenements/marche-noel-2025-1.webp",
    //       alt: "Stand 2025",
    //     },
    //   ],
    // },

    // // ---------------------------------------------------------
    // // 4. COMMÉMORATIONS
    // // ---------------------------------------------------------
    // {
    //   id: "commemorations",
    //   title: "Commémorations",
    //   description:
    //     "Le devoir de mémoire est essentiel. Nous nous rassemblons pour honorer les victimes du conflit et rappeler notre soutien indéfectible à l'Ukraine.",
    //   themeColor: "text-gray-800",
    //   history: [
    //     {
    //       type: "intro",
    //       year: "2023",
    //       title: "1 an de conflit",
    //       bg: "bg-gray-800",
    //       text: "text-white",
    //     },
    //     {
    //       type: "image",
    //       src: "/evenements/commemoration-2023-1.webp",
    //       alt: "Minute de silence",
    //     },

    //     {
    //       type: "intro",
    //       year: "2024",
    //       title: "2 ans de résilience",
    //       bg: "bg-gray-200",
    //       text: "text-gray-900",
    //     },
    //     {
    //       type: "image",
    //       src: "/evenements/commemoration-2024-1.webp",
    //       alt: "Rassemblement sur la place",
    //     },

    //     {
    //       type: "intro",
    //       year: "2025",
    //       title: "Ne jamais oublier",
    //       bg: "bg-gray-800",
    //       text: "text-white",
    //     },
    //     {
    //       type: "image",
    //       src: "/evenements/commemoration-2025-1.webp",
    //       alt: "Commémoration 2025",
    //     },
    //   ],
    // },

    // // ---------------------------------------------------------
    // // 5. AUTRES ÉVÉNEMENTS
    // // ---------------------------------------------------------
    // {
    //   id: "autres-evenements",
    //   title: "Autres Événements",
    //   description:
    //     "Concerts, courses relais, ateliers créatifs... L'association se mobilise sur tous les fronts pour faire rayonner la culture ukrainienne.",
    //   themeColor: "text-primary",
    //   history: [
    //     {
    //       type: "intro",
    //       year: "2022",
    //       title: "Les débuts de l'entraide",
    //       bg: "bg-white",
    //       text: "text-primary",
    //     },
    //     {
    //       type: "image",
    //       src: "/evenements/autres-2022-1.webp",
    //       alt: "Collecte de dons",
    //     },

    //     {
    //       type: "intro",
    //       year: "2023",
    //       title: "De nouvelles initiatives",
    //       bg: "bg-[#1a247f]",
    //       text: "text-white",
    //     },
    //     {
    //       type: "image",
    //       src: "/evenements/autres-2023-1.webp",
    //       alt: "Exposition photo",
    //       imageTitle: "Exposition 'Regards d'Ukraine'",
    //       imageDesc: "Une semaine d'exposition à la mairie.",
    //     },

    //     {
    //       type: "intro",
    //       year: "2024",
    //       title: "Défis et Culture",
    //       bg: "bg-white",
    //       text: "text-primary",
    //     },
    //     {
    //       type: "image",
    //       src: "/evenements/autres-2024-1.webp",
    //       alt: "Course relais",
    //       imageTitle: "Course Relais Solidaire",
    //       imageDesc: "Nos membres ont couru 50km pour lever des fonds.",
    //     },
    //     {
    //       type: "image",
    //       src: "/evenements/autres-2024-2.webp",
    //       alt: "Atelier Pysanky",
    //     },

    //     {
    //       type: "intro",
    //       year: "2025",
    //       title: "Toujours en action",
    //       bg: "bg-[#1a247f]",
    //       text: "text-white",
    //     },
    //     {
    //       type: "image",
    //       src: "/evenements/autres-2025-1.webp",
    //       alt: "Concert caritatif",
    //       imageTitle: "Concert pour la Paix",
    //       imageDesc: "La chorale a réuni plus de 200 spectateurs.",
    //     },
    //   ],
    // },
  ];

  return (
    <div className="w-full max-w-[100vw] overflow-x-clip pb-20 flex flex-col gap-16 md:gap-24 bg-bg-1">
      <AnimatedContent distance={60} direction="vertical" duration={1}>
        <div className="relative w-full h-[80vh] min-h-125 overflow-hidden shadow-2xl group">
          <img
            src="/hero-section/evenements.webp"
            alt="Historique Association"
            className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-[10s] ease-linear group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-primary/90 via-primary/40 to-transparent"></div>

          <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 flex flex-col items-start z-10">
            <span className="inline-block px-4 py-1 rounded-full bg-hover-nav text-primary font-bold uppercase tracking-widest mb-4">
              Nos événements
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Nos événements.
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-light max-w-2xl leading-relaxed">
              Revivez l'histoire de nos mobilisations en images, année après
              année.
            </p>
          </div>
        </div>
      </AnimatedContent>

      {/* DÉFILEMENT DES CATÉGORIES ACTIVÉ */}
      <div className="w-full flex flex-col">
        {eventCategories.map((category) => (
          <CategoryHorizontalScroll key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}
