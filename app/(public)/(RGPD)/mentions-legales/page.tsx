import Link from "next/link";

export default function MentionsLegalesPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl space-y-8">
      <h1 className="text-3xl font-bold text-center">Mentions légales</h1>
      <p className="text-center text-muted-foreground">
        Dernière mise à jour : 15 juin 2026
      </p>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">1. Éditeur du site</h2>
        <p>
          <strong>M-Motors</strong>
          <br />
          Société par actions simplifiée (SAS) au capital de 50 000 €<br />
          Siège social : 12 avenue des Champs-Élysées, 75008 Paris, France
          <br />
          RCS Paris : 912 345 678 00012
          <br />
          Numéro de TVA intracommunautaire : FR 12 912345678
          <br />
          Téléphone : +33 (0)1 23 45 67 89
          <br />
          Email :{" "}
          <a
            href="mailto:contact@m-motors.com"
            className="text-blue-600 hover:underline"
          >
            contact@m-motors.com
          </a>
          <br />
          Directeur de la publication : Jean Dupont, Président
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">2. Hébergement</h2>
        <p>
          <strong>Render.com</strong>
          <br />
          585 Howard Street, Suite 300, San Francisco, CA 94105, États-Unis
          <br />
          Téléphone : +1 (415) 800-4032
          <br />
          Site web :{" "}
          <a
            href="https://render.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            render.com
          </a>
        </p>
        <p className="mt-2">
          <strong>Cloudinary</strong> (stockage des images)
          <br />
          3401 Century Way, San Jose, CA 95125, États-Unis
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">3. Activité</h2>
        <p>
          M-Motors propose une plateforme de mise en relation entre particuliers
          et professionnels pour l’achat, la location longue durée (LLD) de
          véhicules d’occasion. Le service est accessible via le site internet{" "}
          <strong>m-motors.com</strong>.
        </p>
        <p>
          Conformément à l’article 6 de la loi n° 2004-575 du 21 juin 2004 pour
          la confiance dans l’économie numérique, l’éditeur du site est
          identifié ci-dessus.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">4. Propriété intellectuelle</h2>
        <p>
          L’ensemble des éléments figurant sur le site (textes, logos, images,
          vidéos, bases de données, codes source) est la propriété exclusive de
          M-Motors ou de ses partenaires. Toute reproduction, représentation,
          modification ou adaptation, totale ou partielle, est interdite sans
          autorisation écrite préalable.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">
          5. Données personnelles et RGPD
        </h2>
        <p>
          Les informations recueillies via le formulaire de contact, la création
          de compte ou les demandes de devis font l’objet d’un traitement
          informatique destiné à la gestion des relations clients et à la
          fourniture des services. Ces données sont conservées pendant la durée
          nécessaire à l’exécution du contrat et au respect des obligations
          légales.
        </p>
        <p>
          Conformément au Règlement Général sur la Protection des Données (UE)
          2016/679 et à la loi Informatique et Libertés, vous disposez d’un
          droit d’accès, de rectification, d’effacement, de limitation et
          d’opposition au traitement de vos données. Vous pouvez exercer ces
          droits en écrivant à : <strong>dpo@m-motors.com</strong>.
        </p>
        <p>
          Notre site n’utilise pas de cookies de traçage publicitaire. Seuls des
          cookies techniques (session, authentification) sont déposés. Vous
          pouvez les paramétrer via votre navigateur.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">6. Responsabilité</h2>
        <p>
          M-Motors s’efforce de fournir des informations exactes et à jour.
          Toutefois, des erreurs ou omissions peuvent survenir. La
          responsabilité de M-Motors ne saurait être engagée en cas
          d’inexactitude ou d’indisponibilité temporaire du site.
        </p>
        <p>
          Les liens hypertextes vers des sites tiers sont fournis à titre
          informatif. M-Motors n’exerce aucun contrôle sur ces sites et décline
          toute responsabilité quant à leur contenu.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">7. Droit applicable</h2>
        <p>
          Les présentes mentions légales sont régies par le droit français. Tout
          litige relatif à l’utilisation du site est soumis à la compétence
          exclusive des tribunaux de Paris.
        </p>
      </section>

      <div className="pt-6 text-center text-sm text-muted-foreground border-t">
        Pour toute question, consultez notre{" "}
        <Link href="/contact" className="text-blue-600 hover:underline">
          page de contact
        </Link>
        .
      </div>
    </div>
  );
}
