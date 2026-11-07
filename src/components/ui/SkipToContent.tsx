// Primeiro item do Tab: leva o teclado direto ao conteúdo, pulando o header.
export function SkipToContent() {
  return (
    <a
      href="#conteudo-principal"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:rounded focus:bg-purple-01 focus:px-4 focus:py-3 focus:text-[14px] focus:font-medium focus:text-gray-11"
    >
      Pular para o conteúdo
    </a>
  );
}
