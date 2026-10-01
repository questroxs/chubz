import { useEffect, useRef } from "react";
import { hatShape, type HatShape } from "@/components/cap-mark";
import { faceSrc, renderChub, type ChubFace } from "@/lib/chub-ink";

const SHOTS: Record<HatShape, { src: string; cx: number; cy: number; w: number }> = {
  dad: { src: "/looks/cap-dad.jpg", cx: 0.5, cy: 0.27, w: 0.22 },
  trucker: { src: "/looks/cap-trucker.jpg", cx: 0.5, cy: 0.3, w: 0.2 },
  snap: { src: "/looks/cap-snap.jpg", cx: 0.5, cy: 0.26, w: 0.2 },
  panel: { src: "/looks/cap-panel.jpg", cx: 0.5, cy: 0.23, w: 0.16 },
};

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(src));
    image.src = src;
  });
}

export function capShot(blankId: string) {
  return SHOTS[hatShape(blankId)];
}

/** Model in the cap. The chub file is drawn on the front panel, not redrawn. */
export function WornCap({
  face,
  ink,
  blankId,
  className,
  alt,
}: {
  face: ChubFace;
  ink: string;
  blankId: string;
  className?: string;
  alt: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shape = hatShape(blankId);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cancel = false;
    const shot = SHOTS[shape];
    Promise.all([loadImage(shot.src), renderChub(face, ink).then((src) => loadImage(src || faceSrc(face)))])
      .then(([model, chub]) => {
        if (cancel) return;
        const width = 900;
        const height = Math.round((width * model.height) / model.width);
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext("2d");
        if (!context) return;
        context.drawImage(model, 0, 0, width, height);
        const printWidth = Math.round(width * shot.w);
        const printHeight = Math.round((printWidth * chub.height) / chub.width);
        context.drawImage(
          chub,
          Math.round(width * shot.cx - printWidth / 2),
          Math.round(height * shot.cy - printHeight / 2),
          printWidth,
          printHeight,
        );
      })
      .catch(() => undefined);
    return () => {
      cancel = true;
    };
  }, [face, ink, shape]);

  return <canvas ref={canvasRef} className={className} role="img" aria-label={alt} />;
}
