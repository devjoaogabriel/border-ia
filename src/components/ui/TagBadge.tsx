export function TagBadge({ children }: { children: string }) {
  return (
    <span
      data-m="tag"
      className="inline-flex rounded border border-gray-09 bg-gray-10 px-[10px] py-1 lg:px-4 lg:py-[7px]"
    >
      <span className="t-tag text-gradient">{children}</span>
    </span>
  );
}
