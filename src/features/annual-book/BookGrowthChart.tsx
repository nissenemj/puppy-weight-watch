import { useEffect, useId, useRef, useState } from "react";
import { formatDay, type AnnualBook } from "./model";
import { CHART, formatKg, growthSeries } from "./growth";

export function BookWeightTable({
  weights,
}: {
  weights: AnnualBook["weights"];
}) {
  return (
    <table>
      <caption>Painomittaukset</caption>
      <thead>
        <tr>
          <th scope="col">Päivämäärä</th>
          <th scope="col">Paino (kg)</th>
        </tr>
      </thead>
      <tbody>
        {weights.map((weight, index) => (
          <tr key={`${weight.date}-${index}`}>
            <td>{formatDay(weight.date)}</td>
            <td>{formatKg(weight.kg)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function BookGrowthChart({
  weights,
}: {
  weights: AnnualBook["weights"];
}) {
  const id = useId();
  const svg = useRef<SVGSVGElement>(null);
  const [width, setWidth] = useState(CHART.width);
  useEffect(() => {
    const element = svg.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      const measuredWidth = Math.max(180, Math.round(entry.contentRect.width));
      setWidth((current) =>
        current === measuredWidth ? current : measuredWidth,
      );
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const series = growthSeries(weights, width);
  if (!series) return <p>Valitulta ajalta ei ole painomittauksia.</p>;
  const { points, ticks, dates, first, last, hasTimeSpan } = series;
  return (
    <figure className="annual-growth-chart">
      <svg
        ref={svg}
        viewBox={`0 0 ${width} ${CHART.height}`}
        role="img"
        aria-labelledby={`${id}-title`}
        aria-describedby={`${id}-description`}
      >
        <title id={`${id}-title`}>Kasvukäyrä omista painomittauksista</title>
        <desc id={`${id}-description`}>
          {points.length} mittausta. Ensimmäinen {formatDay(first.date)}:{" "}
          {formatKg(first.kg)} kg. Viimeinen {formatDay(last.date)}:{" "}
          {formatKg(last.kg)} kg. Vaaka-akseli näyttää tapahtumapäivät ja
          pystyakseli painon kilogrammoina. Tarkat mittaukset ovat taulukossa.
        </desc>
        <g className="annual-chart-axis" aria-hidden="true">
          <text x={CHART.left} y={12}>
            kg
          </text>
          {ticks.map((tick, index) => (
            <g key={index}>
              <line
                x1={CHART.left}
                y1={tick.y}
                x2={width - CHART.right}
                y2={tick.y}
                className="annual-chart-grid"
              />
              <text x={CHART.left - 10} y={tick.y + 4} textAnchor="end">
                {formatKg(tick.kg)}
              </text>
            </g>
          ))}
          {dates.map((point) => (
            <text
              key={point.date}
              x={point.x}
              y={CHART.height - 29}
              textAnchor={
                hasTimeSpan && point.date === first.date
                  ? "start"
                  : hasTimeSpan && point.date === last.date
                    ? "end"
                    : "middle"
              }
            >
              {new Intl.DateTimeFormat("fi-FI", {
                day: "numeric",
                month: "numeric",
                timeZone: "UTC",
              }).format(new Date(`${point.date}T12:00:00Z`))}
            </text>
          ))}
          <text
            x={(CHART.left + width - CHART.right) / 2}
            y={CHART.height - 5}
            textAnchor="middle"
          >
            Mittauspäivä
          </text>
        </g>
        {hasTimeSpan && (
          <polyline
            points={points
              .map((point) => `${point.x.toFixed(2)},${point.y.toFixed(2)}`)
              .join(" ")}
            className="annual-chart-line"
            fill="none"
            strokeWidth={3}
            strokeLinejoin="round"
          />
        )}
        <g aria-hidden="true">
          {points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r={points.length > 60 ? 2 : 4}
              className="annual-chart-point"
            />
          ))}
        </g>
      </svg>
      <div className="annual-growth-facts">
        <p>
          <strong>{formatKg(first.kg)} kg</strong>
          <span>{formatDay(first.date)}</span>
        </p>
        <p>
          <strong>{points.length}</strong>
          <span>{points.length === 1 ? "oma mittaus" : "omaa mittausta"}</span>
        </p>
        <p>
          <strong>{formatKg(last.kg)} kg</strong>
          <span>{formatDay(last.date)}</span>
        </p>
      </div>
      <figcaption>
        {hasTimeSpan
          ? "Pisteet ovat omia mittauksiasi. Viiva yhdistää mittauspäivät."
          : "Mittaukset näkyvät pisteinä. Käyrä syntyy, kun mittauksia on vähintään kahdelta päivältä."}{" "}
        Käyrä ei ole kasvuennuste tai terveysarvio.
      </figcaption>
      <details className="annual-chart-data">
        <summary>Näytä tarkat mittaukset</summary>
        <BookWeightTable weights={points} />
      </details>
    </figure>
  );
}
