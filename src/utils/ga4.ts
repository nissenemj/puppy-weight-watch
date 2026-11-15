import site from "@/data/sitePages.json";

type AnalyticsChoice = "allowed" | "declined";
type Stage = "puppy" | "adult";
type GoogleTag = (...command: unknown[]) => void;
declare global {
  interface Window {
    gtag?: GoogleTag;
    dataLayer?: unknown[];
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}

const preferenceKey = "pentulaskuri-analytics-choice-v1";
const preferenceEvent = "pentulaskuri-analytics-change";
const measurementId = "G-0JW9PEKLDZ";
let sessionChoice: AnalyticsChoice | null = null;
let loadedTag: string | undefined;
let lastPage: string | undefined;

export function getAnalyticsChoice(): AnalyticsChoice | null {
  if (sessionChoice) return sessionChoice;
  try {
    const stored = window.localStorage.getItem(preferenceKey);
    if (stored === "allowed" || stored === "declined") return stored;
  } catch {
    // Keep the choice in memory if this browser blocks local storage.
  }
  return null;
}

function tagId() {
  if (window.location.origin === site.origin) return measurementId;
  const preview = import.meta.env.VITE_GA4_PREVIEW_ID;
  return typeof preview === "string" && /^G-[A-Z0-9]+$/.test(preview) && preview !== measurementId
    ? preview
    : undefined;
}

export function setAnalyticsChoice(choice: AnalyticsChoice) {
  sessionChoice = choice;
  try {
    window.localStorage.setItem(preferenceKey, choice);
  } catch {
    // The choice still applies to this page.
  }
  if (choice === "declined" && loadedTag) {
    window[`ga-disable-${loadedTag}`] = true;
  }
  window.dispatchEvent(new Event(preferenceEvent));
}

export function subscribeToAnalyticsChoice(notify: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === preferenceKey || event.key === null) {
      sessionChoice = null;
      if (loadedTag && getAnalyticsChoice() !== "allowed") {
        window[`ga-disable-${loadedTag}`] = true;
      }
      notify();
    }
  };
  window.addEventListener(preferenceEvent, notify);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(preferenceEvent, notify);
    window.removeEventListener("storage", onStorage);
  };
}

function publicPage(path: string) {
  const route = path.replace(/\/+$/, "") || "/";
  return Object.prototype.hasOwnProperty.call(site.pages, route) ? site.origin + route : undefined;
}

function sendEvent(
  name: "page_view" | "feeding_calculation_complete" | "first_weight_saved",
  page: string,
  parameters: Record<string, string> = {},
) {
  const id = tagId();
  if (!id || getAnalyticsChoice() !== "allowed") return;

  window[`ga-disable-${id}`] = false;
  const queue = (window.dataLayer ??= []);
  window.gtag ??= function () {
    // eslint-disable-next-line prefer-rest-params -- The Google tag queue expects an Arguments object.
    queue.push(arguments);
  };
  const send = window.gtag;

  if (!loadedTag) {
    loadedTag = id;
    send("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    send("consent", "update", { analytics_storage: "granted" });
    send("js", new Date());
    send("config", id, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      page_location: page,
      page_referrer: "",
    });
    const script = document.createElement("script");
    script.async = true;
    script.referrerPolicy = "no-referrer";
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
    document.head.append(script);
  }

  send("event", name, { ...parameters, send_to: id, page_location: page, page_referrer: "" });
}

export function syncGa4Page(path: string) {
  const page = publicPage(path);
  if (!page || getAnalyticsChoice() !== "allowed") {
    if (loadedTag) window[`ga-disable-${loadedTag}`] = true;
    lastPage = undefined;
    return;
  }
  if (lastPage === page) return;
  lastPage = page;
  sendEvent("page_view", page);
}

export function trackGa4FoodResult(stage: Stage, method: "table" | "energy") {
  const path = window.location.pathname;
  if (!["/calculator", "/weight-tracker"].includes(path)) return;
  sendEvent("feeding_calculation_complete", site.origin + path, {
    life_stage: stage,
    calculation_method: method,
  });
}

export function trackGa4FirstWeight(stage: Stage, storage: "browser" | "account") {
  if (window.location.pathname !== "/weight-tracker") return;
  sendEvent("first_weight_saved", site.origin + "/weight-tracker", {
    life_stage: stage,
    storage_type: storage,
  });
}
