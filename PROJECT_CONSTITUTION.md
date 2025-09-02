# Project Constitution for Pentulaskuri.com - Koiran Kasvun & Ruokinnan Seuranta

## 1. Projektin yleiskatsaus

**Tehtävä ja tarkoitus:**
Pentulaskuri.com on koiranpentujen kasvun ja ruokinnan seurantaan tarkoitettu verkkopalvelu, joka tarjoaa ammattimaiset työkalut koiranomistajille. Palvelu yhdistää painonseurannan, ruokalaskurin, pentukirjan ja sosiaalisen jakamisen yhdeksi kokonaisvaltaiseksi ratkaisuksi.

**Keskeiset liiketoimintalogiikan kontekstit:**
- Kohderyhmä: Huolestuneet ensiomistajat (25-45v), ammattimaiset kasvattajat (35-65v), teknologiamyönteiset harrastajat (20-50v)
- Kilpailuetu: Ainutlaatuinen pentukirjaominaisuus sosiaalisella jakamisella
- Liiketoimintamalli: Freemium-malli premium-ominaisuuksilla
- Markkinapositio: Markkinajohtaja pentukoiran kasvatustyökalujen segmentissä

**Arkkitehtuurin pääperiaatteet:**
- Mobile-first suunnittelu
- Offline-first arkkitehtuuri kriittisille toiminnoille
- Saavutettavuus (WCAG 2.1 AA -taso)
- Modulaarinen komponenttirakenne
- Clean Architecture + BLoC pattern skaalautuvuudelle

## 2. Teknologia-stack

**Framework:** React 18.2+ + TypeScript 5.0+
**Build Tool:** Vite 5.4+
**Styling:** Tailwind CSS 3.4+ + shadcn/ui komponentit
**State Management:** Zustand + React Query (TanStack Query)
**Database:** Supabase (PostgreSQL) + SQLite (offline)
**Authentication:** Supabase Auth
**Deployment:** IONOS hosting + GitHub Actions
**Mobile:** Capacitor 6.0+ (iOS/Android)
**Testing:** Vitest + React Testing Library + Playwright
**Linting:** ESLint + Prettier + TypeScript strict mode

## 3. Arkkitehtuuri ja projektirakenne

```
puppy-weight-watch/
├── public/                     # Staattiset tiedostot
├── src/
│   ├── components/            # Uudelleenkäytettävät komponentit
│   │   ├── ui/               # shadcn/ui peruskomponentit
│   │   ├── PuppyBook/        # Pentukirjakomponentit
│   │   ├── WeightTracking/   # Painonseurantakomponentit
│   │   └── FoodCalculator/   # Ruokalaskurikomponentit
│   ├── pages/                # Sivukomponentit
│   ├── hooks/                # Custom React hooks
│   ├── services/             # API-palvelut ja integraatiot
│   ├── utils/                # Apufunktiot
│   ├── types/                # TypeScript-tyypit
│   ├── contexts/             # React Context providers
│   ├── styles/               # CSS-tiedostot
│   └── assets/               # Kuvat ja muut resurssit
├── docs/                     # Dokumentaatio
└── tests/                    # Testit
```

## 4. Keskeiset kehityskomennot

**Asenna:** `npm install --legacy-peer-deps`
**Käynnistä dev:** `npm run dev`
**Rakenna:** `npm run build`
**Testaa:** `npm run test`
**E2E-testit:** `npm run test:e2e`
**Lint/Format:** `npm run lint && npm run format`
**Type-check:** `npm run type-check`
**Saavutettavuustesti:** `npm run a11y-test`

## 5. 🚨 KRIITTINEN KOODAUSTYÖNKULKU 🚨

**PAKOLLINEN JÄRJESTYS:**
1. **Toteuta muutos** - Kirjoita koodi TypeScript strict modessa
2. **Formatoi ENSIN:** `npm run format`
3. **Tarkista TOISENA:** `npm run lint && npm run type-check`
4. **Testaa KOLMANTENA:** `npm run test`
5. **Saavutettavuus NELJÄNTENA:** `npm run a11y-test`
6. **Commitoi vasta kun kaikki vihreää**

**TÄRKEÄ:** Älä koskaan ohita tätä järjestystä. Jokainen vaihe on kriittinen laadun varmistamiseksi.

## 6. Koodin standardit ja tyyli

