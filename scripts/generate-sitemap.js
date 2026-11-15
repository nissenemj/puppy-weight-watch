import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseHTML } from "linkedom";

const root = fileURLToPath(new URL("../", import.meta.url));
const { origin, pages } = JSON.parse(
  fs.readFileSync(path.join(root, "src/data/sitePages.json"), "utf8"),
);

if (process.argv.includes("--html")) {
  const dist = path.join(root, "dist");
  const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");

  function writePage(file, { heading, description }, url, links = []) {
    const { document } = parseHTML(template);
    const title = heading === "Pentulaskuri" ? heading : `${heading} | Pentulaskuri`;
    document.title = title;
    const meta = (selector, value) =>
      document.head.querySelector(selector)?.setAttribute("content", value);

    for (const selector of ['[property="og:title"]', '[name="twitter:title"]']) {
      meta(selector, title);
    }
    for (const selector of ['[name="description"]', '[property="og:description"]', '[name="twitter:description"]']) {
      meta(selector, description);
    }
    const canonical = document.head.querySelector('[rel="canonical"]');
    if (url) {
      canonical.setAttribute("href", url);
      meta('[property="og:url"]', url);
      meta('[name="robots"]', "index, follow, max-image-preview:large");
    } else {
      canonical.remove();
      document.head.querySelector('[property="og:url"]')?.remove();
      meta('[name="robots"]', "noindex, nofollow");
    }

    const intro = document.createElement("main");
    const h1 = document.createElement("h1");
    h1.textContent = heading;
    const paragraph = document.createElement("p");
    paragraph.textContent = description;
    intro.append(h1, paragraph);
    for (const route of links) {
      const link = document.createElement("a");
      link.setAttribute("href", route);
      link.textContent = pages[route].heading;
      const row = document.createElement("p");
      row.append(link);
      intro.append(row);
    }
    document.getElementById("root").append(intro);

    const output = path.join(dist, file);
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.writeFileSync(output, document.toString());
  }

  const mainLinks = ["/calculator", "/weight-tracker", "/guides", "/puppy-book-landing"];
  const guideLinks = Object.keys(pages).filter((route) => route.startsWith("/guides/"));
  for (const [route, page] of Object.entries(pages)) {
    const links = route === "/guides" || route === "/info" ? guideLinks : mainLinks;
    writePage(route === "/" ? "index.html" : `.${route}.html`, page, origin + route,
      links.filter((link) => link !== route));
  }
  writePage("_app.html", {
    heading: "Pentulaskuri",
    description: "Ota JavaScript käyttöön käyttääksesi tätä Pentulaskurin sivua.",
  });
  writePage("404.html", {
    heading: "Sivua ei löytynyt",
    description: "Palaa etusivulle ja valitse etsimäsi työkalu tai opas.",
  }, undefined, ["/"]);
  console.log(`Generated ${Object.keys(pages).length} public HTML pages`);
} else {
  const urls = Object.keys(pages).map((route) => `  <url><loc>${origin}${route}</loc></url>`);
  const xml = ['<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls, '</urlset>', ''].join("\n");
  fs.writeFileSync(path.join(root, "public/sitemap.xml"), xml);
  console.log(`Generated sitemap with ${urls.length} canonical URLs`);
}
