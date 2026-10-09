import { LAUNCH_LABEL } from "@/lib/coming-soon";

export function ComingSoon() {
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
        <audio className="soon-track" controls preload="metadata" src="/audio/quest-rocks.mp3">
          Quest Rocks
        </audio>
      </div>
    </main>
  );
}
