import { Link } from "@tanstack/react-router";
import { CapMark, hatShape } from "@/components/cap-mark";
import { blanksFor } from "@/lib/blanks";
import { money } from "@/lib/catalog";

export function CapRack() {
  const caps = blanksFor("cap");
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {caps.map((blank) => (
        <article key={blank.id} className="border border-line bg-panel">
          <Link
            to="/product/$slug"
            params={{ slug: "mean-orange-cap" }}
            search={{ blank: blank.id }}
            className="block"
          >
            <CapMark src="/art/chub-orange.png" alt="" shape={hatShape(blank.id)} />
            <div className="p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-volt">Embroidered cap</p>
              <h3 className="mt-1 text-xl font-semibold">{blank.name}</h3>
              <p className="mt-1 text-sm text-mute">{blank.note}</p>
              <p className="mt-3 w-fit bg-yellow px-2 py-1 text-sm font-bold text-yellow-ink">{money(blank.price)}</p>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}
