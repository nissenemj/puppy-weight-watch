# Pentulaskuri.com – erikoiselementtien workflow & step-by-step

Modernit, nopeat ja saavutettavat “wow, mutta kestävät” erikoiselementit Pentulaskuri.comiin Next.js + Tailwind + Framer Motion -pinolla.

---

## Kokonaisworkflow (milestonet)

1. **Suunnittelu (0.5 pv)** – sivupohjat, tekstien rungot, kuvat (kevyet WebP/AVIF), design-tokenit  
2. **Tekninen bootstrap (0.5 pv)** – Next.js-projekti, Tailwind, komponenttikansio, analytiikka  
3. **Erikoiselementit (1 pv)** – panoroiva hero, sticky-horisontaalinen “Miten laskuri toimii”, scroll-progress, count-up-tilastot  
4. **Sisältö + CMS (0.5–1 pv)** – Sanity/markdownit, esimerkkicaset, SEO  
5. **QA + julkaisu (0.5 pv)** – Lighthouse ≥ 95, a11y-check, Vercel deploy, domain

---

## Step-by-step

### 0) Päätä sisältörakenne

- **Etusivu (hero + arvolupaus):** ”Pentulaskuri, joka ennustaa painon & ruokamäärän rodun ja iän mukaan.”  
- **Laskuri (päätyökalu)**  
- **Ohjeet / blogi** (kasvukäyrät, ravinto-opas)  
- **Meistä + Yhteys**

---

### 1) Projektin alustus

```bash
npx create-next-app@latest pentulaskuri --ts --tailwind --eslint
cd pentulaskuri
npm i framer-motion @radix-ui/react-visually-hidden
```
**Kansiot**
```
app/
  layout.tsx
  page.tsx
  (laskuri)/page.tsx
components/
  ScrollProgressBar.tsx
  ScrollPanBackground.tsx
  StickyHorizontalGallery.tsx
  CountUp.tsx
  Section.tsx
public/media/  # kuvat ja posterit
```
Tailwind: lisää `container`-asetukset (maxWidth 1200–1280px) ja typografian perusasteikko.

---

### 2) Design-tokenit (Tailwind)

- **Värit:** neutraali vaalea + koirabrändin aksentti (esim. lämmin oranssi)  
- **Fontit:** Inter (body), Plus Jakarta Sans (otsikot)  
- **Spacing:** 8px-asteikko, `container mx-auto px-6` pohjaksi

---

### 3) Layout + scroll-progress

Lisää **scroll-progress-palkki** `app/layout.tsx`:iin, jotta se on joka sivulla.

```tsx
// app/layout.tsx (osa)
import ScrollProgressBar from '@/components/ScrollProgressBar'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fi">
      <body className="antialiased">
        <ScrollProgressBar />
        {children}
      </body>
    </html>
  )
}
```

Komponentin toteutus: ohut yläpalkki, joka täyttyy skrollissa Framer Motionin `useScroll`-koukulla.

---

### 4) Hero: skrollissa panoroiva tausta (pan + kevyt zoom)

- Käytä **ScrollPanBackground**-komponenttia.  
- Kuva: 2400–3000 px leveä, WebP/AVIF, 10–15 % ”bleed”, jotta pan ei paljasta reunoja.  
- Mobiilissa pienempi pan (`md:`-breakpoint).

```tsx
// app/page.tsx (etusivu)
import ScrollPanBackground from '@/components/ScrollPanBackground'
import Section from '@/components/Section'

export default function Home() {
  return (
    <>
      <ScrollPanBackground
        src="/media/hero-pentu.avif"
        alt="Iloinen pentu taustalla"
        panX={100}
        panY={50}
        zoom={1.1}
        minHeightClass="min-h-[90svh]"
      />
      <Section className="py-16">
        <h2 className="text-3xl md:text-5xl font-semibold">Laske pennun kasvu ja ruokamäärä</h2>
        <p className="mt-4 max-w-xl">Tieteeseen nojaava laskuri rodun ja iän mukaan.</p>
      </Section>
    </>
  )
}
```

**A11y:** tausta on dekoratiivinen → `alt=""`, varsinainen sisältö tekstinä päällä.

---

### 5) Sticky-horisontaalinen ”Miten laskuri toimii” -osio

Pystyscrolli **pysäyttää** sectionin ja sisällä vierii **horisontaalinen** raita, jossa 3–5 askelta.

```tsx
// app/page.tsx (jatkuu)
import StickyHorizontalGallery from '@/components/StickyHorizontalGallery'

const steps = [
  { id: '1', content: <Step title="1. Rotu & ikä" text="Valitse rotu tai sekarotu ja ikä viikoissa." /> },
  { id: '2', content: <Step title="2. Paino" text="Syötä ajantasainen paino ja aktiivisuustaso." /> },
  { id: '3', content: <Step title="3. Kasvukäyrä" text="Saat yksilöllisen kasvukäyrän ja vertailun." /> },
  { id: '4', content: <Step title="4. Ruokamäärä" text="Näet päivittäisen ruokasuosituksen ja jaon aterioihin." /> },
]

<StickyHorizontalGallery items={steps} />
```

**Fallback ilman JS:** näytä stepit pystylistana (`@supports not (animation-timeline: scroll())`).  
**Vältä raskaita videoita** tässä – käytä laiskalatausta (Mux/Vimeo + poster).

---

### 6) Count-up tilastoille

