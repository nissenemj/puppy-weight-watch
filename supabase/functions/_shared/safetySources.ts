export const SAFETY_SOURCES = [
  {
    id: "ruokavirasto-rehut",
    name: "Ruokavirasto: rehut",
    url: "https://www.ruokavirasto.fi/elaimet/rehut/",
    format: "html",
    intervalMinutes: 30,
  },
  {
    id: "ruokavirasto-elaimet",
    name: "Ruokavirasto: eläinten terveys",
    url: "https://www.ruokavirasto.fi/elaimet/",
    format: "html",
    intervalMinutes: 30,
  },
] as const;

export const SAFETY_GUIDES = [
  {
    name: "Lemmikkieläinten ruoan turvallisuus",
    url: "https://www.ruokavirasto.fi/elaimet/rehut/tietoa-rehuista/lemmikkielainten-ruoka/",
  },
  {
    name: "Ruokaviraston eläintiedotteet",
    url: "https://www.ruokavirasto.fi/elaimet/",
  },
] as const;

export type SafetySource = (typeof SAFETY_SOURCES)[number];
export type SafetyKind = "recall" | "warning" | "disease" | "notice";
export interface SafetyItem {
  id: string;
  source_id: string;
  title: string;
  url: string;
  published_at: string | null;
  kind: SafetyKind;
  region: string | null;
  first_seen_at?: string;
  last_seen_at?: string;
}
export interface SourceCheck {
  source_id: string;
  last_attempt_at: string | null;
  last_success_at: string | null;
  status: "never" | "ok" | "error";
  error_code: string | null;
  etag?: string | null;
  last_modified?: string | null;
  item_count?: number;
}
export interface SafetySnapshot {
  items: SafetyItem[];
  checks: SourceCheck[];
}
