import { ElevateNavbar } from "@/components/ui/21st/ElevateNavbar";
import { SITE_LINKS } from "@/lib/constants";

export function Header() {
  return (
    <header className="relative z-20">
      <div className="container-page flex h-[92px] items-center lg:h-[110px]">
        <ElevateNavbar
          navItems={SITE_LINKS.navItems}
          cta={SITE_LINKS.ctas.comunidade}
        />
      </div>
    </header>
  );
}
