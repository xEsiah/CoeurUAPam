import AnimatedContent from "../components/AnimatedContent";

const Privacy = () => {
  const lastUpdate = new Date().toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="w-full pt-32 pb-20 bg-bg-1 min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        {/* En-tête */}
        <AnimatedContent distance={20} direction="vertical">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Politique de Confidentialité
          </h1>
          <p className="text-site-text mb-12 border-l-4 border-hover-nav pl-4 italic">
            Dernière mise à jour : {lastUpdate}
          </p>
        </AnimatedContent>

        {/* Contenu Légal */}
        <div className="space-y-12 text-site-text leading-relaxed">
          <AnimatedContent distance={20} direction="vertical" delay={0.1}>
            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">
                1. Présentation du site
              </h2>
              <p>
                Le site <strong>Cœur UA PAM</strong> a pour vocation de
                présenter les actions de l'association, son histoire et ses
                événements à venir. Il s'agit d'un site vitrine à but non
                lucratif.
              </p>
            </section>
          </AnimatedContent>

          <AnimatedContent distance={20} direction="vertical" delay={0.2}>
            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">
                2. Collecte de données
              </h2>
              <p className="mb-4">
                Nous tenons à la protection de votre vie privée. À ce jour,{" "}
                <strong>nous ne collectons aucune donnée personnelle</strong>{" "}
                via ce site :
              </p>
              <ul className="list-disc pl-6 space-y-2 marker:text-hover-nav">
                <li>Aucun formulaire d'inscription.</li>
                <li>Aucun système de commentaire.</li>
                <li>Aucune inscription à une newsletter.</li>
              </ul>
            </section>
          </AnimatedContent>

          <AnimatedContent distance={20} direction="vertical" delay={0.3}>
            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">
                3. Cookies et Traceurs
              </h2>
              <p>
                Ce site n'utilise{" "}
                <strong>aucun cookie publicitaire ou de traçage</strong> (Google
                Analytics, Pixels, etc.). Vous pouvez naviguer en toute
                tranquillité sans être suivi.
              </p>
              <p className="mt-2 text-sm text-site-text/70">
                <em>
                  Note : Si cela venait à changer à l'avenir pour des besoins de
                  statistiques, une bannière de consentement vous en informerait
                  immédiatement.
                </em>
              </p>
            </section>
          </AnimatedContent>

          <AnimatedContent distance={20} direction="vertical" delay={0.4}>
            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">
                4. Services Tiers
              </h2>
              <p className="mb-4">
                Notre site utilise certaines fonctionnalités externes pour
                enrichir votre expérience :
              </p>
              <ul className="list-disc pl-6 space-y-4 marker:text-hover-nav">
                <li>
                  <strong>Facebook / Meta :</strong> Nous affichons les
                  actualités publiques de notre page Facebook. Aucune donnée
                  vous concernant n'est envoyée à Facebook tant que vous ne
                  cliquez pas sur les liens pour visiter la plateforme.
                </li>
                <li>
                  <strong>HelloAsso / Leetchi :</strong> Les boutons de don
                  redirigent vers ces plateformes sécurisées. Ces sites
                  disposent de leur propre politique de confidentialité que nous
                  vous invitons à consulter si vous effectuez un don.
                </li>
              </ul>
            </section>
          </AnimatedContent>

          <AnimatedContent distance={20} direction="vertical" delay={0.5}>
            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">
                5. Contact
              </h2>
              <p>
                Pour toute question concernant cette politique ou l'association,
                vous pouvez nous écrire directement à :<br />
                <a
                  href="mailto:coeuruapam@gmail.com"
                  className="font-bold text-primary hover:text-hover-nav underline mt-2 inline-block"
                >
                  coeuruapam@gmail.com
                </a>
              </p>
            </section>
          </AnimatedContent>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
