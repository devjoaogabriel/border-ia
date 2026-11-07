import Image from "next/image";
import { BorderIaLogo } from "@/components/ui/BorderIaLogo";
import { COPY_CONTRACT, SITE_LINKS } from "@/lib/constants";
import { resolveSiteLinkAttributes } from "@/lib/links";

export function Footer() {
  const { footer } = COPY_CONTRACT;
  return (
    <footer className="pt-[60px] pb-[30px] lg:pt-[100px] lg:pb-[63px]">
      <div
        data-m="footer"
        className="container-page flex flex-col"
      >
        <div className="flex flex-col items-start gap-9 border-t border-gray-06 pt-[50px] lg:flex-row lg:items-center lg:justify-between lg:gap-0">
          <BorderIaLogo />
          <ul className="flex items-center gap-4">
            {SITE_LINKS.socialLinks.map((link) => (
              <li key={link.id}>
                <a
                  {...resolveSiteLinkAttributes(link)}
                  aria-label={link.ariaLabel}
                  className="flex size-12 items-center justify-center rounded border border-gray-09 bg-gray-10 transition duration-300 hover:-translate-y-0.5 hover:border-gray-08"
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
          <p className="text-[18px] leading-[1.3] font-medium tracking-[0.01em] text-gray-05 lg:min-w-[257px]">
            {footer.creditLabel}
            <br />
            {footer.creditAuthor}
          </p>
        </div>
      </div>
    </footer>
  );
}
