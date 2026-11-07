import Image from "next/image";
import { HeroBeamLazy } from "@/components/three/HeroBeamLazy";
import { AnimatedText } from "@/components/ui/animated-shiny-text";
import { AnimatedStrokeWord } from "@/components/ui/AnimatedStrokeWord";
import { CtaButton } from "@/components/ui/CtaButton";
import { DotMatrixDecor } from "@/components/ui/DotMatrixDecor";
import { MagicCopyCard } from "@/components/ui/MagicCopyCard";
import { TagBadge } from "@/components/ui/TagBadge";
import { COPY_CONTRACT, SITE_LINKS } from "@/lib/constants";

export function HeroSection() {
  const { hero } = COPY_CONTRACT;
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative pt-20 lg:pb-20"
    >
      <div className="container-page relative">
        <div className="relative z-10 flex flex-col items-start gap-[15px] lg:w-[621px] lg:gap-6">
          <TagBadge>{hero.tag}</TagBadge>
          <AnimatedText
            headingId="hero-heading"
            data-m="hero-text"
            textClassName="t-h1 max-w-[9.7em]"
            text={
              <>
                {hero.headingPrefix}
                <AnimatedStrokeWord variant="oval">
                  {hero.headingHighlight}
                </AnimatedStrokeWord>
              </>
            }
          />
          <div className="flex items-center gap-6">
            <p data-m="hero-text" className="t-p text-gray-05 lg:w-[396px]">
              {hero.description}
            </p>
            {/* O frame Mobile 335:10650 não tem o botão no hero. */}
            <span data-m="hero-text" className="hidden lg:block">
              <CtaButton
                link={SITE_LINKS.ctas.usarNoFigma}
                variant="primary-gradient"
                icon="/icons/figma-mark.svg"
              />
            </span>
          </div>
        </div>

        {/* Fora do #sobre porque o halo sobe por trás do texto, além do recorte. */}
        <div
          aria-hidden="true"
          className="pointer-events-none relative -mx-[22px] mt-12 h-0 lg:hidden"
        >
          <div className="hero-haze absolute inset-x-0 -top-[225px] h-[570px]" />
        </div>

        <div
          id="sobre"
          className="relative -mx-[22px] h-[446px] scroll-mt-24 lg:mx-0 lg:mt-[140px] lg:h-auto"
        >
          {/* O recorte fica só aqui: nenhum pai do card pode cortar, porque ele inclina em 3D. */}
          <div className="absolute inset-0 overflow-hidden lg:static lg:overflow-visible">
            <DotMatrixDecor
              variant="css"
              className="top-[-8px] left-0 h-[120px] w-[240px] opacity-60 lg:hidden"
            />
            {/* O SVG tem 865px de altura: o design mostra 660px, com fade linear até o fundo. */}
            <div
              data-m="window"
              className="absolute top-[71px] left-[23px] w-[725px] max-w-none lg:static lg:w-full lg:max-w-[1216px]"
            >
              {/* Camada própria: o parallax fica no pai e a máscara não repinta a cada frame. */}
              <div data-m="window-float" className="will-change-transform">
                <Image
                  src="/images/hero-figma-ui.svg"
                  alt="Interface do Figma com a estrutura de camadas de um projeto"
                  width={1216}
                  height={660}
                  unoptimized
                  priority
                  className="block aspect-[1216/660] w-full rounded-lg object-cover object-top [mask-image:linear-gradient(to_bottom,#000,transparent)] lg:rounded-xl"
                />
              </div>
            </div>
          </div>

          <div className="absolute top-0 right-6 origin-top-right scale-[0.885] lg:top-[-140px] lg:right-auto lg:left-[62.1%] lg:origin-top-left lg:scale-100">
            <HeroBeamLazy />
            <MagicCopyCard />
          </div>
        </div>
      </div>
    </section>
  );
}
