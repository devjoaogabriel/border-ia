import { BorderIaLogo } from "@/components/ui/BorderIaLogo";
import { CtaButton } from "@/components/ui/CtaButton";
import { SITE_LINKS } from "@/lib/constants";
import { resolveSiteLinkAttributes } from "@/lib/links";

export function Header() {
  return (
    <header className="relative z-20">
      <div className="container-page flex h-[92px] items-center justify-between lg:h-[110px]">
        <div data-m="header" className="flex items-center gap-[60px]">
          <BorderIaLogo />
          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex gap-8 text-[16px] leading-[1.5] tracking-[0.01em] text-gray-05">
              {SITE_LINKS.navItems.map((item) => (
                <li key={item.id}>
                  <a
                    {...resolveSiteLinkAttributes(item)}
                    className="transition-colors duration-300 hover:text-gray-01"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div data-m="header">
          <CtaButton
            link={SITE_LINKS.ctas.comunidade}
            variant="secondary-dark"
          />
        </div>
      </div>
    </header>
  );
}
