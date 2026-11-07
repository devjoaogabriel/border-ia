import Image from "next/image";
import { AnimatedStrokeWord } from "@/components/ui/AnimatedStrokeWord";
import { TagBadge } from "@/components/ui/TagBadge";
import { COPY_CONTRACT, FEATURE_ITEMS } from "@/lib/constants";

export function FeaturesSection() {
  const { features } = COPY_CONTRACT;
  return (
    <section
      id="recursos"
      aria-labelledby="recursos-heading"
      className="scroll-mt-6 pt-20 lg:pt-[140px]"
    >
      <div className="container-page flex flex-col items-center gap-12 lg:gap-[60px]">
        <div
          data-m="feat-head"
          className="flex flex-col items-center gap-[15px] text-center lg:gap-6"
        >
          <TagBadge>{features.tag}</TagBadge>
          <h2
            id="recursos-heading"
            className="t-h2 max-w-[11.5em] text-gray-01"
          >
            {features.headingBefore}
            <AnimatedStrokeWord variant="scribble">
              {features.headingHighlight}
            </AnimatedStrokeWord>
            {features.headingAfter}
          </h2>
        </div>

        <ul className="grid w-full grid-cols-1 gap-[72px] lg:min-h-[212px] lg:grid-cols-4 lg:gap-8">
          {FEATURE_ITEMS.map((item) => (
            <li
              key={item.id}
              data-m="feat-card"
              className="group mx-auto flex max-w-[330px] flex-col items-center gap-4 text-center lg:mx-0 lg:max-w-none lg:items-start lg:text-left"
            >
              <div className="flex size-12 items-center justify-center rounded border border-gray-09 bg-gray-10 transition-transform duration-300 group-hover:-translate-y-0.5">
                <Image
                  src={item.iconPath}
                  alt=""
                  width={item.iconSize}
                  height={item.iconSize}
                />
              </div>
              <h3 className="text-[24px] leading-[1.3] font-medium tracking-[0.01em] text-gray-02 lg:whitespace-nowrap">
                {item.title}
              </h3>
              <p className="text-[16px] leading-[1.5] tracking-[0.01em] text-gray-05">
                {item.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
