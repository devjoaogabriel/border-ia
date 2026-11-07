import type { SiteLink } from "@/types/landing";

export interface SafeAnchorAttributes {
  href: string;
  target?: "_blank";
  rel?: "noopener noreferrer";
}

const EXTERNAL_HREF = /^https:\/\/[a-z0-9.-]+(\/[^\s]*)?$/i;
const ANCHOR_HREF = /^#[a-z0-9-]+$/i;

/**
 * Único lugar que decide target e rel: externo só https e sempre com noopener noreferrer,
 * interno só âncora da página. Qualquer outra coisa (javascript:, data:, http:, //) lança erro.
 */
export function resolveSiteLinkAttributes(link: SiteLink): SafeAnchorAttributes {
  if (link.external) {
    if (!EXTERNAL_HREF.test(link.href)) throw new Error(`Link externo inválido: ${link.id}`);
    return { href: link.href, target: "_blank", rel: "noopener noreferrer" };
  }
  if (!ANCHOR_HREF.test(link.href)) throw new Error(`Link interno inválido: ${link.id}`);
  return { href: link.href };
}
