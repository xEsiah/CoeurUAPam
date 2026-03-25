import AnimatedContent from "../components/AnimatedContent";
import SEO from "../components/SEO";

const About = () => {
  return (
    <div className="w-full pb-20 flex flex-col gap-16 md:gap-24">
      <SEO
        title="L'Association"
        description="Découvrez les missions de Cœur UA PAM : Solidarité, Culture et Entraide. Nos actions pour l'intégration et le soutien logistique en Ukraine."
        url="/a-propos"
      />
      <AnimatedContent distance={60} direction="vertical" duration={1}>
        <div className="relative w-full h-[80vh] min-h-125 overflow-hidden shadow-2xl group">
          <img
            src="/hero-section/a-propos.webp"
            alt="Association Coeur UA PAM"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[10s] ease-linear group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-primary/90 via-primary/40 to-transparent"></div>

          <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 flex flex-col items-start">
            <span className="inline-block px-4 py-1 rounded-full bg-hover-nav text-primary font-bold uppercase tracking-widest mb-4">
              à propos
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Solidarité, Culture <br /> et Entraide.
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-light max-w-2xl leading-relaxed">
              Née d'une volonté forte de rassembler et d'agir, l'association{" "}
              <strong className="font-semibold text-hover-nav">
                Cœur UA PAM
              </strong>{" "}
              a pour vocation de faire vivre la culture ukrainienne et
              d'apporter un soutien vital à ceux qui en ont besoin.
            </p>
          </div>
        </div>
      </AnimatedContent>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0  overflow-hidden mb-24 shadow-xl">
        <div className="bg-bg-2 p-12 md:p-20 flex flex-col justify-center">
          <AnimatedContent
            distance={40}
            direction="horizontal"
            duration={0.8}
            threshold={0.2}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-heading mb-8 leading-tight">
              Nos missions <br /> au quotidien
            </h2>
            <p className="text-lg text-site-text leading-relaxed font-medium">
              Notre force réside dans la diversité de nos actions. De
              l'accompagnement des réfugiés en France jusqu'au soutien
              logistique en Ukraine, chaque initiative compte.
            </p>
          </AnimatedContent>
        </div>

        <div className="bg-white p-12 md:p-20 flex flex-col justify-center gap-12">
          <AnimatedContent
            distance={30}
            direction="vertical"
            delay={0.2}
            threshold={0.2}
          >
            <div>
              <span className="text-6xl font-bold text-primary opacity-20 block mb-2">
                01.
              </span>
              <h3 className="text-2xl font-bold text-primary mb-3">
                Action Humanitaire
              </h3>
              <p className="text-site-text">
                Mener des actions d'entraide concrètes en faveur des Ukrainiens
                réfugiés en France, mais aussi de ceux restés en Ukraine.
              </p>
            </div>
          </AnimatedContent>

          <AnimatedContent
            distance={30}
            direction="vertical"
            delay={0.4}
            threshold={0.2}
          >
            <div>
              <span className="text-6xl font-bold text-hover-nav opacity-40 block mb-2">
                02.
              </span>
              <h3 className="text-2xl font-bold text-hover-nav mb-3">
                Culture & Partage
              </h3>
              <p className="text-site-text">
                Promouvoir la culture ukrainienne à travers la création
                artistique, des événements et le développement de partenariats
                locaux.
              </p>
            </div>
          </AnimatedContent>

          <AnimatedContent
            distance={30}
            direction="vertical"
            delay={0.6}
            threshold={0.2}
          >
            <div>
              <span className="text-6xl font-bold text-heading opacity-20 block mb-2">
                03.
              </span>
              <h3 className="text-2xl font-bold text-heading mb-3">
                Éducation
              </h3>
              <p className="text-site-text">
                Favoriser l'intégration linguistique, le bilinguisme et
                organiser des activités ludiques dédiées aux enfants.
              </p>
            </div>
          </AnimatedContent>
        </div>
      </div>

      <AnimatedContent
        distance={50}
        direction="vertical"
        duration={1}
        threshold={0.2}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="h-100  overflow-hidden shadow-lg">
            <img
              src="/a-propos/solidarite.webp"
              alt="Préparation de colis"
              className="w-full h-full object-cover object-top"
            />
          </div>

          <div className="px-4 lg:px-12">
            <h2 className="text-4xl font-bold text-heading mb-6">
              Une chaîne de solidarité active
            </h2>
            <p className="text-xl text-site-text mb-6 leading-relaxed">
              L'intégralité des fonds récoltés sert à soutenir directement ceux
              qui sont sur le terrain.
            </p>
            <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-2xl mb-8">
              <p className="font-semibold text-primary">
                Nous préparons, finançons et acheminons des colis de première
                nécessité destinés aux combattants ukrainiens (nourriture,
                hygiène, vêtements chauds).
              </p>
            </div>

            <a
              href="https://www.leetchi.com/fr/c/coeur-ua-pam-6398197?utm_source=copylink&utm_medium=social_sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-heading text-white font-bold uppercase tracking-wider hover:bg-heading-accent hover:scale-105 transition-all shadow-xl"
            >
              Participer à la cagnotte
            </a>
          </div>
        </div>
      </AnimatedContent>
    </div>
  );
};

export default About;
