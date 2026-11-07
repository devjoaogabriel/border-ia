import Image from "next/image";

interface DotMatrixDecorProps {
  variant: "asset" | "css";
  animatedWave?: boolean;
  className?: string;
}

export function DotMatrixDecor({
  variant,
  animatedWave = false,
  className = "",
}: DotMatrixDecorProps) {
  if (variant === "asset") {
    return (
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute size-[200px] ${className}`}
      >
        <Image
          src="/icons/dot-matrix.webp"
          alt=""
          width={200}
          height={200}
          loading="lazy"
        />
        {animatedWave && (
          <div className="dot-wave-mask absolute inset-0 overflow-hidden">
            {/* O GSAP move a onda só com movimento permitido e a seção visível. */}
            <span data-wave className="dot-wave" />
          </div>
        )}
      </div>
    );
  }
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute ${className}`}
      style={{
        backgroundImage:
          "radial-gradient(circle, rgb(122 103 255 / 0.32) 1.4px, transparent 1.8px)",
        backgroundSize: "19px 19px",
        maskImage: "radial-gradient(closest-side, #000 25%, transparent)",
      }}
    />
  );
}
