import { colorsFor, type Lane, type ShirtColor } from "@/lib/catalog";

export function ColorPalette({
  lane,
  value,
  onChange,
  colors: colorsOverride,
}: {
  lane: Lane;
  value: string;
  onChange: (id: string) => void;
  colors?: ShirtColor[];
}) {
  const colors = colorsOverride ?? colorsFor(lane);
  const selected = colors.find((color) => color.id === value) ?? colors[0];
  const groups: Array<{ id: ShirtColor["group"]; label: string }> = [
    { id: "solid", label: "Solids" },
    { id: "heather", label: "Heathers" },
    { id: "safety", label: "Safety and neon" },
  ];

  return (
    <fieldset>
      <legend className="text-sm font-semibold uppercase tracking-widest">
        Color · {colors.length} on this Printful blank
      </legend>
      <p className="mt-1 text-sm text-mute">
        {colorsOverride ? "Printful blank colors." : "Same Gildan names Printful prints."} {selected?.name}.
      </p>
      <div className="mt-3 flex flex-col gap-3">
        {groups.map((group) => {
          const swatches = colors.filter((color) => color.group === group.id);
          if (swatches.length === 0) return null;
          return (
            <div key={group.id}>
              <p className="text-xs font-semibold uppercase tracking-widest text-mute">{group.label}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {swatches.map((swatch) => (
                  <button
                    key={swatch.id}
                    type="button"
                    title={swatch.name}
                    aria-label={swatch.name}
                    aria-pressed={swatch.id === value}
                    onClick={() => onChange(swatch.id)}
                    className={
                      swatch.id === value
                        ? "size-11 border-2 border-pink"
                        : "size-11 border border-line"
                    }
                    style={{ background: swatch.hex }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}
