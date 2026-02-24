import { useState } from "react";
import AnimatedContent from "../components/AnimatedContent";
import Stepper, { Step } from "../components/Stepper";
// import FacebookCarousel from "../components/FacebookCarousel";

const StepWithBackground = ({
  date,
  title,
  text,
  imageSrc,
  children,
}: {
  date: string;
  title: string;
  text: string;
  imageSrc: string;
  children?: React.ReactNode;
}) => (
  <div className="relative w-full min-h-125 rounded-[30px] overflow-hidden shadow-xl group">
    <div
      className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-[20s] ease-linear group-hover:scale-110"
      style={{ backgroundImage: `url('${imageSrc}')` }}
    ></div>
    <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-colors duration-700"></div>
    <div className="relative z-10 flex flex-col justify-center h-full p-8 md:p-16 text-center md:text-left">
      <span className="inline-block self-center md:self-start px-4 py-1 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 font-bold uppercase tracking-widest mb-6">
        {date}
      </span>
      <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight drop-shadow-md">
        {title}
      </h2>
      {children && <div className="mb-8">{children}</div>}
      <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-3xl drop-shadow-sm font-medium">
        {text}
      </p>
    </div>
  </div>
);

const Historic = () => {
  const [isTimelineCompleted, setIsTimelineCompleted] = useState(false);

  return (
    <div className="w-full pb-20 flex flex-col gap-16 md:gap-24">
      {/* =======================
          SECTION HERO 
      ========================*/}
      <AnimatedContent distance={50} direction="vertical" duration={1}>
        <div className="relative w-full h-[80vh] min-h-125 overflow-hidden shadow-2xl group">
          <img
            src="/hero-section/historique.jpg"
            alt="Historique Association"
            className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-[10s] ease-linear group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-primary/90 via-primary/40 to-transparent"></div>

          <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 flex flex-col items-start">
            <span className="inline-block px-4 py-1 rounded-full bg-hover-nav text-primary font-bold uppercase tracking-widest mb-4">
              Notre histoire
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              D'une urgence <br /> à une association unie
            </h1>
            <p className="text-xl text-white/90 max-w-2xl font-light leading-relaxed">
              Découvrez comment Cœur UA PAM est née d'un élan de solidarité
              spontané pour devenir un véritable pont culturel et humanitaire.
            </p>
          </div>
        </div>
      </AnimatedContent>

      {/* =======================
          SECTION STEPPER 
      ========================*/}
      <AnimatedContent distance={40} direction="vertical" delay={0.2}>
        {!isTimelineCompleted ? (
          <Stepper
            initialStep={1}
            onFinalStepCompleted={() => setIsTimelineCompleted(true)}
            backButtonText="Précédent"
            nextButtonText="Continuer l'histoire"
            contentClassName="!px-0 md:!px-0"
            stepContainerClassName="!pb-4"
          >
            {/* ETAPE 1 */}
            <Step>
              <StepWithBackground
                date="Mars 2022"
                title="L'arrivée en France"
                text="Suite au déclenchement du conflit, les premières familles ukrainiennes arrivent dans notre région. Un élan de solidarité local se met immédiatement en place pour les accueillir, les loger et répondre à l'urgence de la situation."
                imageSrc="/historique/arrivee.jpg"
              />
            </Step>

            {/* ETAPE 2 */}
            <Step>
              <StepWithBackground
                date="Octobre 2022"
                title="Les premiers événements"
                text="Très vite, le besoin de se retrouver et de partager se fait ressentir. Des bénévoles français et ukrainiens organisent les premiers rassemblements, des collectes de dons et des moments d'échange pour apaiser les cœurs."
                imageSrc="/historique/premier-evenement.jpg"
              />
            </Step>

            {/* ETAPE 3 */}
            <Step>
              <StepWithBackground
                date="19 juin 2025"
                title="La création officielle"
                text="Pour structurer nos actions éducatives (apprentissage du français, maintien de l'ukrainien pour les enfants) et amplifier nos envois humanitaires, nous fondons officiellement l'association Cœur UA PAM."
                imageSrc="/historique/signature-statuts.jpg"
              >
                <div className="border-l-4 border-hover-nav pl-6 mb-2 bg-white/10 p-4 rounded-r-xl backdrop-blur-sm max-w-2xl">
                  <p className="text-white font-bold italic text-xl">
                    "Il nous fallait un cadre légal pour agir plus fort et plus
                    loin."
                  </p>
                </div>
              </StepWithBackground>
            </Step>

            {/* ETAPE 4 */}
            <Step>
              <StepWithBackground
                date="Aujourd'hui"
                title="Un pont entre deux pays"
                text="Aujourd'hui, l'association est un véritable carrefour culturel. Nous continuons sans relâche nos actions : ateliers pour enfants, événements culturels grand public (Octobre Rose, Noël), et logistique d'envoi de colis pour les combattants ukrainiens."
                imageSrc="/historique/dernier-evenement.jpg"
              />
            </Step>
          </Stepper>
        ) : (
          /* MESSAGE DE FIN (Remplace le Stepper une fois terminé) */
          <div className="relative w-full py-24 md:py-32 text-center border-y border-primary/20 overflow-hidden rounded-[30px] shadow-xl">
            <div
              className="absolute inset-0 w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: `url('/historique/champs-ukraine.jpg')`,
              }}
            ></div>
            <div className="absolute inset-0 bg-black/50"></div>

            <div className="relative z-10 max-w-4xl mx-auto px-4">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 shadow-sm">
                L'histoire continue avec vous
              </h2>
              <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto drop-shadow-md">
                Chaque jour, de nouvelles pages s'écrivent grâce à nos bénévoles
                et nos donateurs.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => setIsTimelineCompleted(false)}
                  className="px-8 py-4 rounded-full text-white font-bold border-2 border-white hover:bg-white hover:text-primary transition-colors shadow-lg"
                >
                  Relire l'historique
                </button>
                <a
                  href="https://www.leetchi.com/fr/c/coeur-ua-pam-6398197"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 rounded-full bg-heading text-white font-bold uppercase tracking-wider hover:bg-heading-accent transition-all shadow-lg"
                >
                  Soutenir nos actions
                </a>
              </div>
            </div>
          </div>
        )}
      </AnimatedContent>

      {/* <AnimatedContent distance={40} direction="vertical" threshold={0.2}>
        <div className="w-full">
          <FacebookCarousel />
        </div>
      </AnimatedContent> */}
    </div>
  );
};

export default Historic;
