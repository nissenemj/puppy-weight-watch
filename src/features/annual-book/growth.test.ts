import { describe, expect, it } from "vitest";
import { CHART, growthSeries } from "./growth";

describe("measured growth chart", () => {
  it("positions observations by elapsed days with a zero-based kg axis", () => {
    const source = [
      { date: "2026-09-03", kg: 10.8 },
      { date: "2026-06-03", kg: 4.2 },
      { date: "2026-07-03", kg: 6.5 },
    ];
    const series = growthSeries(source)!;
    const [first, middle, last] = series.points;
    expect((middle.x - first.x) / (last.x - first.x)).toBeCloseTo(30 / 92);
    expect(first.x).toBe(CHART.left);
    expect(last.x).toBe(CHART.width - CHART.right);
    expect(series.ticks[0].kg).toBe(0);
    expect(series.ticks.at(-1)!.kg).toBeGreaterThanOrEqual(10.8);
    expect(source[0].date).toBe("2026-09-03");
  });
  it("does not imply a trajectory from one observation or same-day measurements", () => {
    const weights = [{ date: "2026-06-03", kg: 4.2 }];
    expect(growthSeries(weights)!.hasTimeSpan).toBe(false);
    const sameDay = growthSeries([...weights, { ...weights[0], kg: 4.3 }])!;
    expect(sameDay.hasTimeSpan).toBe(false);
    expect(sameDay.points).toHaveLength(2);
    expect(sameDay.points[0].x).toBe(sameDay.points[1].x);
    expect(sameDay.dates).toHaveLength(1);
  });
  it.each([0.0005, 0.05, 1, 55, 200])(
    "keeps finite coordinates for a measured weight of %s kg",
    (kg) => {
      const series = growthSeries([{ date: "2026-06-03", kg }])!;
      expect(Number.isFinite(series.points[0].y)).toBe(true);
      expect(series.points[0].y).toBeGreaterThanOrEqual(CHART.top - 0.001);
      expect(series.points[0].y).toBeLessThan(CHART.height - CHART.bottom);
      expect(series.ticks.length).toBeLessThanOrEqual(6);
    },
  );
  it("omits invalid data without inventing observations", () => {
    expect(growthSeries([])).toBeNull();
    expect(
      growthSeries([
        { date: "2026-02-30", kg: 4 },
        { date: "2026-06-03", kg: NaN },
        { date: "2026-06-03", kg: -1 },
      ]),
    ).toBeNull();
  });
});