Sijoita luottamusblokin yhteyteen:
- ”**{CountUp 12000+}** laskentaa viime kuussa”  
- ”**{CountUp 86%}** käyttäjistä koki suositukset hyödyllisiksi”  
- ”**{CountUp 250+}** rotupohjaa”

```tsx
<Section className="py-20">
  <div className="grid gap-8 md:grid-cols-3 text-center">
    <div><p className="text-5xl font-semibold"><CountUp to={12000} suffix="+" /></p><p className="mt-2">laskentaa/kk</p></div>
    <div><p className="text-5xl font-semibold"><CountUp to={86} suffix="%" /></p><p className="mt-2">hyödyksi koettu</p></div>
    <div><p className="text-5xl font-semibold"><CountUp to={250} suffix="+" /></p><p className="mt-2">rotupohjaa</p></div>
  </div>
</Section>
```

CountUp käynnistyy vasta näkyvyydessä (IntersectionObserver, threshold ~0.4).

---

### 7) (Valinnainen) scroll-scrubattu video hero

- Lyhyt 6–10 s ”manifesto” (pennun kasvu + mittanauha → UI-välähdys).  
- `video` + `poster`, `preload="none"`.  
- Desktop:ssa skrolli ohjaa `currentTime`a; mobiilissa napista toisto (iOS-estot).  
- 500–800 kB web-optimoitu H.264/HEVC, ei automaattista ääntä.

---

### 8) Laskurin käyttöliittymä (skeema)

**Kentät:** rotu (select/autocomplete), ikä (vko), paino (kg), sukupuoli, aktiivisuus  
**Tulokset:** kasvukäyrä, ennustepaino, ruokamäärä (g/pv & ateriajako), varoitukset (liian nopea/hidas kasvu)  
**Tekniikka:** dynaaminen reitti `app/(laskuri)/page.tsx`, laskenta clientissä tai server actionissa.  
**Graafi:** Chart.js/Recharts, lazy-load vasta kun laskuri aukeaa.

---

### 9) CMS / sisältö

Alkuun **markdown** blogille → myöhemmin **Sanity**:  
- blokit: `panHero`, `stickyGallery`, `stats`  
- sisällön esikatselu: Next Preview Mode

Sivukartta: `/laskuri`, `/blogi`, `/meista`, `/yhteys`

---

### 10) Suorituskyky & saavutettavuus (pakollinen tarkistuslista)

- **Kuvat:** `next/image`, `sizes="100vw"`, hero 200–350 kB  
- **Transforms > layout:** käytä `transform` (GPU), `will-change: transform` vain tarvittaessa  
- **Reduced motion:** kunnioita `prefers-reduced-motion`; UI-kytkin ”Vähennä animaatioita”  
- **Kontrastit:** ≥ 4.5:1, fokusrenkaat näkyviin  
- **iOS:** vältä `background-attachment: fixed`; aseta kuva absolute-containeriin

---

### 11) Analytics, GDPR, mittarit

- **GA4 + Consent Mode v2** (evästekategoriat: välttämättömät, analytiikka, markkinointi)  
- **Eventit:** `calc_start`, `calc_submit`, `result_view`, `cta_click`, `share_click`  
- **Hotjar/FullStory** vain suostumuksella (laadullinen analyysi)  
- **KPI:t:** konversio (laskurin aloitus→tulos), LCP (<2.5 s mobiili), bounce

---

### 12) Testaus & laadunvarmistus

- **Playwright**-skenaariot:  
  - ”Reduced motion ON → ei transform-animaatioita”  
  - ”Sticky-horisontaalinen raita ei overflowaa 320px leveydellä”  
  - ”CountUp ei käynnisty ennen näkyvyyttä (threshold 0.4)”  
- **Lighthouse CI:** suorituskyky ≥ 95, a11y ≥ 95  
- **A/B varovasti:** hero staattinen kuva vs. video

---

### 13) Deploy

- **Vercel:** push → preview-URL  
- **Domain:** `pentulaskuri.com` → Vercel DNS (A/AAAA & CNAME), pakota HTTPS + HSTS  
- **Cache:** staattiset kuvat reippaalla TTL:llä; sisällölle `revalidate`

---

## Definition of Done

- Etusivun hero pan+zoom toimii, ei jankkaa mobiilissa, ei paljasta reunoja  
- Sticky-horisontaalinen osio toimii hiirellä, kosketuksella ja näppäimistöllä (fokusjärjestys)  
- Scroll-progress näkyy koko sivustolla, ei peitä header-fokusta  
- CountUp käynnistyy vasta näkyvyydessä, ei ”pompi” reflow’sta  
- Lighthouse (mobiili) ≥ 95 kaikissa kategorioissa  
- `prefers-reduced-motion: reduce` tuottaa staattisen, luettavan version

---

## Komponenttiviitteet

Toteuta tai tuo projektista seuraavat komponentit (viittaus esimerkkitoteutuksiin):
- `ScrollProgressBar.tsx` – ohut yläpalkki, joka täyttyy skrollissa
- `ScrollPanBackground.tsx` – panoroiva/zoom-tausta hero-osioon (Framer Motion `useScroll`)
- `StickyHorizontalGallery.tsx` – pinned section, jossa horisontaalinen raita skrollilla
- `CountUp.tsx` – numerot animoituvat näkyvyyden perusteella

> Vinkki: jos komponentit ovat valmiina toisessa repossa, kopioi ne `components/`-kansioon ja säädä vain propsit (panX/panY/zoom, items, to/suffix jne.).
