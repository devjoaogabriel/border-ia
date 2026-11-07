"use client";

import Image from "next/image";
import { MotionSafeWrapper } from "@/components/motion/MotionSafeWrapper";
import type { TestimonialItem } from "@/types/landing";

interface TestimonialMarqueeProps {
  items: readonly TestimonialItem[];
  provisionalLabel: string;
}

function TestimonialCards({ items, provisionalLabel }: TestimonialMarqueeProps) {
  return items.map((item) => (
    <li
      key={item.id}
      className="flex w-[300px] shrink-0 flex-col gap-4 rounded-[10px] border border-gray-09 bg-gray-10 p-5"
    >
      {item.isPlaceholder && (
        <span className="self-start rounded border border-purple-08 px-2 py-1 text-[10px] leading-[1.3] font-medium tracking-[0.1em] text-purple-04 uppercase">
          {provisionalLabel}
        </span>
      )}
      <blockquote className="text-[16px] leading-[1.5] tracking-[0.01em] text-gray-04">
        {item.quote}
      </blockquote>
      <div className="mt-auto flex items-center gap-3">
        <Image
          src={item.avatar.src}
          alt={item.avatar.alt}
          width={40}
          height={40}
          className="size-10"
        />
        <p className="text-[14px] leading-[1.3] tracking-[0.01em]">
          <span className="block font-medium text-gray-02">{item.authorName}</span>
          <span className="text-gray-05">{item.authorRole}</span>
        </p>
      </div>
    </li>
  ));
}

// shortcut: reconstrução local do Testimonial Marquee (21st 24457), código bloqueado pela
// cota do MCP até 08/11. Só a variante de uma linha.
export default function TestimonialMarquee(props: TestimonialMarqueeProps) {
  return (
    <MotionSafeWrapper
      observeVisibility
      className="marquee overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)] motion-reduce:[mask-image:none]"
    >
      <div className="marquee-track">
        <ul aria-label="Depoimentos" className="marquee-group">
          <TestimonialCards {...props} />
        </ul>
        <ul aria-hidden="true" className="marquee-group">
          <TestimonialCards {...props} />
        </ul>
      </div>
    </MotionSafeWrapper>
  );
}
