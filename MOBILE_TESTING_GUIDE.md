# Mobiilitestausohjeet - Pentulaskuri.com

## 🎯 Testauskohdat

### 1. Perus mobiilioptimointi
- [ ] Ei horisontaalista skrollausta missään näkymässä
- [ ] Kaikki tekstit näkyvät kokonaan
- [ ] Painikkeet ovat vähintään 44px korkeita
- [ ] Kuvat skaalautuvat oikein
- [ ] Navigaatio toimii sormella

### 2. Responsive design
- [ ] Layout mukautuu eri näytön kokoihin
- [ ] Font-koot skaalautuvat oikein
- [ ] Grid-layoutit kääntyvät mobiiliin
- [ ] Flex-elementit kääntyvät tarvittaessa

### 3. Touch-ystävällisyys
- [ ] Kaikki klikattavat elementit ovat vähintään 44px
- [ ] Ei double-tap zoom ongelmia
- [ ] Touch-gesturet toimivat
- [ ] Virtual keyboard ei peitä sisältöä

### 4. Performance
- [ ] Loading-ajat alle 3 sekuntia
- [ ] Animaatiot ovat sulavia
- [ ] Ei jankkia skrollatessa
- [ ] Kuvat latautuvat optimaalisesti

## 📱 Testauslaitteet

### Suositellut laitteet:
1. **iPhone SE (375px)** - Pienin yleinen mobiili
2. **iPhone 12/13/14 (390px)** - Standard mobiili
3. **iPhone 12/13/14 Pro Max (428px)** - Suuri mobiili
4. **Samsung Galaxy S21 (360px)** - Android standard
5. **iPad (768px)** - Tablet

### Testausselaimet:
- Chrome (Android)
- Safari (iOS)
- Firefox (Android)
- Edge (Windows)

## 🔧 Chrome DevTools Testaus

### 1. Avaa DevTools
```
F12 tai Ctrl+Shift+I
```

### 2. Aktivoi mobiiliemulaatio
- Klikkaa mobiili-ikonia (📱)
- Valitse laite listasta
- Testaa eri orientaatiot (portrait/landscape)

### 3. Testaa eri näytön koot
```javascript
// Testaa eri breakpointit
320px, 375px, 390px, 428px, 768px, 1024px
```

### 4. Tarkista overflow
```javascript
// Tarkista että ei ole horisontaalista skrollausta
document.body.scrollWidth <= window.innerWidth
```

## 🧪 Automaattinen testaus

### Lighthouse testaus:
```bash
# Asenna Lighthouse
npm install -g lighthouse

# Testaa mobiili
lighthouse https://localhost:5173 --view --preset=mobile
```

### Core Web Vitals:
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

## 📋 Tarkistuslista

### Hero-osio
- [ ] Otsikko näkyy kokonaan
- [ ] Painikkeet ovat klikattavissa
- [ ] Emoji-koot ovat sopivia
- [ ] Gradient tausta toimii

### Features Grid
- [ ] Kortit kääntyvät mobiiliin
- [ ] Tekstit eivät mene yli laidan
- [ ] Painikkeet ovat täysleveyttä mobiilissa

### Navigaatio
- [ ] Mobiilimenu toimii
- [ ] Linkit ovat klikattavissa
- [ ] Ei overflow-ongelmia

### Lomakkeet
- [ ] Input-kentät ovat täysleveyttä
- [ ] Select-elementit toimivat
- [ ] Virtual keyboard ei peitä sisältöä

### Kuvat ja media
- [ ] Kuvat skaalautuvat oikein
- [ ] Ei horisontaalista skrollausta
- [ ] Lazy loading toimii

## 🐛 Yleisimmät ongelmat ja ratkaisut

### 1. Horisontaalinen skrollaus
```css
/* Ratkaisu */
html, body {
  overflow-x: hidden;
  max-width: 100vw;
}
```

### 2. Liian suuret font-koot
```css
/* Ratkaisu */
h1 {
  font-size: clamp(1.5rem, 4vw, 3rem);
}
```

### 3. Kiinteät leveydet
```css
/* Ongelma */
width: 300px;

/* Ratkaisu */
width: 100%;
max-width: 300px;
```

### 4. Touch-target ongelmat
```css
/* Ratkaisu */
button, a {
  min-height: 44px;
  min-width: 44px;
}
```

## 📊 Testaustulosten raportointi

### Raportoi seuraavat tiedot:
1. **Testattu laite**: iPhone 12, Chrome
2. **Näytön koko**: 390x844px
3. **Orientaatio**: Portrait
4. **Ongelmat**: Listaa kaikki löydetyt ongelmat
5. **Suorituskyky**: Lighthouse score
6. **Käyttäjäkokemus**: Yleinen arvio

### Esimerkki raportista:
```
✅ Hero-osio: Toimii hyvin
✅ Features Grid: Responsive, ei ongelmia
⚠️  Navigaatio: Pieni font-koko mobiilissa
❌ Lomake: Input-kentät liian pienet
```

## 🚀 Jatkuva testaus

### CI/CD integraatio:
```yaml
# .github/workflows/mobile-test.yml
name: Mobile Testing
on: [push, pull_request]
jobs:
  mobile-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
      - name: Install dependencies
        run: npm ci
      - name: Build project
        run: npm run build
      - name: Run Lighthouse CI
        run: npx lighthouse-ci autorun
```

### Automaattinen seuranta:
- Lighthouse CI raportit
- Core Web Vitals monitoring
- Real User Monitoring (RUM)
- Error tracking

## 📞 Tuki

Jos kohtaat ongelmia mobiilitestauksessa:
1. Tarkista console virheet
2. Testaa eri selaimilla
3. Varmista että kaikki riippuvuudet on päivitetty
4. Tarkista CSS-konfliktit

---

**Huomio**: Tämä ohje päivittyy jatkuvasti uusien testaustarpeiden mukana. 