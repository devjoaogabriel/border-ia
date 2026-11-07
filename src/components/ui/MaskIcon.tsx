import { buildMaskStyle } from "@/lib/mask-style";

// Pinta um SVG local com a cor do texto, para o mesmo ícone servir em fundo claro e escuro.
export function MaskIcon({ src, size = 24 }: { src: string; size?: number }) {
  return (
    <span
      aria-hidden="true"
      className="inline-block shrink-0 bg-current"
      style={buildMaskStyle(src, size)}
    />
  );
}
