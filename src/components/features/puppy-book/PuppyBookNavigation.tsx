import React from "react";

import { Calendar, Award, Target, Heart, List, BookOpen } from "lucide-react";

interface PuppyBookNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const PuppyBookNavigation: React.FC<PuppyBookNavigationProps> = ({
  activeSection,
  onSectionChange,
}) => {
  const sections = [
    { id: "memories", label: "Muistot", icon: Heart },
    { id: "monthly", label: "Kuukaudet", icon: Calendar },
    { id: "timeline", label: "Aikajana", icon: List },
    { id: "milestones", label: "Virstanpylväät", icon: Award },
    { id: "growth", label: "Kasvu", icon: Target },
    { id: "annual", label: "Oma kirja", icon: BookOpen },
  ];

  return (
    <nav className="journal-book-nav" aria-label="Pentukirjan osiot">
      {sections.map((section) => (
        <button
          type="button"
          key={section.id}
          onClick={() => onSectionChange(section.id)}
          aria-pressed={activeSection === section.id}
          aria-controls="puppy-book-content"
        >
          <section.icon aria-hidden="true" />
          <span>{section.label}</span>
        </button>
      ))}
    </nav>
  );
};
