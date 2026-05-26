import { MobileMenuButtonProps } from "@/types";
import { Menu, X } from "lucide-react";

function MobileMenuButton({
  ariaMobileMenuOpenlabel,
  ariaMobileMenuCloseLabel,
  className,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}: MobileMenuButtonProps) {
  return (
    <button
      className={`
        md:hidden
        p-2
        rounded-md
        hover:bg-accent
        ${className}
      `}
      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      aria-label={
        isMobileMenuOpen ? ariaMobileMenuCloseLabel : ariaMobileMenuOpenlabel
      }
    >
      {isMobileMenuOpen ? (
        <X className="h-5 w-5" />
      ) : (
        <Menu className="h-5 w-5" />
      )}
    </button>
  );
}

export default MobileMenuButton;
