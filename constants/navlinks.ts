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

export const ADMIN_NAV_LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/vehicules", label: "Véhicules" },
  { href: "/admin/dossiers", label: "Dossiers" },
];
