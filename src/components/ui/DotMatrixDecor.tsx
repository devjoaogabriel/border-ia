import Image from "next/image";

interface DotMatrixDecorProps {
  variant: "asset" | "css";
  className?: string;
}

export function DotMatrixDecor({ variant, className = "" }: DotMatrixDecorProps) {
  if (variant === "asset") {
    return (
      <Image
        src="/icons/dot-matrix.svg"
        alt=""
        aria-hidden="true"
        width={200}
        height={200}
        loading="lazy"
        className={`pointer-events-none absolute ${className}`}
      />
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
