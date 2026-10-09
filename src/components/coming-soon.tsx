import { useEffect, useState } from "react";
import { LAUNCH_LABEL } from "@/lib/coming-soon";

const WALKERS = [
  { src: "/art/wipe/spray-orange.png", name: "walker-a", mist: "#ff7a18" },
  { src: "/art/wipe/quest-blue.png", name: "walker-b", mist: "#4c93ff" },
  { src: "/art/wipe/marker-green.png", name: "walker-c", mist: "#3cba4a" },
];

export function ComingSoon() {
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    const launch = new Date("2026-11-01T00:00:00-04:00").getTime();
    setDays(Math.max(0, Math.ceil((launch - Date.now()) / 86_400_000)));
  }, []);

  return (
    <main className="soon">
      <div className="soon-bricks" />
      <div className="soon-vignette" />
      <div className="soon-splats" aria-hidden="true">
        <i className="splat splat-a" />
        <i className="splat splat-b" />
        <i className="splat splat-c" />
        <i className="splat splat-d" />
        <i className="splat splat-e" />
      </div>
      <div className="soon-tags" aria-hidden="true">
        <p className="tag tag-quest">QUEST-1</p>
        <p className="tag tag-mob">MOB CREW</p>
        <p className="tag tag-chubz">CHUBZ</p>
        <p className="tag tag-miami">MIAMI 305</p>
      </div>
      <div className="soon-lock">
        <p className="soon-crew">QUEST-1 · MOB CREW · MIAMI 305</p>
        <h1>Coming soon</h1>
        <p className="soon-date">{LAUNCH_LABEL}</p>
        {days != null ? <p className="soon-days">{days === 0 ? "Today" : `${days} days`}</p> : null}
      </div>
      <div className="soon-sidewalk" />
      <div className="soon-walkers" aria-hidden="true">
        {WALKERS.map((walker) => (
          <div key={walker.src} className={`walker ${walker.name}`}>
            <span className="mist" style={{ background: walker.mist }} />
            <img src={walker.src} alt="" />
          </div>
        ))}
      </div>
    </main>
  );
}
