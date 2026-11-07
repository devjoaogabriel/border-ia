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

class CanvasErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

// Sem WebGL ou com erro no canvas, nada é renderizado e o fallback estático continua visível.
export function WebGLSafeBoundary({ children }: { children: ReactNode }) {
  const supported = useSyncExternalStore(subscribe, hasWebGL, () => false);
  if (!supported) return null;
  return <CanvasErrorBoundary>{children}</CanvasErrorBoundary>;
}
