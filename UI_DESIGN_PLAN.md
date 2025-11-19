# Ulkoasun ja Käyttökokemuksen Kehittämissuunnitelma (UI/UX Design Plan)

Tämä dokumentti määrittelee "Puppy Weight Watch" -sovelluksen ulkoasun ja käyttökokemuksen kehityssuunnat. Tavoitteena on luoda **premium-tasoinen, mobiilioptimoitu ja sovellusmainen (app-like)** käyttökokemus.

## 1. Visuaalinen Identiteetti & Teema

### Väripaletti (Color Palette)
Nykyinen "warm" ja "cool" gradient-teema on hyvä alku, mutta sitä voidaan syventää.
- **Päävärit**:
    - Primary: Syvä, luotettava sininen (Shadcn default tai kustomoitu brändiväri).
    - Accent: Lämmin oranssi/koralli (energinen, pentumainen).
- **Gradientit**:
    - Käytetään hienovaraisempia, "glassmorphism" -tyylisiä taustoja korteissa (valkoinen tausta pienellä läpinäkyvyydellä + blur).
    - `bg-gradient-warm` ja `bg-gradient-cool` pidetään, mutta niiden kontrastia tekstin kanssa parannetaan.
- **Dark Mode**:
    - Varmistetaan, että kaikki komponentit näyttävät upeilta myös tummassa tilassa.
    - Käytetään "off-black" taustoja (esim. `slate-900`) puhtaan mustan sijaan syvyyden luomiseksi.

### Typografia
- **Fontti**: Pidetään selkeä sans-serif (Inter tai vastaava).
- **Hierarkia**:
    - Otsikot (H1-H3): Rohkeat, selkeät, riittävä välistys.
    - Leipäteksti: Hyvä luettavuus mobiilissa (min 16px).
    - Numerot/Data: Käytetään `tabular-nums` -ominaisuutta taulukoissa ja laskureissa numeroiden tasaukseen.

## 2. Komponenttien Viimeistely

### Kortit (Cards)
- **Muotoilu**: Pyöristetyt kulmat (`rounded-2xl` tai `rounded-3xl`) modernimman ilmeen saamiseksi.
- **Varjot**: Pehmeät, laajat varjot (`shadow-lg`, `shadow-xl`) luomaan syvyyttä, erityisesti "kelluvissa" elementeissä.
- **Interaktio**: Hover-efektit työpöydällä (pieni nousu ylöspäin) ja "active" -tila mobiilissa (pieni painallus).

### Painikkeet (Buttons)
- **Hierarkia**:
    - Primary Button: Gradient-tausta, vahva varjo.
    - Secondary Button: Outline tai ghost-tyyli, selkeästi erottuva.
- **Koko**: Mobiilissa aina riittävän suuri kosketusalue (min 44px korkeus).

### Syötekentät (Inputs)
- **Fokus-tilat**: Selkeä, brändivärin mukainen rengas (`ring-2`) fokuksessa.
- **Mobiilioptimointi**: Oikeat näppäimistötyypit (`inputMode="decimal"`, `inputMode="numeric"`) on jo aloitettu, laajennetaan kaikkiin kenttiin.

## 3. Animaatiot ja Transitiot

Tavoitteena on "elävä" käyttöliittymä ilman, että se tuntuu raskaalta.

- **Sivunvaihdot**:
    - Pehmeä `fade-in` ja `slide-up` kun siirrytään näkymästä toiseen.
    - Käytetään `Framer Motion` -kirjastoa (joka on jo projektissa) sivunvaihtoihin.
- **Mikro-interaktiot**:
    - **Tykkäykset/Valinnat**: Pieni "bounciness" ikoneissa kun niitä klikataan.
    - **Lataus**: Skeleton-loaderit (toteutettu) + pehmeä häivytys sisältöön kun data on ladattu.
    - **Listat**: Uudet merkinnät (paino, ruokinta) ilmestyvät listaan animoituna (`AnimatePresence`).

## 4. Mobiilikokemus (Mobile-First)

### Navigaatio
- **Bottom Navigation**:
    - Varmistetaan, että se on aina näkyvissä ja helposti saavutettavissa peukalolla.
    - Aktiivinen välilehti korostetaan selkeästi (ikonin väri + pieni animaatio).
    - "Safe Area" -huomiointi (iPhone home bar) on kriittistä (tämä on jo aloitettu `MobileOptimizedLayout`:ssa).

### Eleet (Gestures)
- **Pyyhkäisy**: Mahdollistetaan välilehtien vaihto pyyhkäisemällä sivulle (Swipe gestures).
- **Pull-to-Refresh**: "Vedä alas päivittääksesi" -toiminto datan lataukseen (tämä on jo toteutettu, mutta visuaalista palautetta voi hioa).

## 5. Konkreettiset Seuraavat Askeleet

1.  **Animaatioiden lisäys**: Ota `Framer Motion` laajemmin käyttöön sivunvaihdoissa ja listojen päivityksissä.
2.  **Visuaalinen yhtenäistäminen**: Käy läpi kaikki kortit ja varmista, että `rounded` ja `shadow` -luokat ovat johdonmukaisia (esim. kaikki `rounded-2xl`).
3.  **Dark Mode -tarkistus**: Testaa sovellus pakotetussa tummassa tilassa ja korjaa mahdolliset kontrastiongelmat.
4.  **Ikonit**: Varmista, että `Lucide React` -ikonit ovat yhtenäisiä kooltaan ja tyyliltään.

---
*Tämä suunnitelma toimii ohjenuorana seuraaville kehityssprinteille.*
