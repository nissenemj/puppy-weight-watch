import { useId } from "react";
import { Trees, Waves, Leaf } from "lucide-react";
import type { BookDesign } from "./model";

const palettes = [
  { value: "forest", name: "Metsä", color: "#245246", icon: Trees },
  { value: "lake", name: "Järvi", color: "#233f50", icon: Waves },
  { value: "berry", name: "Marja", color: "#74465c", icon: Leaf },
] as const;

export function BookPalettePicker({
  value,
  onChange,
}: {
  value: BookDesign["palette"];
  onChange: (palette: BookDesign["palette"]) => void;
}) {
  const name = useId();
  return (
    <div
      role="radiogroup"
      aria-label="Kirjan kansiväri"
      className="annual-palette-options"
    >
      {palettes.map((palette) => (
        <label className="annual-radio" key={palette.value}>
          <input
            type="radio"
            name={`${name}-book-palette`}
            value={palette.value}
            checked={value === palette.value}
            onChange={() => onChange(palette.value)}
          />
          <palette.icon
            size={26}
            style={{ color: palette.color }}
            aria-hidden="true"
          />
          {palette.name}
        </label>
      ))}
    </div>
  );
}
