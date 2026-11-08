import { useLocation, useRouteError } from "react-router-dom";
import { PageLayout } from "@/components/PageLayout";
import { isModuleLoadError } from "@/utils/moduleLoadError";

export default function RouteErrorPage() {
  const error: unknown = useRouteError();
  const location = useLocation();
  const moduleError = isModuleLoadError(error);
  return (
    <PageLayout>
      <section
        className="mx-auto max-w-xl space-y-5 py-12"
        aria-labelledby="route-error-heading"
      >
        <h1 id="route-error-heading" className="font-serif text-3xl">
          {moduleError
            ? "Sivun lataaminen keskeytyi"
            : "Sivua ei voitu näyttää"}
        </h1>
        <p className="leading-relaxed text-stone-700">
          {moduleError
            ? "Sivustosta on voitu julkaista uusi versio tai yhteys katkesi. Lataa sivu uudelleen, kun olet tallentanut mahdolliset keskeneräiset muutokset."
            : "Yritä ladata sivu uudelleen. Jos virhe jatkuu, voit palata tietopankkiin."}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            className="inline-flex min-h-12 items-center justify-center rounded-md bg-primary px-5 py-3 text-primary-foreground"
            href={`${location.pathname}${location.search}${location.hash}`}
          >
            Lataa sivu uudelleen
          </a>
          <a
            className="inline-flex min-h-12 items-center justify-center rounded-md border px-5 py-3"
            href="/guides"
          >
            Avaa tietopankki
          </a>
        </div>
      </section>
    </PageLayout>
  );
}
