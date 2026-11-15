import { Link } from "react-router-dom";
import { differenceInCalendarDays, differenceInMonths, endOfDay, isValid, parseISO } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { WeightEntry } from "@/services/weightService";

interface GrowthDevelopmentSectionProps {
  weightData: WeightEntry[];
  birthDate?: string;
}

const kg = new Intl.NumberFormat("fi-FI", { maximumFractionDigits: 2 });
const date = new Intl.DateTimeFormat("fi-FI");

export default function GrowthDevelopmentSection({ weightData, birthDate }: GrowthDevelopmentSectionProps) {
  const today = new Date();
  const birth = birthDate ? parseISO(birthDate) : null;
  const ageDays = birth && isValid(birth) ? differenceInCalendarDays(today, birth) : -1;
  const weeks = Math.floor(ageDays / 7);
  const latestAllowed = endOfDay(today);
  const latest = weightData
    .filter((entry) => {
      const measured = parseISO(entry.date);
      return Number.isFinite(entry.weight) && entry.weight > 0 && isValid(measured) &&
        measured <= latestAllowed && (ageDays < 0 || !birth || measured >= birth);
    })
    .sort((a, b) => b.date.localeCompare(a.date) || (b.created_at ?? "").localeCompare(a.created_at ?? ""))[0];
  const isAdult = ageDays >= 0 && birth !== null && differenceInMonths(today, birth) >= 24;

  return (
    <Card className="bg-white/80 rounded-2xl">
      <CardHeader>
        <CardTitle>{isAdult ? "Aikuisen koiran paino" : "Pennun kasvun seuranta"}</CardTitle>
        <CardDescription>
          {ageDays >= 0
            ? `Ikä: ${weeks} ${weeks === 1 ? "viikko" : "viikkoa"} (${ageDays} ${ageDays === 1 ? "päivä" : "päivää"})`
            : birthDate
              ? "Tarkista syntymäpäivä Paino-välilehdellä."
              : "Lisää syntymäpäivä Paino-välilehdellä, jos haluat nähdä pennun iän."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {latest ? (
          <p>
            <strong className="text-2xl">{kg.format(latest.weight)} kg</strong>
            <br />
            Viimeisin mitattu paino ({date.format(parseISO(latest.date))})
          </p>
        ) : <p>Lisää painomittaus Paino-välilehdellä.</p>}
        <p>Painokäyrä muodostuu omista punnituksista. Aikuispainoarvio on tauolla, kunnes laskentatapa on varmennettu.</p>
        {isAdult ? (
          <Button asChild className="min-h-11 h-auto whitespace-normal text-center">
            <Link to="/weight-tracker?vaihe=aikuinen">Avaa aikuisen koiran painonseuranta</Link>
          </Button>
        ) : (
          <p>
            Jos haluat verrata pennun painoa viitekäyrään, katso käyrien soveltuvuus ja ohjeet.{" "}
            <a className="journal-text-link" href="https://www.waltham.com/resources/puppy-growth-charts">
              Walthamin kasvukäyrät
            </a>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