**Nimeämiskäytännöt:**
- Komponentit: PascalCase (esim. `PuppyWeightTracker`)
- Funktiot ja muuttujat: camelCase (esim. `calculateFoodAmount`)
- Tiedostot: kebab-case (esim. `puppy-weight-tracker.tsx`)
- CSS-luokat: Tailwind utility classes + BEM-metodologia custom CSS:lle
- Tietokantakentät: snake_case (esim. `puppy_weight`)

**Arkkitehtuurimallit:**
- Komponentit: Functional components + hooks
- State management: Zustand stores + React Query mutations
- Error handling: Error boundaries + try-catch wrapping
- API calls: Custom hooks + React Query
- Form handling: React Hook Form + Zod validation

**Dokumentaatiovaatimukset:**
- JSDoc-kommentit kaikille public funktioille
- README.md jokaiselle feature-kansialle
- Storybook stories UI-komponenteille
- API-dokumentaatio OpenAPI/Swagger-muodossa

**Esimerkkikoodimallit:**

```tsx
// Komponentti
interface PuppyWeightTrackerProps {
  puppyId: string;
  onWeightAdded?: (weight: number) => void;
}

export const PuppyWeightTracker: React.FC<PuppyWeightTrackerProps> = ({
  puppyId,
  onWeightAdded
}) => {
  // Implementaatio
};

// Custom hook
export const usePuppyWeight = (puppyId: string) => {
  return useQuery({
    queryKey: ['puppy-weight', puppyId],
    queryFn: () => fetchPuppyWeight(puppyId),
    staleTime: 5 * 60 * 1000, // 5 minuuttia
  });
};

// Zustand store
interface PuppyStore {
  selectedPuppy: Puppy | null;
  setSelectedPuppy: (puppy: Puppy) => void;
}

export const usePuppyStore = create<PuppyStore>((set) => ({
  selectedPuppy: null,
  setSelectedPuppy: (puppy) => set({ selectedPuppy: puppy }),
}));
```

## 7. 🛑 ÄLÄ KOSKE 🛑

**SUOJATUT TIEDOSTOT/ALUEET:**
- `vite.config.ts` - Build-konfiguraatio
- `tailwind.config.ts` - Tailwind-asetukset
- `capacitor.config.ts` - Mobiiliasetukset
- `supabase/migrations/` - Tietokannan migraatiot
- `.github/workflows/` - CI/CD-putket
- `src/lib/auth.ts` - Autentikointilogiikka
- `src/services/api.ts` - API-konfiguraatio
- Kaikki `.env` tiedostot

**KRIITTINEN:** Kysy aina ennen näiden tiedostojen muokkaamista!

## 8. Saavutettavuusvaatimukset (WCAG 2.1 AA)

**PAKOLLINEN jokaiselle komponentille:**
- Semanttiset HTML-elementit (`<main>`, `<nav>`, `<header>`, `<footer>`)
- Alt-tekstit kaikille informatiivisille kuville
- ARIA-merkinnät interaktiivisille elementeille
- Fokusindikaattorit näkyvissä
- Värikontrastit vähintään 4.5:1
- Näppäimistönavigaatio toimii täysin

**Testaa aina:**
```bash
npm run a11y-test  # Automaattinen testaus
# + manuaalinen testaus Tab-näppäimellä
```

## 9. Mobiilioptimointivaatimukset

**KRIITTINEN:** Ei horisontaalista skrollausta koskaan!
- Käytä `overflow-x: hidden` tarvittaessa
- Testaa kaikki breakpointit: 320px, 768px, 1024px, 1440px
- Touch-target minimikoko: 44px x 44px
- Viewport meta tag: `width=device-width, initial-scale=1.0`

**Testaa aina mobiilissa:**
```bash
npm run dev
# Avaa Chrome DevTools > Toggle device toolbar
# Testaa iPhone SE, iPad, Desktop
```

## 10. Pentukirjan erityisvaatimukset

**Sosiaalinen jakaminen:**
- Automaattinen kuvageneraatio some-postauksia varten
- Metadata Open Graph ja Twitter Card -tagit
- Yksityisyysasetukset (julkinen/yksityinen)

**Muistot ja timeline:**
- Kronologinen järjestys (uusin ensin)
- Kuvien lazy loading
- Infinite scroll pitkille listoille
- Offline-tuki kriittisille toiminnoille

## 11. Ruokalaskurin liiketoimintalogiikka

