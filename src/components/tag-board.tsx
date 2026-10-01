import { useEffect, useRef, useState } from "react";

const INKS = [
  { id: "white", hex: "#f4f1ea" },
  { id: "pink", hex: "#ff2d78" },
  { id: "yellow", hex: "#ffe14a" },
  { id: "blue", hex: "#4c93ff" },
  { id: "red", hex: "#ff3b30" },
  { id: "black", hex: "#070708" },
] as const;

const BOARD = "#14110e";

export function TagBoard({ onExport }: { onExport: (jpeg: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [ink, setInk] = useState<(typeof INKS)[number]["hex"]>(INKS[0].hex);
  const [size, setSize] = useState(18);
  const [eraser, setEraser] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.round(rect.width * ratio);
    canvas.height = Math.round(rect.height * ratio);
    const context = canvas.getContext("2d");
    if (!context) return;
    context.scale(ratio, ratio);
    paintBoard(context, rect.width, rect.height);
  }, []);

  function contextOf() {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return canvas.getContext("2d");
  }

  function point(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  function down(event: React.PointerEvent<HTMLCanvasElement>) {
    const context = contextOf();
    if (!context) return;
    drawing.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    const { x, y } = point(event);
    context.beginPath();
    context.moveTo(x, y);
  }

  function move(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    const context = contextOf();
    if (!context) return;
    const { x, y } = point(event);
    context.strokeStyle = eraser ? BOARD : ink;
    context.lineWidth = eraser ? size * 2 : size;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineTo(x, y);
    context.stroke();
  }

  function up() {
    drawing.current = false;
  }

  function clear() {
    const canvas = canvasRef.current;
    const context = contextOf();
    if (!canvas || !context) return;
    const rect = canvas.getBoundingClientRect();
    paintBoard(context, rect.width, rect.height);
  }

  function exportTag() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const max = 800;
    const scale = Math.min(1, max / Math.max(canvas.width, canvas.height));
    const out = document.createElement("canvas");
    out.width = Math.max(1, Math.round(canvas.width * scale));
    out.height = Math.max(1, Math.round(canvas.height * scale));
    const context = out.getContext("2d");
    if (!context) return;
    context.drawImage(canvas, 0, 0, out.width, out.height);
    onExport(out.toDataURL("image/jpeg", 0.6));
  }

  return (
    <div>
      <div className="relative border border-line">
        <span className="pointer-events-none absolute left-3 top-3 text-xs font-semibold uppercase tracking-widest text-yellow">
          Throw the tag
        </span>
        <canvas
          ref={canvasRef}
          className="h-[420px] w-full touch-none bg-ink"
          style={{ cursor: "crosshair" }}
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerCancel={up}
        />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {INKS.map((color) => (
          <button
            key={color.id}
            type="button"
            aria-label={color.id}
            aria-pressed={!eraser && ink === color.hex}
            onClick={() => {
              setInk(color.hex);
              setEraser(false);
            }}
            className={!eraser && ink === color.hex ? "size-11 border-2 border-pink" : "size-11 border border-line"}
            style={{ background: color.hex }}
          />
        ))}
        <button
          type="button"
          aria-pressed={eraser}
          onClick={() => setEraser(true)}
          className={eraser ? "min-h-11 bg-paper px-3 text-sm font-semibold text-ink" : "min-h-11 border border-line px-3 text-sm font-semibold"}
        >
          Erase
        </button>
        {[8, 18, 36].map((width) => (
          <button
            key={width}
            type="button"
            aria-pressed={size === width}
            onClick={() => setSize(width)}
            className={size === width ? "min-h-11 bg-pink px-3 text-sm font-semibold text-pink-ink" : "min-h-11 border border-line px-3 text-sm"}
          >
            {width < 12 ? "Thin" : width < 24 ? "Mid" : "Fat"}
          </button>
        ))}
        <button type="button" onClick={clear} className="min-h-11 border border-line px-3 text-sm font-semibold uppercase tracking-widest">
          Clear
        </button>
        <button type="button" onClick={exportTag} className="min-h-11 bg-yellow px-3 text-sm font-semibold uppercase tracking-widest text-yellow-ink">
          Use this tag
        </button>
      </div>
    </div>
  );
}

function paintBoard(context: CanvasRenderingContext2D, width: number, height: number) {
  context.fillStyle = BOARD;
  context.fillRect(0, 0, width, height);
  context.strokeStyle = "rgba(255,255,255,0.06)";
  context.lineWidth = 1;
  for (let x = 0; x < width; x += 48) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, height);
    context.stroke();
  }
  for (let y = 40; y < height; y += 28) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(width, y);
    context.stroke();
  }
}
