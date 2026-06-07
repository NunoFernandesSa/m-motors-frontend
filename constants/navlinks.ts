import { isCommercial } from "@/helpers";

export const NAV_LINKS = [
  // { href: "/", label: "Catalogue", public: true },
  { href: "/vehicule/achat", label: "Acheter", public: true },
  { href: "/vehicule/location", label: " Louer", public: true },
  { href: "/dashboard", label: "Mes dossiers", public: false },
  {
    href: "/backoffice/vehicules",
    label: "Back-office",
    public: false,
    condition: isCommercial,
  },
];

export const BACKOFFICE_NAV_LINKS = [
  { href: "/backoffice", label: "Dashboard" },
  { href: "/backoffice/vehicules", label: "Véhicules" },
  { href: "/backoffice/dossiers", label: "Dossiers" },
];
