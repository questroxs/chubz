import { useEffect, useRef } from "react";
import { faceSrc, inkById, type ChubFace } from "@/lib/chub-ink";

const MODEL = "/looks/blank-tee.jpg";
const MASK = "/looks/blank-tee-mask.png";

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(src));
    image.src = src;
  });
}

function hexToRgb(hex: string): [number, number, number] {
  const n = Number.parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Recolor the chub fill. Black outlines, X's, and white eyes stay put. */
function recolorChub(source: HTMLImageElement, hex: string) {
  const max = 640;
  const scale = Math.min(1, max / Math.max(source.width, source.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(source.width * scale));
  canvas.height = Math.max(1, Math.round(source.height * scale));
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return canvas;
  context.drawImage(source, 0, 0, canvas.width, canvas.height);
  const frame = context.getImageData(0, 0, canvas.width, canvas.height);
  const data = frame.data;
  const target = hexToRgb(hex);
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    if (a < 20) continue;
    const maxC = Math.max(r, g, b);
    const minC = Math.min(r, g, b);
    const sat = maxC === 0 ? 0 : (maxC - minC) / maxC;
    const lum = (r + g + b) / 3;
    if (lum < 48 || sat < 0.22) continue;
    const tone = Math.max(0.45, Math.min(1.2, lum / 145));
    data[i] = Math.min(255, Math.round(target[0] * tone));
    data[i + 1] = Math.min(255, Math.round(target[1] * tone));
    data[i + 2] = Math.min(255, Math.round(target[2] * tone));
  }
  context.putImageData(frame, 0, 0);
  return canvas;
}

export function WornLook({
  face,
  ink,
  shirtHex,
  className,
  alt,
}: {
  face: ChubFace;
  ink: string;
  shirtHex: string;
  className?: string;
  alt: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cancel = false;
    const color = inkById(ink).hex;
    Promise.all([loadImage(MODEL), loadImage(MASK), loadImage(faceSrc(face))])
      .then(([model, mask, chub]) => {
        if (cancel) return;
        const width = 720;
        const height = Math.round((width * model.height) / model.width);
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext("2d", { willReadFrequently: true });
        if (!context) return;
        context.drawImage(model, 0, 0, width, height);
        const [tr, tg, tb] = hexToRgb(shirtHex);
        const shirtIsBlack = tr + tg + tb < 90;
        const maskCanvas = document.createElement("canvas");
        maskCanvas.width = width;
        maskCanvas.height = height;
        const maskContext = maskCanvas.getContext("2d", { willReadFrequently: true });
        maskContext?.drawImage(mask, 0, 0, width, height);
        const matte = maskContext?.getImageData(0, 0, width, height);
        if (matte && !shirtIsBlack) {
          const photo = context.getImageData(0, 0, width, height);
          const data = photo.data;
          const alpha = matte.data;
          for (let i = 0; i < data.length; i += 4) {
            if (alpha[i] < 128) continue;
            const lum = (data[i] + data[i + 1] + data[i + 2]) / 3;
            const shade = 0.55 + 0.55 * Math.min(1, lum / 42);
            data[i] = Math.min(255, Math.round(tr * shade));
            data[i + 1] = Math.min(255, Math.round(tg * shade));
            data[i + 2] = Math.min(255, Math.round(tb * shade));
          }
          context.putImageData(photo, 0, 0);
        }
        const native =
          (face === "mean" && ink === "orange") ||
          (face === "blue" && ink === "blue") ||
          (face === "green" && ink === "green");
        const print = native ? chub : recolorChub(chub, color);
        const printWidth = Math.round(width * 0.42);
        const printHeight = Math.round((printWidth * print.height) / print.width);
        const centerX = width * 0.52;
        const centerY = height * 0.59;
        context.drawImage(
          print,
          Math.round(centerX - printWidth / 2),
          Math.round(centerY - printHeight / 2),
          printWidth,
          printHeight,
        );
      })
      .catch(() => undefined);
    return () => {
      cancel = true;
    };
  }, [face, ink, shirtHex]);

  return <canvas ref={canvasRef} className={className} role="img" aria-label={alt} />;
}
