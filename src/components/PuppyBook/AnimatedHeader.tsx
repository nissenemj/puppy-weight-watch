import React from "react";
import { PrivatePuppyImage } from "./PrivatePuppyImage";
import { BookOpen, Calendar, Clock, Settings } from "lucide-react";
import puppyBookIcon from "@/assets/puppy-book-icon.png";
import {
  differenceInWeeks,
  differenceInMonths,
  isValid,
  parseISO,
} from "date-fns";

interface AnimatedHeaderProps {
  title: string;
  subtitle?: string;
  showHeroVideo?: boolean;
  puppyName?: string;
  birthDate?: string;
  puppyImageUrl?: string;
  onEditProfile?: () => void;
  bannerColor?: string;
}

const calculateAge = (birthDate: string) => {
  const birth = parseISO(birthDate);
  const now = new Date();
  if (!isValid(birth) || birth > now) return null;
  return {
    birth,
    weeks: differenceInWeeks(now, birth),
    months: differenceInMonths(now, birth),
  };
};

const AnimatedHeader: React.FC<AnimatedHeaderProps> = ({
  title,
  subtitle = "Seuraa pennun kasvua ja tallenna ainutlaatuisia hetkiä",
  puppyName,
  birthDate,
  puppyImageUrl,
  onEditProfile,
  bannerColor = "orange",
}) => {
  const puppyAge = birthDate ? calculateAge(birthDate) : null;
  const accents: Record<string, string> = {
    orange: "#a94223",
    blue: "#28549d",
    green: "#245246",
    pink: "#914466",
    "light-pink": "#ab6b83",
    purple: "#6d4b8e",
    red: "#a53f35",
  };

  return (
    <section
      className="journal-profile"
      aria-label="Pennun profiili"
      style={{
        borderTop: `4px solid ${accents[bannerColor] || accents.orange}`,
      }}
    >
      <div className="journal-profile-main">
        <div className="journal-profile-image">
          {puppyImageUrl ? (
            <PrivatePuppyImage
              src={puppyImageUrl}
              fallbackSrc={puppyBookIcon}
              alt="Pennun profiilikuva tai pentukirjan kuvake"
              width={112}
              height={112}
            />
          ) : (
            <BookOpen size={36} aria-hidden="true" />
          )}
        </div>
        <div className="journal-profile-copy">
          <h1>{puppyName || title}</h1>
          <p>{subtitle}</p>
          {puppyAge && (
            <div className="journal-profile-meta">
              <span>
                <Calendar size={15} aria-hidden="true" /> Syntynyt{" "}
                {new Intl.DateTimeFormat("fi-FI").format(puppyAge.birth)}
              </span>
              <span>
                <Clock size={15} aria-hidden="true" />{" "}
                {puppyAge.months > 0
                  ? `${puppyAge.months} kk`
                  : `${puppyAge.weeks} viikkoa`}
              </span>
            </div>
          )}
        </div>
      </div>
      {onEditProfile && (
        <div className="journal-profile-footer">
          <p>Kuva ja perustiedot tekevät kirjasta oman.</p>
          <button
            type="button"
            onClick={onEditProfile}
            className="journal-text-link"
          >
            <Settings size={16} aria-hidden="true" /> Muokkaa pennun tietoja
          </button>
        </div>
      )}
    </section>
  );
};

export default AnimatedHeader;
