import type { SiteLink } from "@/types/landing";
import { MaskIcon } from "./MaskIcon";

const VARIANTS = {
  "primary-gradient":
    "gap-2 px-8 py-4 text-white [--shine:#fff] [background-image:var(--gradient-linear-degrade)] hover:brightness-110",
  "primary-light":
    "gap-2 px-[26px] py-[14px] lg:px-8 lg:py-4 bg-purple-01 text-gray-11 [--shine:#A751FB] hover:bg-purple-02",
  "secondary-dark":
    "border border-gray-08 bg-gray-09 px-6 py-3 text-white [--shine:#C082FF] hover:border-gray-07 hover:bg-gray-08",
};

interface CtaButtonProps {
  link: SiteLink;
  variant: keyof typeof VARIANTS;
  icon?: string;
  className?: string;
}

export function CtaButton({ link, variant, icon, className = "" }: CtaButtonProps) {
  return (
    <a
      href={link.href}
      {...(link.external && { target: "_blank", rel: "noopener noreferrer" })}
      className={`btn-shine inline-flex shrink-0 items-center justify-center rounded text-[14px] leading-[1.3] font-medium tracking-[0.01em] whitespace-nowrap uppercase transition duration-300 ${VARIANTS[variant]} ${className}`}
    >
      {icon && <MaskIcon src={icon} />}
      {link.label}
    </a>
  );
}
