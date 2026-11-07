import dynamic from "next/dynamic";
import Image from "next/image";
import { CtaButton } from "@/components/ui/CtaButton";
import { DotMatrixDecor } from "@/components/ui/DotMatrixDecor";
import {
  COPY_CONTRACT,
  SITE_LINKS,
  SOCIAL_PROOF_AVATARS,
  TESTIMONIAL_ITEMS,
  TESTIMONIAL_PROVISIONAL_LABEL,
} from "@/lib/constants";

const TestimonialMarquee = dynamic(
  () => import("@/components/ui/21st/TestimonialMarquee"),
);

export function BannerSection() {
  const { banner } = COPY_CONTRACT;
  return (
    <section
      id="depoimentos"
      aria-labelledby="banner-heading"
      className="scroll-mt-6 pt-20 lg:pt-[140px]"
    >
      <div className="container-page">
        <div
          data-m="banner"
          className="relative flex flex-col items-center overflow-hidden rounded-[10px] bg-gray-10 px-4 py-[127px] lg:py-[100px]"
        >
          <DotMatrixDecor
            variant="asset"
            animatedWave
            className="-top-[77px] -left-[62px] -rotate-90"
          />
          <DotMatrixDecor
            variant="asset"
            animatedWave
            className="-right-[45px] -bottom-[69px] rotate-90"
          />

          <div className="relative flex flex-col items-center gap-6">
            <div className="flex flex-col items-center gap-6 lg:w-[452px] lg:flex-row">
              <div data-m="banner-avatars" className="flex shrink-0">
                {SOCIAL_PROOF_AVATARS.map((avatar, index) => (
                  <Image
                    key={avatar.id}
                    src={avatar.src}
                    alt={avatar.alt}
                    width={54}
                    height={54}
                    className={`size-11 lg:size-[54px] ${index > 0 ? "-ml-[15px] lg:-ml-[18px]" : ""}`}
                  />
                ))}
              </div>
              <p
                data-m="banner-proof"
                className="max-w-[300px] text-center text-[16px] leading-[1.3] font-medium tracking-[0.1em] text-gray-06 uppercase lg:max-w-none lg:text-left">
                {banner.socialProof}
              </p>
            </div>

            <h2
              id="banner-heading"
              data-m="banner-heading"
              className="t-h-banner max-w-[12.45em] [background-image:var(--gradient-banner-heading)] bg-clip-text text-center text-transparent"
            >
              {banner.headingLine1} {banner.headingLine2}
            </h2>

            <div data-m="banner-cta" className="flex">
              <CtaButton
                link={SITE_LINKS.ctas.usarNoFigma}
                variant="primary-light"
                icon="/icons/figma-mark.svg"
              />
            </div>
          </div>
        </div>

        <div data-m="banner-marquee" className="mt-8 lg:mt-10">
          <TestimonialMarquee
            items={TESTIMONIAL_ITEMS}
            provisionalLabel={TESTIMONIAL_PROVISIONAL_LABEL}
          />
        </div>
      </div>
    </section>
  );
}
