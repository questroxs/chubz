export type HatShape = "dad" | "snap" | "trucker" | "panel";

export function hatShape(id: string): HatShape {
  if (id.includes("snap") || id.includes("flex")) return "snap";
  if (id.includes("trucker") || id.includes("retro")) return "trucker";
  if (id === "cap-5") return "panel";
  return "dad";
}

function shade(hex: string, amount: number) {
  const raw = hex.replace("#", "");
  const n = Number.parseInt(raw.length === 3 ? raw.split("").map((c) => c + c).join("") : raw, 16);
  if (!Number.isFinite(n)) return "#181717";
  const clamp = (value: number) => Math.max(0, Math.min(255, value));
  const parts = [clamp(((n >> 16) & 255) + amount), clamp(((n >> 8) & 255) + amount), clamp((n & 255) + amount)];
  return `#${parts.map((value) => value.toString(16).padStart(2, "0")).join("")}`;
}

export function CapMark({
  src,
  alt,
  hex = "#181717",
  shape = "dad",
  className,
}: {
  src: string;
  alt: string;
  hex?: string;
  shape?: HatShape;
  className?: string;
}) {
  const crown = hex;
  const brim = shade(hex, -28);
  const stitch = "rgba(243,239,230,0.45)";
  return (
    <div className={className ?? "relative aspect-[3/4] overflow-hidden bg-[#2c2a28]"}>
      <svg viewBox="0 0 300 400" className="h-full w-full" aria-hidden="true">
        {shape === "snap" ? (
          <>
            <path d="M70 248 L70 132 Q70 78 150 72 Q230 78 230 132 L230 248 Z" fill={crown} />
            <path d="M40 248 H260 L278 292 H22 Z" fill={brim} />
            <path d="M150 78 V248" stroke={stitch} strokeWidth="2" fill="none" />
            <circle cx="150" cy="74" r="7" fill={shade(hex, -40)} />
          </>
        ) : shape === "trucker" ? (
          <>
            <path d="M48 250 C48 150 78 96 118 96 H182 C222 96 252 150 252 250 Z" fill={shade(hex, 36)} />
            {Array.from({ length: 8 }).map((_, row) =>
              Array.from({ length: 4 }).map((__, col) => (
                <circle key={`${row}-${col}`} cx={62 + col * 14} cy={130 + row * 14} r="3" fill="rgba(0,0,0,0.28)" />
              )),
            )}
            {Array.from({ length: 8 }).map((_, row) =>
              Array.from({ length: 4 }).map((__, col) => (
                <circle key={`r-${row}-${col}`} cx={188 + col * 14} cy={130 + row * 14} r="3" fill="rgba(0,0,0,0.28)" />
              )),
            )}
            <path d="M108 250 V118 Q108 88 150 84 Q192 88 192 118 V250 Z" fill={crown} />
            <path d="M58 258 Q150 300 242 258 Q150 286 58 258 Z" fill={brim} />
            <circle cx="150" cy="84" r="6" fill={shade(hex, -40)} />
          </>
        ) : shape === "panel" ? (
          <>
            <path d="M78 246 C78 140 108 92 150 86 C192 92 222 140 222 246 Z" fill={crown} />
            <path d="M150 86 L118 246" stroke={stitch} strokeWidth="2" fill="none" />
            <path d="M150 86 L182 246" stroke={stitch} strokeWidth="2" fill="none" />
            <path d="M70 250 Q150 292 230 250 Q150 274 70 250 Z" fill={brim} />
            <circle cx="150" cy="86" r="6" fill={shade(hex, -40)} />
          </>
        ) : (
          <>
            <path d="M72 246 C72 132 104 88 150 82 C196 88 228 132 228 246 Z" fill={crown} />
            <path d="M150 86 V246" stroke={stitch} strokeWidth="2" fill="none" />
            <ellipse cx="150" cy="262" rx="118" ry="28" fill={brim} />
            <ellipse cx="150" cy="252" rx="100" ry="14" fill={crown} />
            <circle cx="150" cy="84" r="7" fill={shade(hex, -40)} />
          </>
        )}
      </svg>
      <img
        src={src}
        alt={alt}
        className="pointer-events-none absolute left-1/2 w-[38%] -translate-x-1/2 object-contain drop-shadow-md"
        style={{ top: shape === "snap" ? "30%" : "28%" }}
      />
    </div>
  );
}
