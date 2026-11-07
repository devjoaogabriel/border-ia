import Image from "next/image";
import { LOGO_MARK } from "@/lib/constants";

export function BorderIaLogo({ className = "" }: { className?: string }) {
  return (
    <a
      href="#hero"
      aria-label="Border-IA, voltar ao início"
      className={`inline-block shrink-0 transition-transform duration-300 hover:scale-[1.03] ${className}`}
    >
      <Image
        src="/icons/logo-full.svg"
        alt=""
        width={192}
        height={40}
        className="h-auto w-[149px] lg:w-[154px]"
      />
    </a>
  );
}

export function BorderIaMark({ className = "" }: { className?: string }) {
  const { width, height, back, front } = LOGO_MARK;
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={className}
    >
      <path d={back.d} fill={back.color} />
      <path d={front.d} fill={front.color} />
    </svg>
  );
}
