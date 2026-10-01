import { useEffect, useState } from "react";
import { faceSrc, renderChub, type ChubFace } from "@/lib/chub-ink";

export function ChubMark({
  face,
  ink,
  className,
  alt,
}: {
  face: ChubFace;
  ink: string;
  className?: string;
  alt: string;
}) {
  const [src, setSrc] = useState(faceSrc(face));

  useEffect(() => {
    let live = true;
    setSrc(faceSrc(face));
    void renderChub(face, ink).then((url) => {
      if (live) setSrc(url);
    });
    return () => {
      live = false;
    };
  }, [face, ink]);

  return <img src={src} alt={alt} className={className} />;
}
