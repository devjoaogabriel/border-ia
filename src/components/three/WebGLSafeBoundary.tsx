"use client";

import { Component, type ReactNode, useSyncExternalStore } from "react";

const subscribe = () => () => {};

let webglSupport: boolean | undefined;

// Cada getContext ocupa um dos poucos contextos WebGL do navegador, então detecta só uma vez.
function hasWebGL(): boolean {
  if (webglSupport === undefined) {
    try {
      const context = document.createElement("canvas").getContext("webgl2");
      webglSupport = !!context;
      context?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {
      webglSupport = false;
    }
  }
  return webglSupport;
}

interface BoundaryProps {
  children: ReactNode;
  /** Avisa o pai para devolver o fallback quando o canvas quebra depois de pronto. */
  onError?: () => void;
}

class CanvasErrorBoundary extends Component<BoundaryProps, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError?.();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

// Sem WebGL ou com erro no canvas, nada é renderizado e o fallback estático continua visível.
export function WebGLSafeBoundary({ children, onError }: BoundaryProps) {
  const supported = useSyncExternalStore(subscribe, hasWebGL, () => false);
  if (!supported) return null;
  return <CanvasErrorBoundary onError={onError}>{children}</CanvasErrorBoundary>;
}
