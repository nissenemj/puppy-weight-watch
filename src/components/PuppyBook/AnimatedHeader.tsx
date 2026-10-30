import React from "react";
import { PrivatePuppyImage } from "./PrivatePuppyImage";
import { Calendar, Clock, Settings } from "lucide-react";
import journalIllustration from "@/assets/puppy-journal-illustration.webp";
import shoreIllustration from "@/assets/puppy-journal-shore.webp";
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
      className={`journal-profile ${puppyImageUrl ? "journal-profile-photo" : "journal-profile-illustrated"}`}
      aria-label="Pennun profiili"
      style={{
        borderBottomColor: accents[bannerColor] || accents.orange,
      }}
    >
      <img
        className="journal-profile-shore"
        src={shoreIllustration}
        width={1400}
        height={467}
        alt=""
        decoding="async"
      />
      <div className="journal-profile-main">
        <div className="journal-profile-image">
          {puppyImageUrl ? (
            <PrivatePuppyImage
              src={puppyImageUrl}
              fallbackSrc={journalIllustration}
              alt="Pennun profiilikuva tai piirretty pentu kirjan äärellä"
              width={200}
              height={160}
            />
          ) : (
            <img
              src={journalIllustration}
              width={200}
              height={160}
              alt=""
              decoding="async"
            />
          )}
        </div>
        <div className="journal-profile-copy">
          <h1>{puppyName || title}</h1>
          <p>{subtitle}</p>
          <div className="journal-profile-meta">
            {puppyAge && (
              <>
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
              </>
            )}
            {onEditProfile && (
              <button
                type="button"
                onClick={onEditProfile}
                className="journal-text-link"
              >
                <Settings size={15} aria-hidden="true" /> Muokkaa pennun tietoja
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnimatedHeader;
