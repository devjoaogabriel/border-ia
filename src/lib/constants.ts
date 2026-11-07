import type {
  CopyContract,
  FeatureItem,
  SiteLinksConfig,
  SocialProofAvatar,
} from "@/types/landing";

// shortcut: destinos externos genéricos, trocar quando o plugin e as redes existirem.
export const SITE_LINKS: SiteLinksConfig = {
  navItems: [
    { id: "recursos", label: "Recursos", href: "#recursos", external: false },
    { id: "sobre", label: "Sobre", href: "#sobre", external: false },
    {
      id: "depoimentos",
      label: "Depoimentos",
      href: "#depoimentos",
      external: false,
    },
  ],
  ctas: {
    comunidade: {
      id: "comunidade",
      label: "Comunidade",
      href: "https://discord.com",
      external: true,
    },
    usarNoFigma: {
      id: "usar-no-figma",
      label: "Usar no Figma",
      href: "https://www.figma.com/community",
      external: true,
    },
  },
  socialLinks: [
    {
      id: "discord",
      label: "Discord",
      href: "https://discord.com",
      external: true,
      ariaLabel: "Comunidade do Border-IA no Discord",
    },
    {
      id: "github",
      label: "GitHub",
      href: "https://github.com",
      external: true,
      ariaLabel: "Código e portfólio no GitHub",
    },
    {
      id: "instagram",
      label: "Instagram",
      href: "https://instagram.com",
      external: true,
      ariaLabel: "Perfil do Border-IA no Instagram",
    },
  ],
};

export const FEATURE_ITEMS: FeatureItem[] = [
  {
    id: "bg-remover",
    title: "Removedor de fundo",
    description: "Torne o fundo transparente em qualquer foto.",
    iconPath: "/icons/feature-bg-remover.svg",
    iconSize: 24,
  },
  {
    id: "text-gen",
    title: "Gerador de texto",
    description: "Gere textos de espaço reservado para suas interfaces.",
    iconPath: "/icons/feature-text-gen.svg",
    iconSize: 32,
  },
  {
    id: "image-upscaler",
    title: "Amplificador de imagem",
    description: "Amplie imagens e melhore sua resolução.",
    iconPath: "/icons/feature-image-upscaler.svg",
    iconSize: 32,
  },
  {
    id: "avatar-gen",
    title: "Gerador de avatar",
    description:
      "Crie instantaneamente avatares de usuários para listas de contatos, depoimentos, etc.",
    iconPath: "/icons/feature-avatar-gen.svg",
    iconSize: 32,
  },
];

export const SOCIAL_PROOF_AVATARS: SocialProofAvatar[] = [1, 2, 3, 4].map(
  (n) => ({
    id: `avatar-${n}`,
    src: `/images/avatars/avatar-${n}.webp`,
    alt: "",
  }),
);

export const COPY_CONTRACT: CopyContract = {
  hero: {
    tag: "Plugin Figma",
    headingPrefix: "Acelere sua criação de ",
    headingHighlight: "interfaces",
    description:
      "Com o Border-IA, você poderá dar vida às suas ideias em tempo recorde.",
  },
  pluginCard: {
    title: "Magic copy",
    prompt: "Crie exemplos de headline para meu produto",
    statusGenerating: "Generating...",
    cta: "Start now",
  },
  features: {
    tag: "Recursos",
    headingBefore: "Como o ",
    headingHighlight: "Border-IA",
    headingAfter: " te ajuda no dia a dia",
  },
  banner: {
    socialProof: "Mais de +5.000 designers já estão utilizando",
    headingLine1: "Concentre-se no design,",
    headingLine2: "não na rotina.",
  },
  footer: { creditLabel: "Desenvolvido por:", creditAuthor: "João Gabriel" },
};

// Silhueta oficial dos dois losangos, usada no SVG estático e nos prismas 3D.
export const LOGO_MARK = {
  width: 56,
  height: 40,
  back: {
    color: "#7A67FF",
    d: "M54.2162 13.9256C55.3393 15.0686 55.3393 16.9218 54.2162 18.0648L33.8091 38.8312C32.686 39.9741 30.8649 39.9741 29.7417 38.8312L16.8993 25.7629C15.776 24.62 15.776 22.7667 16.8993 21.6237L37.3066 0.857268C38.4297 -0.285756 40.2508 -0.285756 41.374 0.857268L54.2162 13.9256Z",
  },
  front: {
    color: "#C082FF",
    d: "M38.5563 13.9256C39.6794 15.0686 39.6794 16.9218 38.5563 18.0648L18.1492 38.8312C17.026 39.9741 15.2049 39.9741 14.0816 38.8312L1.2394 25.7629C0.116149 24.62 0.116149 22.7667 1.2394 21.6237L21.6466 0.857268C22.7698 -0.285756 24.5909 -0.285756 25.7141 0.857268L38.5563 13.9256Z",
  },
};
