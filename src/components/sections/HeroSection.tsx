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
            id="hero-heading"
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

        {/* Recorta só os lados e a base: em cima sobra espaço para o card inclinar. */}
        <div
          id="sobre"
          className="relative -mx-[22px] h-[446px] scroll-mt-24 overflow-x-clip [clip-path:inset(-24px_0_0_0)] lg:mx-0 lg:mt-[140px] lg:h-auto lg:overflow-x-visible lg:[clip-path:none]"
        >
          <DotMatrixDecor
            variant="css"
            className="top-[-8px] left-0 h-[120px] w-[240px] opacity-60 lg:hidden"
          />
          {/* shortcut: janela vinda do screenshot 1x, porque a cota do MCP do Figma acabou.
              Reexportar o node 307:748 em 2x quando a cota voltar. */}
          <Image
            data-m="window"
            src="/images/hero-figma-ui.webp"
            alt="Interface do Figma com a estrutura de camadas de um projeto"
            width={1222}
            height={660}
            unoptimized
            priority
            className="absolute top-[71px] left-[23px] w-[725px] max-w-none lg:static lg:block lg:w-full"
          />

          <div className="absolute top-0 right-6 origin-top-right scale-[0.885] lg:top-[-140px] lg:right-auto lg:left-[62.1%] lg:origin-top-left lg:scale-100">
            <HeroBeamLazy />
            <MagicCopyCard />
          </div>
        </div>
      </div>
    </section>
  );
}
