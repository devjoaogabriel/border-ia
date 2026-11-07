import Image from "next/image";
import { MotionSafeWrapper } from "@/components/motion/MotionSafeWrapper";
import { BorderIaLogo } from "@/components/ui/BorderIaLogo";
import type { SiteLink } from "@/types/landing";

interface LightBeamFooterProps {
  navItems: SiteLink[];
  socialLinks: SiteLink[];
  credit: string;
}

// shortcut: reconstrução local do Light Beam Footer (21st 35251), código bloqueado pela cota
// do MCP até 08/11. Sem o brilho que segue o ponteiro do original.
export function LightBeamFooter({
  navItems,
  socialLinks,
  credit,
}: LightBeamFooterProps) {
  return (
    <footer
      data-m="footer"
      className="relative mt-[60px] overflow-hidden border-t border-gray-08 bg-gray-11 lg:mt-[100px]"
    >
      <MotionSafeWrapper
        observeVisibility
        className="pointer-events-none absolute inset-0"
      >
        <div aria-hidden="true" className="footer-beam" />
      </MotionSafeWrapper>

      <div className="container-page relative flex flex-col gap-9 pt-[50px] lg:flex-row lg:items-center lg:justify-between lg:gap-0">
        <BorderIaLogo />
        <nav aria-label="Rodapé">
          <ul className="flex gap-8 text-[16px] leading-[1.5] tracking-[0.01em] text-gray-05">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  className="hover:text-gray-01 motion-safe:transition-colors motion-safe:duration-300"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <ul className="flex items-center gap-4">
          {socialLinks.map((link) => (
            <li key={link.id}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.ariaLabel}
                className="flex size-12 items-center justify-center rounded border border-gray-09 bg-gray-10 hover:border-gray-08 motion-safe:transition motion-safe:duration-300 motion-safe:hover:-translate-y-0.5"
              >
                <Image
                  src={`/icons/social-${link.id}.svg`}
                  alt=""
                  width={32}
                  height={32}
                />
              </a>
            </li>
          ))}
        </ul>
      </div>

      <p className="container-page relative mt-9 text-[16px] leading-[1.3] font-medium tracking-[0.01em] text-gray-05 lg:mt-10">
        {credit}
      </p>

      <p
        aria-hidden="true"
        className="relative mt-6 -mb-[0.2em] text-center text-[min(17vw,240px)] leading-none font-medium tracking-[-0.02em] whitespace-nowrap select-none"
      >
        <span className="bg-linear-to-b from-purple-05 to-indigo-06/10 bg-clip-text text-transparent">
          Border-IA
        </span>
      </p>
    </footer>
  );
}
