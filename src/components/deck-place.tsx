import { useEffect, useRef, useState } from "react";

/** Point’s standard-deck artboard. Steep widths on this shop are all under 8.5. */
export const SHEET_W = 9;
export const SHEET_H = 34;

export const TRUCKS = [
  { id: "none", label: "No trucks" },
  { id: "5.0", label: "Stock 5.0" },
  { id: "5.25", label: "Stock 5.25" },
  { id: "5.5", label: "Stock 5.5" },
  { id: "longboard", label: "Longboard" },
] as const;

export const WHEELS = [
  { id: "none", label: "No wheels" },
  { id: "type-t", label: "Type T · 99a" },
  { id: "type-d", label: "Type D · 101a inner / 99a outer" },
  { id: "type-pc", label: "Type PC · 98a outer" },
  { id: "type-lb", label: "Type LB · 58–76 mm" },
] as const;

export const GRIPS = [
  { id: "none", label: "No grip" },
  { id: "sheet", label: "Perforated sheet" },
] as const;

export type DeckPlace = {
  side: "bottom" | "top";
  scaleX: number;
  scaleY: number;
  ox: number;
  oy: number;
  truck: (typeof TRUCKS)[number]["id"];
  wheel: (typeof WHEELS)[number]["id"];
  grip: (typeof GRIPS)[number]["id"];
};

const START: DeckPlace = {
  side: "bottom",
  scaleX: 1,
  scaleY: 1,
  ox: 0,
  oy: 0,
  truck: "none",
  wheel: "none",
  grip: "none",
};

type Box = { w: number; h: number };

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/** Fractions of the 9×34 sheet. scale 1 is “fit inside the sheet”. */
export function sheetBox(pxW: number, pxH: number, scaleX: number, scaleY: number): Box {
  const imgAspect = pxW / pxH;
  const boardAspect = SHEET_W / SHEET_H;
  const containW = imgAspect > boardAspect ? 1 : imgAspect / boardAspect;
  const containH = imgAspect > boardAspect ? boardAspect / imgAspect : 1;
  return { w: containW * scaleX, h: containH * scaleY };
}

export function placeNote(width: string, px: { w: number; h: number } | null, place: DeckPlace): string {
  const truck = TRUCKS.find((item) => item.id === place.truck)?.label ?? "No trucks";
  const wheel = WHEELS.find((item) => item.id === place.wheel)?.label ?? "No wheels";
  const grip = GRIPS.find((item) => item.id === place.grip)?.label ?? "No grip";
  const lines = [
    `Print side: ${place.side}`,
    `Deck width: ${width}`,
    px
      ? `On Point’s 9×34 in sheet: ${(sheetBox(px.w, px.h, place.scaleX, place.scaleY).w * SHEET_W).toFixed(2)} in wide × ${(sheetBox(px.w, px.h, place.scaleX, place.scaleY).h * SHEET_H).toFixed(2)} in tall`
      : "Size on the sheet: not measured",
    `Nudged ${place.ox > 0 ? "right" : "left"} ${Math.abs(place.ox).toFixed(0)}% of the sheet, ${place.oy > 0 ? "down" : "up"} ${Math.abs(place.oy).toFixed(0)}%`,
    px ? `Source: ${px.w}×${px.h} px` : "Source pixels: unknown",
  ];
  if (px) {
    const box = sheetBox(px.w, px.h, place.scaleX, place.scaleY);
    const dpiX = Math.round(px.w / (box.w * SHEET_W));
    const dpiY = Math.round(px.h / (box.h * SHEET_H));
    lines.push(`About ${dpiX} DPI across and ${dpiY} DPI down at this size. Point wants 300 DPI, 2700×10200 px, CMYK JPEG.`);
  }
  lines.push(
    `Trucks: ${truck}. Point’s stock widths are 5.0, 5.25, 5.5, and longboard. A custom hanger or baseplate color is 25 sets.`,
    `Wheels: ${wheel}. Type T is 99a, stock program, 25 sets to print. Type D and Type PC are 250 sets. Type LB custom print is 25 sets, 58–76 mm.`,
    `Grip: ${grip}. Point’s sheet is premium grit on a waterproof perforated backing. A custom die-cut is 100 sheets.`,
    "Point’s steep deck is a bottom print. The rounded shape is this width on the 9×34 sheet, not their die line.",
  );
  return lines.join("\n");
}

