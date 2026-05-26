import { isCommercial } from "@/helpers";

export const NAV_LINKS = [
  { href: "/vehicules", label: "Catalogue", public: true },
  { href: "/dashboard", label: "Mes dossiers", public: false },
  {
    href: "/backoffice/vehicules",
    label: "Back-office",
    public: false,
    condition: isCommercial,
  },
];
