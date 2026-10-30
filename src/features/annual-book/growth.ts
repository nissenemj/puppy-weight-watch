import { day, type AnnualBook } from "./model";

export const CHART = {
  width: 480,
  height: 272,
  left: 56,
  right: 20,
  top: 20,
  bottom: 54,
};
const kgFormat = new Intl.NumberFormat("fi-FI", {
  maximumSignificantDigits: 4,
});
export const formatKg = (kg: number) => kgFormat.format(kg);

/** Dates are positioned by elapsed UTC days, never by measurement index. */
export function growthSeries(
  weights: AnnualBook["weights"],
  width = CHART.width,
) {
  const measured = weights
    .filter(
      (weight) =>
        day.safeParse(weight.date).success &&
        Number.isFinite(weight.kg) &&
        weight.kg > 0 &&
        weight.kg <= 200,
    )
    .map((weight) => ({
      ...weight,
      time: Date.parse(`${weight.date}T12:00:00Z`),
    }))
    .sort((a, b) => a.time - b.time);
  if (!measured.length) return null;
  const first = measured[0];
  const last = measured[measured.length - 1];
  const maxWeight = Math.max(0.000001, ...measured.map((weight) => weight.kg));
  const roughStep = maxWeight / 4;
  const magnitude = 10 ** Math.floor(Math.log10(roughStep));
  const step =
    ([1, 2, 2.5, 5, 10].find((n) => n * magnitude >= roughStep) ?? 10) *
    magnitude;
  const top = Math.ceil(maxWeight / step) * step;
  const plotWidth = Math.max(180, width) - CHART.left - CHART.right;
  const plotHeight = CHART.height - CHART.top - CHART.bottom;
  const points = measured.map((weight) => ({
    ...weight,
    x:
      CHART.left +
      (first.time === last.time
        ? plotWidth / 2
        : ((weight.time - first.time) / (last.time - first.time)) * plotWidth),
    y: CHART.top + (1 - weight.kg / top) * plotHeight,
  }));
  const ticks = Array.from({ length: Math.round(top / step) + 1 }, (_, n) => ({
    kg: n * step,
    y: CHART.top + (1 - (n * step) / top) * plotHeight,
  }));
  const middle = points.reduce((closest, point) =>
    Math.abs(point.time - (first.time + last.time) / 2) <
    Math.abs(closest.time - (first.time + last.time) / 2)
      ? point
      : closest,
  );
  const dates = [
    points[0],
    ...(middle.x - points[0].x > 95 &&
    points[points.length - 1].x - middle.x > 95
      ? [middle]
      : []),
    ...(first.time !== last.time ? [points[points.length - 1]] : []),
  ];
  return {
    points,
    ticks,
    dates,
    first,
    last,
    hasTimeSpan: first.time !== last.time,
  };
}