**Todellisten muuntotaulukoiden käyttö:**
- 200+ ruokamerkin tietokanta
- Ikä-, paino-, rotu- ja aktiivisuustason huomiointi
- Automaattiset suositukset kasvukäyrän perusteella
- Allergioiden ja erityistarpeiden huomiointi

**Laskentakaavat:**
```typescript
// Esimerkki ruokamäärän laskennasta
const calculateFoodAmount = (
  weight: number,
  age: number,
  activityLevel: ActivityLevel,
  breed: BreedSize
): FoodRecommendation => {
  // Implementaatio perustuu todellisiin eläinlääketieteellisiin suosituksiin
};
```

## 12. Tietoturva ja yksityisyys

**GDPR-yhteensopivuus:**
- Käyttäjän suostumus datan käsittelyyn
- Oikeus tietojen poistamiseen
- Tietojen siirrettävyys
- Läpinäkyvä tietosuojaseloste

**Tietoturva:**
- Supabase RLS (Row Level Security) käytössä
- API-avainten turvallinen hallinta
- HTTPS pakollinen tuotannossa
- Säännölliset tietoturva-auditoinnit

## 13. Suorituskykyvaatimukset

**Core Web Vitals -tavoitteet:**
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1
- Lighthouse Performance Score: > 90

**Optimointitekniikat:**
- Lazy loading kuville ja komponenteille
- Code splitting reittikohtaisesti
- Service Worker offline-toiminnallisuudelle
- CDN staattisille resursseille

## 14. Testausstrategia

**Testipyramidi:**
- Unit testit: 70% (komponentit, utils, hooks)
- Integration testit: 20% (API-integraatiot, user flows)
- E2E testit: 10% (kriittiset käyttäjäpolut)

**Testikattavuustavoitteet:**
- Kokonaisuus: > 80%
- Kriittiset komponentit: > 95%
- Utils ja hooks: > 90%

## 15. Deployment ja CI/CD

**GitHub Actions workflow:**
1. Lint ja type-check
2. Unit ja integration testit
3. Build tuotantoversiota
4. Saavutettavuustestit
5. Deploy IONOS:iin
6. Smoke testit tuotannossa

**Ympäristöt:**
- Development: `localhost:8080`
- Staging: `staging.pentulaskuri.com`
- Production: `pentulaskuri.com`

## 16. Analytiikka ja seuranta

**Käyttäjäanalytiikka:**
- Google Analytics 4
- Hotjar käyttäjäsessioiden tallentamiseen
- Supabase Analytics tietokantakuormitukselle

**Virheenseuranta:**
- Sentry virheraportoinnille
- Console.error loggaus kehityksessä
- User feedback -lomake virhetilanteissa

## 17. 🎯 PROJEKTIN ERITYISPIIRTEET

