// Pinta um SVG local com a cor do texto, para o mesmo ícone servir em fundo claro e escuro.
export function MaskIcon({ src, size = 24 }: { src: string; size?: number }) {
  return (
    <span
      aria-hidden="true"
      className="inline-block shrink-0 bg-current"
      style={{
        width: size,
        height: size,
        mask: `url(${src}) center / contain no-repeat`,
      }}
    />
  );
}
