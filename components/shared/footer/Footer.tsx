import { Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

function Footer() {
  return (
    <footer className="border-t bg-muted/40 mt-auto">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Grille principale */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Colonne 1 : Marque / description */}
          <div>
            <h3 className="text-lg font-bold mb-4">M-Motors</h3>
            <p className="text-sm text-muted-foreground">
              Spécialiste de la vente et location longue durée de véhicules
              d’occasion depuis 1987.
            </p>
          </div>

          {/* Colonne 2 : Liens rapides */}
          <div>
            <h4 className="font-semibold mb-4">Liens utiles</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/vehicles"
                  className="hover:text-primary transition-colors"
                >
                  Catalogue
                </Link>
              </li>
              <li>
                <Link
                  href="/location"
                  className="hover:text-primary transition-colors"
                >
                  Location LLD
                </Link>
              </li>
              <li>
                <Link
                  href="/achat"
                  className="hover:text-primary transition-colors"
                >
                  Achat
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 3 : Service client */}
          <div>
            <h4 className="font-semibold mb-4">Service client</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+33 (0)1 23 45 67 89</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>contact@m-motors.fr</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>12 avenue des Champs-Élysées, 75008 Paris</span>
              </li>
            </ul>
          </div>

          {/* Colonne 4 : Réseaux sociaux */}
          <div>
            <h4 className="font-semibold mb-4">Suivez-nous</h4>
            <div className="flex gap-4">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {/* <Facebook className="h-5 w-5" /> */}
                <span className="sr-only">Facebook</span>
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {/* <Twitter className="h-5 w-5" /> */}
                <span className="sr-only">Twitter</span>
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {/* <Linkedin className="h-5 w-5" /> */}
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>
        </div>

        {/* Barre de copyright */}
        <div className="border-t mt-8 pt-6 text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} M-Motors – Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
