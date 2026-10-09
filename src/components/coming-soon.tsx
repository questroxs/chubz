import { useEffect, useRef } from "react";
import { LAUNCH_LABEL } from "@/lib/coming-soon";

export function ComingSoon() {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const start = () => {
      void audio.play().catch(() => undefined);
    };
    start();
    const kick = () => start();
    window.addEventListener("pointerdown", kick);
    window.addEventListener("keydown", kick);
    return () => {
      window.removeEventListener("pointerdown", kick);
      window.removeEventListener("keydown", kick);
      audio.pause();
    };
  }, []);

  return (
    <main className="soon">
      <img
        src="/art/quest-wall.jpg"
        alt="Mr Chubz graffiti banner"
        width={1968}
        height={1008}
        decoding="sync"
        fetchPriority="high"
        className="soon-banner"
      />
      <div className="soon-lock">
        <p className="soon-crew">Mr Chubz</p>
        <h1>Coming soon</h1>
        <p className="soon-date">{LAUNCH_LABEL}</p>
      </div>
      <audio ref={audioRef} className="soon-track" src="/audio/quest-rocks.mp3" autoPlay preload="auto" />
    </main>
  );
}
