// shortcut: reconstrução local do Animated Border (21st 35188), código bloqueado pela cota
// do MCP até 08/11. Sem loop próprio: quem move a luz é a timeline do MagicCopyCard.
export function AnimatedBorder() {
  return (
    <span
      data-card-ring
      aria-hidden="true"
      className="border-ring-mask card-ring"
    />
  );
}