function roundedDeck(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  const r = Math.min(w, h) * 0.42;
  ctx.beginPath();
  ctx.moveTo(x + w / 2, y);
  ctx.bezierCurveTo(x + w - r * 0.2, y, x + w, y + r, x + w, y + r * 1.15);
  ctx.lineTo(x + w, y + h - r * 1.15);
  ctx.bezierCurveTo(x + w, y + h - r * 0.15, x + w - r * 0.2, y + h, x + w / 2, y + h);
  ctx.bezierCurveTo(x + r * 0.2, y + h, x, y + h - r * 0.15, x, y + h - r * 1.15);
  ctx.lineTo(x, y + r * 1.15);
  ctx.bezierCurveTo(x, y + r, x + r * 0.2, y, x + w / 2, y);
  ctx.closePath();
}

export function renderPlacementJpeg(art: string, widthIn: number, place: DeckPlace): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 270;
      canvas.height = 1020;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Couldn’t draw the placement."));
        return;
      }
      ctx.fillStyle = "#f4efe6";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const box = sheetBox(img.naturalWidth, img.naturalHeight, place.scaleX, place.scaleY);
      const dw = box.w * canvas.width;
      const dh = box.h * canvas.height;
      const dx = (0.5 + place.ox / 100) * canvas.width - dw / 2;
      const dy = (0.5 + place.oy / 100) * canvas.height - dh / 2;
      ctx.drawImage(img, dx, dy, dw, dh);
      const inset = ((SHEET_W - widthIn) / 2 / SHEET_W) * canvas.width;
      const deckX = inset;
      const deckW = canvas.width - inset * 2;
      const deckY = canvas.height * 0.03;
      const deckH = canvas.height * 0.94;
      if (place.side === "top" && place.grip === "sheet") {
        ctx.save();
        roundedDeck(ctx, deckX, deckY, deckW, deckH);
        ctx.clip();
        ctx.fillStyle = "rgba(20,20,20,0.72)";
        ctx.fillRect(deckX, deckY, deckW, deckH);
        ctx.restore();
      }
      ctx.save();
      roundedDeck(ctx, deckX, deckY, deckW, deckH);
      ctx.strokeStyle = "#111";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
      if (place.truck !== "none" || place.wheel !== "none") {
        const hanger = place.truck === "longboard" ? deckW * 0.92 : deckW * 0.72;
        for (const t of [0.28, 0.72]) {
          const cy = deckY + deckH * t;
          const cx = deckX + deckW / 2;
          if (place.truck !== "none") {
            ctx.fillStyle = "#c5c5c5";
            ctx.fillRect(cx - hanger / 2, cy - 7, hanger, 14);
          }
          if (place.wheel !== "none") {
            const radius = place.wheel === "type-lb" ? 16 : 11;
            ctx.fillStyle = "#f2f2f2";
            ctx.strokeStyle = "#111";
            for (const side of [-1, 1]) {
              ctx.beginPath();
              ctx.arc(cx + side * (hanger / 2 + 2), cy, radius, 0, Math.PI * 2);
              ctx.fill();
              ctx.stroke();
            }
          }
        }
      }
      let quality = 0.72;
      let url = canvas.toDataURL("image/jpeg", quality);
      while (url.length > 170_000 && quality > 0.4) {
        quality -= 0.1;
        url = canvas.toDataURL("image/jpeg", quality);
      }
      resolve(url);
    };
    img.onerror = () => reject(new Error("Couldn’t read the graphic."));
    img.src = art;
  });
}

