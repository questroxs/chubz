import { useEffect, useState } from "react";
import { inkById, printSrc, type ChubFace } from "@/lib/chub-ink";

export type Stage = {
  src: string;
  cx: number;
  cy: number;
  box: number;
  /** A point on plain shirt fabric, used to cover the old print. */
  sample: [number, number];
  face: ChubFace;
  ink: string;
};

const STAGES: Record<string, Stage> = {
  "spray-tee": { src: "/looks/fit-tee-black.jpg", cx: 0.51, cy: 0.64, box: 0.34, sample: [0.2, 0.78], face: "spray", ink: "orange" },
  "quest-tee": { src: "/looks/fit-tee-red.jpg", cx: 0.49, cy: 0.58, box: 0.34, sample: [0.16, 0.62], face: "quest", ink: "blue" },
  "one-eye-tee": { src: "/looks/fit6-tee-white.jpg", cx: 0.51, cy: 0.72, box: 0.32, sample: [0.18, 0.75], face: "thumb", ink: "green" },
  "mob-tee": { src: "/looks/fit-tee-latina.jpg", cx: 0.51, cy: 0.64, box: 0.34, sample: [0.2, 0.82], face: "mob", ink: "green" },
  "spray-hood": { src: "/looks/fit-hood-black.jpg", cx: 0.52, cy: 0.56, box: 0.28, sample: [0.3, 0.74], face: "spray", ink: "orange" },
  "quest-hood": { src: "/looks/fit4-hood-red.jpg", cx: 0.55, cy: 0.55, box: 0.26, sample: [0.28, 0.68], face: "quest", ink: "blue" },
  "one-eye-hood": { src: "/looks/fit4-hood-white.jpg", cx: 0.54, cy: 0.5, box: 0.24, sample: [0.75, 0.7], face: "thumb", ink: "green" },
  "mob-hood": { src: "/looks/fit-hood-latina.jpg", cx: 0.52, cy: 0.6, box: 0.28, sample: [0.24, 0.78], face: "mob", ink: "green" },
};

export function stageFor(slug: string) {
  return STAGES[slug] ?? null;
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(src));
    image.src = src;
  });
}

/** Mob files are JPEGs on a black field. Peel that field off, keep the drawing. */
function peelBackdrop(source: HTMLImageElement) {
  const canvas = document.createElement("canvas");
  canvas.width = source.width;
  canvas.height = source.height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return canvas;
  context.drawImage(source, 0, 0);
  const frame = context.getImageData(0, 0, canvas.width, canvas.height);
  const data = frame.data;
  const width = canvas.width;
  const height = canvas.height;
  const seen = new Uint8Array(width * height);
  const seed = [data[0], data[1], data[2]];
  const stack = [0, width - 1, (height - 1) * width, (height - 1) * width + width - 1];
  while (stack.length) {
    const index = stack.pop();
    if (index == null || seen[index]) continue;
    seen[index] = 1;
    const offset = index * 4;
    const drift = Math.abs(data[offset] - seed[0]) + Math.abs(data[offset + 1] - seed[1]) + Math.abs(data[offset + 2] - seed[2]);
    if (drift > 36) continue;
    data[offset + 3] = 0;
    const x = index % width;
    const y = (index / width) | 0;
    if (x > 0) stack.push(index - 1);
    if (x < width - 1) stack.push(index + 1);
    if (y > 0) stack.push(index - width);
    if (y < height - 1) stack.push(index + width);
  }
  context.putImageData(frame, 0, 0);
  return canvas;
}

export function ModelStage({
  slug,
  face,
  ink,
  className,
  alt,
}: {
  slug: string;
  face: ChubFace;
  ink: string;
  className?: string;
  alt: string;
}) {
  const stage = stageFor(slug);
  const [painted, setPainted] = useState<string | null>(null);
  const src = stage?.src ?? "";

  useEffect(() => {
    if (!stage) return;
    let cancel = false;
    const untouched = face === stage.face && ink === stage.ink;
    if (untouched) {
      setPainted(null);
      return;
    }
    Promise.all([loadImage(stage.src), loadImage(printSrc(face, ink))])
      .then(([model, artwork]) => {
        if (cancel) return;
        const width = 720;
        const height = Math.round((width * model.height) / model.width);
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext("2d", { willReadFrequently: true });
        if (!context) return;
        context.drawImage(model, 0, 0, width, height);
        const sx = Math.min(width - 1, Math.max(0, Math.round(stage.sample[0] * width)));
        const sy = Math.min(height - 1, Math.max(0, Math.round(stage.sample[1] * height)));
        const pixel = context.getImageData(sx, sy, 1, 1).data;
        const box = Math.round(width * stage.box);
        const centerX = width * stage.cx;
        const centerY = height * stage.cy;
        context.fillStyle = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
        context.fillRect(centerX - box * 0.52, centerY - box * 0.56, box * 1.04, box * 1.12);
        const print = artwork.src.includes(".jpg") ? peelBackdrop(artwork) : artwork;
        const scale = Math.min(box / print.width, box / print.height);
        const printWidth = Math.round(print.width * scale);
        const printHeight = Math.round(print.height * scale);
        context.drawImage(print, Math.round(centerX - printWidth / 2), Math.round(centerY - printHeight / 2), printWidth, printHeight);
        if (!cancel) setPainted(canvas.toDataURL("image/jpeg", 0.84));
      })
      .catch(() => {
        if (!cancel) setPainted(null);
      });
    return () => {
      cancel = true;
    };
  }, [stage, face, ink]);

  if (!stage) return null;
  const shown = painted ?? src;
  return (
    <img
      src={shown}
      alt={`${alt}. ${inkById(ink).name} print.`}
      className={className}
    />
  );
}
