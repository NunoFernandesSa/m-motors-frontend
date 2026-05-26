import { isCommercial } from "@/helpers";

export const NAV_LINKS = [
  { href: "/vehicles", label: "Catalogue", public: true },
  { href: "/dashboard", label: "Mes dossiers", public: false },
  {
    href: "/backoffice/vehicles",
    label: "Back-office",
    public: false,
    condition: isCommercial,
  },
];
