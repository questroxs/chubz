import { useEffect, useLayoutEffect, useState } from "react";
import { markHomeIntroPlayed, shouldPlayHomeIntro } from "@/lib/home-intro-gate";

const CHUBS = [
  { src: "/art/chub-orange.png", className: "intro-chub-a" },
  { src: "/art/chub-blue.png", className: "intro-chub-b" },
  { src: "/art/chub-green.png", className: "intro-chub-c" },
];

/** Full-screen wipe. Homepage entry only. */
export function HomeIntro() {
  const [on, setOn] = useState(shouldPlayHomeIntro);

  useLayoutEffect(() => {
    if (!on) return;
    markHomeIntroPlayed();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setOn(false);
  }, [on]);

  useEffect(() => {
    if (!on) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const id = window.setTimeout(() => setOn(false), 2500);
    return () => {
      document.body.style.overflow = previous;
      window.clearTimeout(id);
    };
  }, [on]);

  if (!on) return null;

  return (
    <div className="intro-wipe" aria-hidden="true">
      <span className="intro-bar intro-bar-a" />
      <span className="intro-bar intro-bar-b" />
      <span className="intro-bar intro-bar-c" />
      {CHUBS.map((chub) => (
        <img key={chub.src} src={chub.src} alt="" className={`intro-chub ${chub.className}`} />
      ))}
      <p className="intro-word">Chubz</p>
    </div>
  );
}
