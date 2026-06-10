export default function MediaFrame({
  src,
  alt,
  label,
  note,
  ratio = "16 / 9",
  className = "",
}: {
  src?: string;
  alt: string;
  label: string;
  note: string;
  ratio?: string;
  className?: string;
}) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={`w-full object-cover ${className}`}
        style={{ aspectRatio: ratio }}
      />
    );
  }
  return (
    <div
      className={`relative w-full border border-dashed border-peach/25 bg-surface/40 ${className}`}
      style={{ aspectRatio: ratio }}
      role="img"
      aria-label={`${alt} (asset pending)`}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
        <span className="text-[10px] uppercase tracking-[0.35em] text-mint">{label}</span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-peach/40">{note}</span>
        <span className="text-[10px] uppercase tracking-[0.35em] text-peach/30">Awaiting asset</span>
      </div>
    </div>
  );
}
