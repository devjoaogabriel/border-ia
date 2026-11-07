import type { ReactNode } from "react";

export interface SiteLink {
  id: string;
  label: string;
  href: string;
  external: boolean;
  ariaLabel?: string;
}

export interface SiteLinksConfig {
  navItems: SiteLink[];
  ctas: { comunidade: SiteLink; usarNoFigma: SiteLink };
  socialLinks: SiteLink[];
}

export interface FeatureItem {
  id: "bg-remover" | "text-gen" | "image-upscaler" | "avatar-gen";
  title: string;
  description: string;
  iconPath: string;
  iconSize: number;
}

export interface SocialProofAvatar {
  id: string;
  src: string;
  alt: string;
}

export interface CopyContract {
  hero: {
    tag: string;
    headingPrefix: string;
    headingHighlight: string;
    description: string;
  };
  pluginCard: {
    title: string;
    prompt: string;
    statusGenerating: string;
    cta: string;
  };
  features: {
    tag: string;
    headingBefore: string;
    headingHighlight: string;
    headingAfter: string;
  };
  banner: { socialProof: string; headingLine1: string; headingLine2: string };
  footer: { creditLabel: string; creditAuthor: string };
}

export interface TestimonialItem {
  id: string;
  authorName: string;
  authorRole: string;
  quote: string;
  avatar: SocialProofAvatar;
  isPlaceholder: boolean;
}

export interface MotionSafeContext {
  prefersReducedMotion: boolean;
  canHover: boolean;
  isInView: boolean;
}

export interface MotionSafeWrapperProps {
  children: ReactNode | ((context: MotionSafeContext) => ReactNode);
  className?: string;
  staticFallbackClassName?: string;
  observeVisibility?: boolean;
}

export interface MotionEnvironment {
  reduceMotion: boolean;
  canHover: boolean;
}
