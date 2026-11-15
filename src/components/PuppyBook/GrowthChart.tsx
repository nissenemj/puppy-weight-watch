import { BookGrowthChart } from "@/features/annual-book/BookGrowthChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function GrowthChart({
  weightPoints,
}: {
  weightPoints: { weight_kg: number; date: string }[];
}) {
  return (
    <Card className="weight-history-chart">
      <CardHeader><CardTitle>Omat painomittaukset</CardTitle></CardHeader>
      <CardContent>
        <BookGrowthChart weights={weightPoints.map(({ date, weight_kg }) => ({
          date: date.slice(0, 10),
          kg: weight_kg,
        }))} />
      </CardContent>
    </Card>
  );
}
