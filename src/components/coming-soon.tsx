import { LAUNCH_LABEL } from "@/lib/coming-soon";

const UNLOCK = `(function(){var a=document.getElementById("chubz-track");if(!a)return;function off(){["pointerdown","touchstart","click","keydown"].forEach(function(n){window.removeEventListener(n,go,true);});}function go(){var p=a.play();if(p&&p.then){p.then(off).catch(function(){});}else off();}["pointerdown","touchstart","click","keydown"].forEach(function(n){window.addEventListener(n,go,true);});go();})();`;

export function ComingSoon() {
  return (
    <main className="soon">
      <audio id="chubz-track" className="soon-track" src="/audio/quest-rocks.mp3" autoPlay playsInline preload="auto" />
      <script dangerouslySetInnerHTML={{ __html: UNLOCK }} />
      <img
        src="/art/quest-wall.jpg"
        alt="Mr Chubz graffiti banner"
        width={1968}
        height={1008}
        decoding="async"
        fetchPriority="low"
        className="soon-banner"
      />
      <div className="soon-lock">
        <p className="soon-crew">Mr Chubz</p>
        <h1>Coming soon</h1>
        <p className="soon-date">{LAUNCH_LABEL}</p>
      </div>
    </main>
  );
}
