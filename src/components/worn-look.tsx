import { useEffect, useRef, useState } from "react";
import { faceSrc, inkById, isNewFace, printSrc, type ChubFace } from "@/lib/chub-ink";

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
  const imgRef = useRef<HTMLImageElement>(null);
  const [broken, setBroken] = useState(false);
  const [painted, setPainted] = useState<string | null>(null);
  const photo = "/looks/blank-tee.jpg";
  const shown = painted ?? photo;

  useEffect(() => {
    setBroken(false);
    const image = imgRef.current;
    if (image && image.complete && image.naturalWidth === 0) setBroken(true);
  }, [shown]);

  useEffect(() => {
    let cancel = false;
    const color = inkById(ink).hex;
    const artwork = isNewFace(face) ? printSrc(face, ink) : faceSrc(face);
    Promise.all([loadImage("/looks/blank-tee.jpg"), loadImage(MASK), loadImage(artwork)])
      .then(([model, mask, chub]) => {
        if (cancel) return;
        const width = 720;
        const height = Math.round((width * model.height) / model.width);
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext("2d", { willReadFrequently: true });
        if (!context) return;
        context.drawImage(model, 0, 0, width, height);
        const [tr, tg, tb] = hexToRgb(shirtHex);
        const maskCanvas = document.createElement("canvas");
        maskCanvas.width = width;
        maskCanvas.height = height;
        const maskContext = maskCanvas.getContext("2d", { willReadFrequently: true });
        maskContext?.drawImage(mask, 0, 0, width, height);
        const matte = maskContext?.getImageData(0, 0, width, height);
        if (matte) {
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
          isNewFace(face) ||
          (face === "mean" && ink === "orange") ||
          (face === "blue" && ink === "blue") ||
          (face === "green" && ink === "green");
        const print = native ? chub : recolorChub(chub, color);
        const printWidth = Math.round(width * (face === "quest" || face === "mob" ? 0.5 : 0.42));
        const printHeight = Math.round((printWidth * print.height) / print.width);
        const centerX = width * 0.49;
        const centerY = height * 0.59;
        context.drawImage(
          print,
          Math.round(centerX - printWidth / 2),
          Math.round(centerY - printHeight / 2),
          printWidth,
          printHeight,
        );
        if (!cancel) {
          setPainted(canvas.toDataURL("image/jpeg", 0.82));
          setBroken(false);
        }
      })
      .catch(() => {
        if (!cancel) setPainted(null);
      });
    return () => {
      cancel = true;
    };
  }, [face, ink, shirtHex]);

  return (
    <div
      className={`relative overflow-hidden bg-ink bg-cover bg-center ${className ?? ""}`}
      style={broken ? undefined : { backgroundImage: `url("${shown}")` }}
    >
      {broken ? null : (
        <img
          ref={imgRef}
          src={shown}
          alt={alt}
          width={720}
          height={1080}
          decoding="async"
          className="relative z-0 h-full w-full object-cover"
          onError={() => setBroken(true)}
        />
      )}
    </div>
  );
}
