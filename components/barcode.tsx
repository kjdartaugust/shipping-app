/**
 * Dependency-free pseudo-barcode. Deterministically renders a set of bars
 * from the input string — good enough for a printable waybill mockup.
 */
export default function Barcode({ value }: { value: string }) {
  const bars: number[] = [];
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    // 3 bars per character, widths 1–4px derived from the char code.
    bars.push((code % 4) + 1, ((code >> 2) % 3) + 1, ((code >> 4) % 4) + 1);
  }

  return (
    <div
      className="flex h-16 items-end gap-px"
      aria-label={`Barcode for ${value}`}
    >
      {bars.map((w, i) => (
        <span
          key={i}
          style={{ width: w, height: i % 5 === 0 ? "100%" : "85%" }}
          className="bg-slate-900"
        />
      ))}
    </div>
  );
}