export function DeckStudio({
  art,
  widthIn,
  onPlace,
}: {
  art: string | null;
  widthIn: number;
  onPlace: (place: DeckPlace, note: string) => void;
}) {
  const [place, setPlace] = useState<DeckPlace>(START);
  const [px, setPx] = useState<{ w: number; h: number } | null>(null);
  const drag = useRef<{ x: number; y: number; ox: number; oy: number; w: number; h: number } | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!art) {
      setPx(null);
      return;
    }
    const img = new Image();
    img.onload = () => setPx({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = art;
  }, [art]);

  useEffect(() => {
    onPlace(place, placeNote(String(widthIn), px, place));
  }, [place, px, widthIn, onPlace]);

  const box = px ? sheetBox(px.w, px.h, place.scaleX, place.scaleY) : null;
  const dpiX = px && box ? Math.round(px.w / (box.w * SHEET_W)) : null;
  const dpiY = px && box ? Math.round(px.h / (box.h * SHEET_H)) : null;
  const inset = ((SHEET_W - widthIn) / 2 / SHEET_W) * 100;

  function patch(next: Partial<DeckPlace>) {
    setPlace((current) => ({ ...current, ...next }));
  }

  function fit(mode: "fit" | "fill" | "stretch") {
    if (!px) return;
    const base = sheetBox(px.w, px.h, 1, 1);
    if (mode === "fit") patch({ scaleX: 1, scaleY: 1, ox: 0, oy: 0 });
    if (mode === "fill") {
      const cover = Math.max(1 / base.w, 1 / base.h);
      patch({ scaleX: cover, scaleY: cover, ox: 0, oy: 0 });
    }
    if (mode === "stretch") patch({ scaleX: 1 / base.w, scaleY: 1 / base.h, ox: 0, oy: 0 });
  }

  const imgStyle = box
    ? {
        left: `${50 + place.ox}%`,
        top: `${50 + place.oy}%`,
        width: `${box.w * 100}%`,
        height: `${box.h * 100}%`,
      }
    : null;

  return (
    <div className="border border-line bg-white p-4 text-ink">
      <p className="text-xs font-semibold uppercase tracking-widest">9 × 34 in sheet</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {(["bottom", "top"] as const).map((side) => (
          <button
            key={side}
            type="button"
            aria-pressed={place.side === side}
            onClick={() => patch({ side })}
            className={place.side === side ? "min-h-11 border-2 border-pink bg-white px-3 text-xs font-semibold uppercase tracking-widest" : "min-h-11 border border-line px-3 text-xs font-semibold uppercase tracking-widest"}
          >
            {side}
          </button>
        ))}
      </div>
      <div
        ref={boardRef}
        className="relative mx-auto mt-4 touch-none overflow-hidden border border-ink bg-[#f4efe6]"
        style={{ aspectRatio: "9 / 34", height: "min(68vh, 520px)" }}
        onPointerDown={(event) => {
          const rect = boardRef.current?.getBoundingClientRect();
          if (!rect || !art) return;
          drag.current = { x: event.clientX, y: event.clientY, ox: place.ox, oy: place.oy, w: rect.width, h: rect.height };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (!drag.current) return;
          const dx = ((event.clientX - drag.current.x) / drag.current.w) * 100;
          const dy = ((event.clientY - drag.current.y) / drag.current.h) * 100;
          patch({ ox: clamp(drag.current.ox + dx, -80, 80), oy: clamp(drag.current.oy + dy, -80, 80) });
        }}
        onPointerUp={() => {
          drag.current = null;
        }}
      >
        {art && imgStyle ? (
          <img src={art} alt="" draggable={false} className="absolute max-w-none object-fill" style={{ ...imgStyle, transform: "translate(-50%, -50%)" }} />
        ) : null}
        <div
          className="pointer-events-none absolute overflow-hidden border-2 border-ink"
          style={{ left: `${inset}%`, right: `${inset}%`, top: "3%", bottom: "3%", borderRadius: "50% / 8%" }}
        >
          {place.side === "top" && place.grip === "sheet" ? (
            <div className="absolute inset-0 bg-ink/70" style={{ backgroundImage: "radial-gradient(#444 0.7px, transparent 0.8px)", backgroundSize: "5px 5px" }} />
          ) : null}
          {place.truck !== "none" || place.wheel !== "none" ? (
            <>
              {[28, 72].map((top) => (
                <div key={top} className="absolute left-1/2" style={{ top: `${top}%`, width: place.truck === "longboard" ? "92%" : "72%", transform: "translate(-50%, -50%)" }}>
                  {place.truck !== "none" ? <div className="h-3 w-full bg-neutral-300" /> : null}
                  {place.wheel !== "none" ? (
                    <>
                      <span className={`absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full border border-ink bg-white ${place.wheel === "type-lb" ? "size-8" : "size-5"}`} />
                      <span className={`absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 rounded-full border border-ink bg-white ${place.wheel === "type-lb" ? "size-8" : "size-5"}`} />
                    </>
                  ) : null}
                </div>
              ))}
            </>
          ) : null}
        </div>
        {!art ? <p className="absolute inset-0 grid place-items-center px-3 text-center text-xs font-semibold uppercase tracking-widest text-ink">Upload a graphic</p> : null}
      </div>
      <p className="mt-2 text-sm text-mute">
        Drag the graphic. The sheet is Point’s 9 × 34 in artboard. The outline is this deck’s width, not their die line.
        {dpiX != null && dpiY != null ? ` This size is about ${dpiX} DPI across and ${dpiY} DPI down.` : ""}
        {dpiX != null && dpiY != null && (dpiX < 300 || dpiY < 300) ? " Point says low-resolution art prints as low resolution. They want 300 DPI." : ""}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {(
          [
            ["fit", "Fit"],
            ["fill", "Fill"],
            ["stretch", "Stretch to sheet"],
          ] as const
        ).map(([mode, label]) => (
          <button key={mode} type="button" onClick={() => fit(mode)} className="min-h-11 border border-line px-3 text-xs font-semibold uppercase tracking-widest">
            {label}
          </button>
        ))}
        <button type="button" onClick={() => patch({ ox: 0, oy: 0 })} className="min-h-11 border border-line px-3 text-xs font-semibold uppercase tracking-widest">
          Center
        </button>
      </div>
      <label className="mt-4 block text-xs font-semibold uppercase tracking-widest">
        Width {place.scaleX.toFixed(2)}
        <input className="mt-1 w-full" type="range" min={0.2} max={3} step={0.01} value={place.scaleX} onChange={(event) => patch({ scaleX: Number(event.target.value) })} />
      </label>
      <label className="mt-3 block text-xs font-semibold uppercase tracking-widest">
        Height {place.scaleY.toFixed(2)}
        <input className="mt-1 w-full" type="range" min={0.2} max={3} step={0.01} value={place.scaleY} onChange={(event) => patch({ scaleY: Number(event.target.value) })} />
      </label>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {(
          [
            ["Left", { ox: clamp(place.ox - 4, -80, 80) }],
            ["Right", { ox: clamp(place.ox + 4, -80, 80) }],
            ["Up", { oy: clamp(place.oy - 4, -80, 80) }],
            ["Down", { oy: clamp(place.oy + 4, -80, 80) }],
          ] as const
        ).map(([label, next]) => (
          <button key={label} type="button" onClick={() => patch(next)} className="min-h-11 border border-line text-xs font-semibold uppercase tracking-widest">
            {label}
          </button>
        ))}
      </div>
      <fieldset className="mt-5">
        <legend className="text-xs font-semibold uppercase tracking-widest">Trucks</legend>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {TRUCKS.map((item) => (
            <button key={item.id} type="button" aria-pressed={place.truck === item.id} onClick={() => patch({ truck: item.id })} className={place.truck === item.id ? "min-h-11 border-2 border-pink px-2 text-xs font-semibold uppercase tracking-widest" : "min-h-11 border border-line px-2 text-xs font-semibold uppercase tracking-widest"}>
              {item.label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-sm text-mute">Point’s stock trucks. A custom hanger or baseplate color is 25 sets, so it is not a separate price here.</p>
      </fieldset>
      <fieldset className="mt-4">
        <legend className="text-xs font-semibold uppercase tracking-widest">Wheels</legend>
        <div className="mt-2 grid gap-2">
          {WHEELS.map((item) => (
            <button key={item.id} type="button" aria-pressed={place.wheel === item.id} onClick={() => patch({ wheel: item.id })} className={place.wheel === item.id ? "min-h-11 border-2 border-pink px-2 text-left text-xs font-semibold uppercase tracking-widest" : "min-h-11 border border-line px-2 text-left text-xs font-semibold uppercase tracking-widest"}>
              {item.label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-sm text-mute">Type T is their 99a stock program. Custom wheel printing starts at 25 sets. Type D and Type PC are 250 sets.</p>
      </fieldset>
      <fieldset className="mt-4">
        <legend className="text-xs font-semibold uppercase tracking-widest">Grip</legend>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {GRIPS.map((item) => (
            <button key={item.id} type="button" aria-pressed={place.grip === item.id} onClick={() => patch({ grip: item.id })} className={place.grip === item.id ? "min-h-11 border-2 border-pink px-2 text-xs font-semibold uppercase tracking-widest" : "min-h-11 border border-line px-2 text-xs font-semibold uppercase tracking-widest"}>
              {item.label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-sm text-mute">Premium grit on a waterproof perforated sheet. A custom die-cut is 100 sheets.</p>
      </fieldset>
    </div>
  );
}
