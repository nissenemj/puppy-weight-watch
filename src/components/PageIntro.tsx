import type { ReactNode } from "react";
import shore from "@/assets/puppy-journal-shore.webp";

interface PageIntroProps {
  title: string;
  description: string;
  children?: ReactNode;
}

export function PageIntro({ title, description, children }: PageIntroProps) {
  return (
    <header className="site-page-intro">
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
        {children}
      </div>
      <img src={shore} width={1400} height={467} alt="" decoding="async" />
    </header>
  );
}
