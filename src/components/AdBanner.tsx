import { RETAILERS } from "@/data/retailers";

interface AdBannerProps {
  variant: "rectangle" | "skyscraper";
  className?: string;
}

export default function AdBanner({ variant, className = "" }: AdBannerProps) {
  const store = RETAILERS.muotitassu;
  return (
    <div
      data-ad-banner
      role="group"
      aria-label="Kauppalinkki"
      className={`${variant === "skyscraper" ? "hidden lg:flex" : "flex"} flex-col items-center justify-center rounded-xl bg-stone-50 p-4 ${className}`}
    >
      <span className="mb-2 text-sm text-stone-600">Kauppalinkki</span>
      <a
        href={store.href}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex max-w-full flex-col items-center justify-center gap-3 rounded-md border border-stone-200 p-4 text-center text-sm text-stone-800 ${variant === "skyscraper" ? "min-h-44 w-36" : "min-h-32 w-72"}`}
      >
        <strong>{store.name}</strong>
        <span className="underline underline-offset-4">
          Tutustu koiratarvikkeisiin
        </span>
        <span className="text-xs">Avautuu uuteen välilehteen</span>
      </a>
    </div>
  );
}
