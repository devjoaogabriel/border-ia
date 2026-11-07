import type { ReactNode } from "react";

// shortcut: o oval foi traçado a partir do screenshot, porque a cota do MCP do Figma acabou
// antes de exportar o vector 332:159. Trocar pelo path oficial quando a cota voltar.
const STROKES = {
  oval: {
    viewBox: "0 0 373 74",
    d: "M52 65C18 58 3 48 3 37C3 16 90 3 190 3C295 3 370 16 370 36C370 56 300 71 205 71C150 71 105 63 70 52",
    strokeWidth: 6,
    box: { left: "-0.33em", top: "0.06em", width: "5.92em", height: "1.25em" },
    gradient: { x1: 0, y1: 0, x2: 373, y2: 0 },
  },
  scribble: {
    viewBox: "0 0 216 37",
    d: "M4.00008 30.7726C19.3793 17.6545 48.6461 5.57969 60.6405 10.4783C72.635 15.3769 28.5859 38.208 71.2328 31.9098C113.88 25.6116 119.027 7.79867 148.347 4.2997C177.667 0.80072 134.815 29.0702 159.374 30.7726C183.933 32.475 198.969 21.1823 212 10.4783",
    strokeWidth: 8,
    box: { left: "-0.08em", top: "0.77em", width: "4.5em", height: "0.77em" },
    gradient: { x1: 120.28, y1: 9.36, x2: 120.28, y2: 31.91 },
  },
};

interface AnimatedStrokeWordProps {
  variant: keyof typeof STROKES;
  children: ReactNode;
}

export function AnimatedStrokeWord({ variant, children }: AnimatedStrokeWordProps) {
  const { viewBox, d, strokeWidth, box, gradient } = STROKES[variant];
  const gradientId = `stroke-${variant}`;
  return (
    <span className="relative inline-block whitespace-nowrap">
      {children}
      <svg
        aria-hidden="true"
        viewBox={viewBox}
        fill="none"
        preserveAspectRatio="none"
        className="pointer-events-none absolute overflow-visible"
        style={box}
      >
        <defs>
          <linearGradient
            id={gradientId}
            gradientUnits="userSpaceOnUse"
            {...gradient}
          >
            <stop stopColor="#AC32E4" />
            <stop offset="0.458" stopColor="#7918F2" />
            <stop offset="1" stopColor="#4801FF" />
          </linearGradient>
        </defs>
        <path
          data-stroke-path={variant}
          d={d}
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
