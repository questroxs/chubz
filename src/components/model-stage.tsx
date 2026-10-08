import { useEffect, useState } from "react";
import { inkById, printSrc, type ChubFace } from "@/lib/chub-ink";

export type Stage = {
  src: string;
  cx: number;
  cy: number;
  box: number;
};

const STAGES: Record<string, Stage> = {
  "spray-tee": { src: "/looks/base-tee-black.jpg", cx: 0.5, cy: 0.62, box: 0.38 },
  "quest-tee": { src: "/looks/base-tee-red.jpg", cx: 0.5, cy: 0.58, box: 0.34 },
  "one-eye-tee": { src: "/looks/base-tee-white.jpg", cx: 0.5, cy: 0.78, box: 0.32 },
  "mob-tee": { src: "/looks/base-tee-latina.jpg", cx: 0.5, cy: 0.62, box: 0.36 },
  "spray-hood": { src: "/looks/base-hood-black.jpg", cx: 0.5, cy: 0.55, box: 0.28 },
  "quest-hood": { src: "/looks/base-hood-red.jpg", cx: 0.5, cy: 0.52, box: 0.26 },
  "one-eye-hood": { src: "/looks/base-hood-white.jpg", cx: 0.52, cy: 0.5, box: 0.24 },
  "mob-hood": { src: "/looks/base-hood-latina.jpg", cx: 0.5, cy: 0.58, box: 0.28 },
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
    Promise.all([loadImage(stage.src), loadImage(printSrc(face, ink))])
      .then(([model, artwork]) => {
        if (cancel) return;
        const width = 720;
        const height = Math.round((width * model.height) / model.width);
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext("2d");
        if (!context) return;
        context.drawImage(model, 0, 0, width, height);
        const print = artwork.src.includes(".jpg") ? peelBackdrop(artwork) : artwork;
        const box = Math.round(width * stage.box);
        const scale = Math.min(box / print.width, box / print.height);
        const printWidth = Math.round(print.width * scale);
        const printHeight = Math.round(print.height * scale);
        const centerX = width * stage.cx;
        const centerY = height * stage.cy;
        context.drawImage(
          print,
          Math.round(centerX - printWidth / 2),
          Math.round(centerY - printHeight / 2),
          printWidth,
          printHeight,
        );
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
