export interface MobileMenuButtonProps {
  ariaMobileMenuOpenlabel?: string;
  ariaMobileMenuCloseLabel?: string;
  className?: string;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}
