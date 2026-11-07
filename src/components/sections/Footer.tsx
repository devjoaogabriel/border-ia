import { LightBeamFooter } from "@/components/ui/21st/LightBeamFooter";
import { COPY_CONTRACT, SITE_LINKS } from "@/lib/constants";

export function Footer() {
  const { creditLabel, creditAuthor } = COPY_CONTRACT.footer;
  return (
    <LightBeamFooter
      navItems={SITE_LINKS.navItems}
      socialLinks={SITE_LINKS.socialLinks}
      credit={`${creditLabel} ${creditAuthor}`}
    />
  );
}