**Koira-teema läpi sovelluksen:**
- Emojit: 🐕 🦴 🎾 ❤️ 📊 🍖 📚
- Väripaletti: Lämmin oranssi (#FF6B35), kultainen keltainen (#FFD23F), kasvun vihreä (#4CAF50)
- Animaatiot: Leikkisät mutta ammattimaiset
- Äänimaailma: Koira-äänet käyttöliittymässä (valinnainen)

**Emotionaalinen side:**
- Pentukirja luo vahvan tunnesidoksen
- Kasvun seuranta antaa onnistumisen kokemuksia
- Yhteisöllisyys jakamisen kautta
- Asiantuntijuus luotettavuuden kautta

## 18. SINUN TULEE aina:

1. **Tarkistaa saavutettavuus** jokaisessa komponentissa
2. **Testata mobiilissa** ennen kuin merkitset valmiksi
3. **Käyttää TypeScript strict modea** - ei any-tyyppejä
4. **Kirjoittaa testit** uusille ominaisuuksille
5. **Dokumentoida API-muutokset** OpenAPI-skeemaan
6. **Kysyä ennen arkkitehtuurimuutoksia**
7. **Seurata Core Web Vitals -metriikoita**
8. **Huomioida offline-toiminnallisuus** kriittisissä ominaisuuksissa

## 19. 🚨 TÄRKEIMMÄT LIIKETOIMINTASÄÄNNÖT

**Käyttäjädatan käsittely:**
- Kaikki henkilökohtainen data salataan
- Pennun tiedot ovat käyttäjän omaisuutta
- Jakaminen tapahtuu vain käyttäjän suostumuksella
- Tietojen vienti mahdollista aina

**Ruokasuositukset:**
- Perustuvat aina tieteellisiin lähteisiin
- Sisältävät vastuuvapauslausekkeen
- Suosittelevat eläinlääkärin konsultointia
- Päivitetään säännöllisesti uusimman tutkimuksen mukaan

**Yhteisöominaisuudet:**
- Moderointi automaattinen + manuaalinen
- Raportointi- ja estotoiminnot
- Yksityisyysasetukset granulaarisesti
- Alaikäisten suojelu (ei alle 13v käyttäjiä)

## 20. Jatkuva kehitys ja ylläpito

**Viikoittaiset tehtävät:**
- Dependency-päivitykset (Dependabot)
- Suorituskykyseuranta (Lighthouse CI)
- Käyttäjäpalautteen läpikäynti
- Analytiikkadatan tarkastelu

**Kuukausittaiset tehtävät:**
- Saavutettavuusauditointi
- Tietoturva-auditointi
- Koodin refaktorointi teknisen velan vähentämiseksi
- A/B-testien tulosten analysointi

**Neljännesvuosittaiset tehtävät:**
- Arkkitehtuurin arviointi
- Teknologiastack-päivitykset
- Käyttäjätutkimus ja UX-testaus
- Kilpailija-analyysi

---

**Muista:** Tämä on elävä dokumentti. Päivitä sitä projektin kehittyessä ja uusien oppien myötä. Käytä `# claude.md` -komentoa istuntojen aikana lisätäksesi ohjeita orgaanisesti.

**Versio:** 1.0  
**Viimeksi päivitetty:** 12. elokuuta 2025  
**Seuraava arviointi:** 12. marraskuuta 2025



---

# KOKONAISVALTAINEN ARVIO - VIIMEISIN VERSIO (Elokuu 2025)

## Projektin nykyinen tila

Pentulaskuri.com-projekti on kehittynyt merkittävästi alkuperäisestä visiosta kokonaisvaltaiseksi koiranpentujen kasvatustyökaluksi. Viimeisimmän GitHub-repositorion analyysin perusteella projekti sisältää nyt 185+ tiedostoa ja kattavan teknologiapinon, joka yhdistää modernin web-kehityksen parhaat käytännöt koira-aiheiseen liiketoimintalogiikkaan.

### Tekninen kypsyys: 8.5/10

**Vahvuudet:**
- Moderni React + TypeScript -arkkitehtuuri on hyvin toteutettu
- Supabase-integraatio tarjoaa skaalautuvan backend-ratkaisun
- Capacitor mahdollistaa saumattoman mobiilisovelluskehityksen
- Kattava komponenttikirjasto shadcn/ui:n päällä
- Tailwind CSS takaa johdonmukaisen ja responsiivisen suunnittelun

**Kehityskohteet:**
- Saavutettavuus vaatii merkittäviä parannuksia (WCAG 2.1 AA -taso 67%)
- Mobiilioptimointiongelmat (horisontaalinen skrollaus)
- Deployment-prosessi IONOS:iin ei toimi automaattisesti
- Testikattavuus ei ole optimaalinen

### Liiketoimintapotentiaali: 9/10

**Markkinamahdollisuudet:**
Projekti on ainutlaatuisessa asemassa pentukoiran kasvatustyökalujen markkinassa. Yhdistelmä painonseurannasta, ruokalaskurista ja sosiaalisesta pentukirjasta luo vahvan kilpailuedun. Kohderyhmä on selkeästi määritelty ja markkinapotentiaali merkittävä.

**Liiketoimintamallin vahvuudet:**
- Freemium-malli mahdollistaa laajan käyttäjäkunnan
- Premium-ominaisuudet (edistynyt analytiikka, sosiaalinen jakaminen) luovat tulopotentiaalia
- Yhteisöllisyys lisää käyttäjäsitoutumista
- Datan arvo kasvaa käyttäjämäärän myötä

### Käyttökokemus: 7.5/10

**Positiiviset havainnot:**
- Visuaalinen ilme on parantunut merkittävästi (5/10 → 9/10)
- Koira-teema on johdonmukaisesti toteutettu
- Modernit animaatiot ja mikrointeraktiot
- Glassmorphism-suunnittelu luo premium-vaikutelman

**Kriittiset parannuskohteet:**
- Mobiilikokemus ei ole optimaalinen (tekstit menevät "yli laidan")
- Navigaatio ei ole intuitiivinen kaikille käyttäjäryhmille
- Saavutettavuuspuutteet estävät osan käyttäjistä
- Latausajat voivat olla hitaita mobiililaitteilla

## Strategiset suositukset

### 1. Välittömät toimenpiteet (1-2 kuukautta)

**Saavutettavuuden korjaaminen (Prioriteetti #1):**
Nykyinen 67% WCAG 2.1 AA -yhteensopivuus on riittämätön. Suosittelen välitöntä panostusta:
- Semanttisten landmarkien lisääminen
- Alt-tekstien kirjoittaminen kaikille kuville
- ARIA-merkintöjen korjaaminen
- Skip-linkin toteutus
- Värikontrastien parantaminen

**Mobiilioptimointien viimeistely:**
Horisontaalisen skrollauksen poistaminen ja responsiivisuuden parantaminen ovat kriittisiä käyttäjäkokemuksen kannalta.

**Deployment-prosessin korjaaminen:**
IONOS-integraation automatisointi GitHub Actions -työkululla varmistaa sujuvan kehitysprosessin.

### 2. Keskipitkän aikavälin kehitys (3-6 kuukautta)

**Mobiilisovelluksen kehittäminen:**
Flutter-pohjainen mobiilisovellus tarjoaisi merkittävän kilpailuedun. Suosittelen:
- MVP-version kehittäminen painonseurannalla ja pentukirjalla
- Push-notifikaatiot muistutuksille
- Offline-toiminnallisuus kriittisille ominaisuuksille
- Kameran integraatio muistojen tallentamiseen

**Sosiaalisten ominaisuuksien laajentaminen:**
Pentukirjan jakamisominaisuudet voivat luoda viraalipotentiaalia:
- Automaattinen some-kuvien generointi
- Yhteisöominaisuudet (kommentointi, tykkäykset)
- Kasvattajaverkosto ammattimaisille käyttäjille

### 3. Pitkän aikavälin visio (6-12 kuukautta)

**AI-integraatio:**
Tekoälyn hyödyntäminen voi nostaa palvelun seuraavalle tasolle:
- Automaattinen kuvantunnistus pentujen kasvun seuraamiseen
- Personoidut ruokasuositukset ML-algoritmeilla
- Terveyden ennustaminen kasvudatan perusteella
- Chatbot-tuki yleisiin kysymyksiin

**Kansainvälistyminen:**
Englanninkielinen versio avaa globaalit markkinat:
- Monikielisyystuki (i18n)
- Paikallisten ruokamerkkien integraatio
- Kulttuurikohtaiset kasvatuskäytännöt

## Liiketoimintavaikutusten arvio

### Taloudellinen potentiaali

**Käyttäjäkunta-arviot:**
- Vuosi 1: 10,000 aktiivista käyttäjää
- Vuosi 2: 50,000 aktiivista käyttäjää  
- Vuosi 3: 150,000 aktiivista käyttäjää

**Tulopotentiaali (Freemium-malli):**
- Ilmaiskäyttäjät: 80% (mainostulot ~2€/käyttäjä/vuosi)
- Premium-käyttäjät: 15% (9.99€/kuukausi)
- Pro-käyttäjät (kasvattajat): 5% (29.99€/kuukausi)

**Vuoden 3 tuloarvio:**
- Mainostulot: ~240,000€
- Premium-tilaukset: ~2,700,000€
- Pro-tilaukset: ~2,700,000€
- **Kokonaistulot: ~5,640,000€**

### Kilpailullinen asemointi

**Nykyiset kilpailijat:**
- PuppyChart: Keskittyy vain painonseurantaan
- DogLog: Yleinen koirapäiväkirja
- PetDesk: Eläinlääkäripalvelut

**Kilpailuetu:**
Pentulaskuri.com on ainoa palvelu, joka yhdistää:
1. Tieteellisesti perustellut ruokasuositukset
2. Sosiaalisen pentukirjan
3. Ammattimaiset kasvattajatyökalut
4. Yhteisöllisyyden

### Riskit ja haasteet

**Tekniset riskit:**
- Skaalautuvuus suurilla käyttäjämäärillä
- Tietoturva henkilökohtaisen datan kanssa
- Mobiilialustojen päivitykset

**Liiketoimintariskit:**
- Kilpailijoiden kopiointi
- Sääntelymuutokset (GDPR, eläinsuoj
(Content truncated due to size limit. Use page ranges or line ranges to read remaining content)