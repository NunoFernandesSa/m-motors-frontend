import { isCommercial } from "@/helpers";

export const NAV_LINKS = [
  { href: "/catalogue", label: "Catalogue", public: true },
  { href: "/dashboard", label: "Dashboard", public: false },
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
