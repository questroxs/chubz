import { useEffect, useRef } from "react";
import { faceSrc, renderChub, type ChubFace } from "@/lib/chub-ink";

const SHOT = { src: "/looks/cap-dad.jpg", cx: 0.422, cy: 0.257, w: 0.075 };

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(src));
    image.src = src;
  });
}

export function WornCap({
  face,
  ink,
  className,
  alt,
}: {
  face: ChubFace;
  ink: string;
  blankId?: string;
  className?: string;
  alt: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cancel = false;
    Promise.all([loadImage(SHOT.src), renderChub(face, ink).then((src) => loadImage(src || faceSrc(face)))])
      .then(([model, chub]) => {
        if (cancel) return;
        const width = 900;
        const height = Math.round((width * model.height) / model.width);
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext("2d");
        if (!context) return;
        context.drawImage(model, 0, 0, width, height);
        const printWidth = Math.round(width * SHOT.w);
        const printHeight = Math.round((printWidth * chub.height) / chub.width);
        context.drawImage(
          chub,
          Math.round(width * SHOT.cx - printWidth / 2),
          Math.round(height * SHOT.cy - printHeight / 2),
          printWidth,
          printHeight,
        );
      })
      .catch(() => undefined);
    return () => {
      cancel = true;
    };
  }, [face, ink]);

  return <canvas ref={canvasRef} className={className} role="img" aria-label={alt} />;
}
