import { MapPin, Phone, Mail, Clock } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <h1 className="text-3xl font-bold text-center mb-2">Nous contacter</h1>
      <p className="text-center text-muted-foreground mb-12">
        Équipe M-Motors à votre écoute
      </p>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Colonne gauche - infos */}
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <MapPin className="h-6 w-6 text-primary shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold">Adresse</h3>
              <p className="text-muted-foreground">
                12 avenue des Champs-Élysées
                <br />
                75008 Paris, France
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Phone className="h-6 w-6 text-primary shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold">Téléphone</h3>
              <p className="text-muted-foreground">
                +33 (0)1 23 45 67 89
                <br />
                <span className="text-sm">Du lundi au vendredi, 9h‑18h</span>
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Mail className="h-6 w-6 text-primary shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold">Email</h3>
              <p className="text-muted-foreground">
                <a
                  href="mailto:contact@m-motors.com"
                  className="hover:underline"
                >
                  contact@m-motors.com
                </a>
                <br />
                <span className="text-sm">Réponse sous 24h ouvrées</span>
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Clock className="h-6 w-6 text-primary shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold">Horaires d’ouverture</h3>
              <ul className="text-muted-foreground space-y-1">
                <li>Lundi – vendredi : 9h00 – 19h00</li>
                <li>Samedi : 10h00 – 17h00</li>
                <li>Dimanche et jours fériés : fermé</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Colonne droite - plan d'accès simplifié + réseaux sociaux */}
        <div className="space-y-6">
          <div className="bg-muted rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Notre showroom est situé au cœur de Paris, accessible par métro
              (lignes 1, 13) station Champs-Élysées – Clemenceau.
            </p>
            <div className="aspect-video bg-gray-200 rounded-md flex items-center justify-center text-gray-500 text-sm">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.398145813236!2d2.30708097614668!3d48.86968609991196!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66fc501e717f1%3A0x9ef912b439932bd6!2s12%20Av.%20des%20Champs-%C3%89lys%C3%A9es%2C%2075008%20Paris%2C%20France!5e0!3m2!1sfr!2spt!4v1781532291930!5m2!1sfr!2spt"
                width="600"
                height="450"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              *Un parking souterrain est disponible pour notre clientèle.
            </p>
          </div>
        </div>
      </div>

      {/* Lien vers les mentions légales */}
      <div className="mt-12 text-center text-sm text-muted-foreground border-t pt-6">
        <p>
          Pour toute question relative à vos données personnelles, consultez nos{" "}
          <Link
            href="/mentions-legales"
            className="text-blue-600 hover:underline"
          >
            mentions légales
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
