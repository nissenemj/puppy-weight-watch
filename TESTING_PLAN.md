# Testaussuunnitelma (Testing Plan)

Tämä dokumentti määrittelee "Puppy Weight Watch" -sovelluksen testausstrategian ja -tapaukset. Tavoitteena on varmistaa sovelluksen luotettavuus, käytettävyys ja suorituskyky erityisesti mobiililaitteilla.

## 1. Testausympäristö

*   **Laitteet:**
    *   Desktop (Chrome, Firefox, Edge)
    *   Mobile (iOS Safari, Android Chrome)
*   **Resoluutiot:**
    *   Desktop: 1920x1080, 1366x768
    *   Mobile: iPhone SE (375x667), iPhone 12/13/14 (390x844), Android (360x800+)

## 2. Testaustapaukset

### 2.1. Autentikaatio ja Käyttäjähallinta

| ID | Testitapaus | Odotettu lopputulos | Prioriteetti |
| :--- | :--- | :--- | :--- |
| AUTH-01 | Vieras-tilaan (Guest Mode) siirtyminen | Käyttäjä pääsee sovellukseen ilman kirjautumista. "Vieras"-badge näkyy. | Korkea |
| AUTH-02 | Rekisteröityminen sähköpostilla | Uusi käyttäjätili luodaan onnistuneesti. Ohjaus Onboarding-näkymään. | Korkea |
| AUTH-03 | Kirjautuminen sähköpostilla | Käyttäjä pääsee kirjautumaan olemassa olevilla tunnuksilla. | Korkea |
| AUTH-04 | Uloskirjautuminen | Käyttäjä kirjataan ulos ja ohjataan aloitussivulle/kirjautumiseen. | Keski |
| AUTH-05 | Vieras-tilan tietojen säilyvyys | Vieras-tilassa syötetyt tiedot säilyvät selaimen välimuistissa (localStorage) sivun päivityksen jälkeen. | Korkea |

### 2.2. Onboarding (Uuden käyttäjän opastus)

| ID | Testitapaus | Odotettu lopputulos | Prioriteetti |
| :--- | :--- | :--- | :--- |
| ONB-01 | Koiran profiilin luonti | Käyttäjä voi syöttää koiran nimen, rodun, syntymäajan ja sukupuolen. | Korkea |
| ONB-02 | Pakolliset kentät | Lomake ei etene, jos pakollisia tietoja (esim. nimi) puuttuu. | Keski |
| ONB-03 | Onboardingin valmistuminen | Profiili tallentuu tietokantaan ja käyttäjä ohjataan päänäkymään. | Korkea |

### 2.3. Painonseuranta (Weight Tracker)

| ID | Testitapaus | Odotettu lopputulos | Prioriteetti |
| :--- | :--- | :--- | :--- |
| WT-01 | Painon lisääminen (Vieras) | Paino tallentuu listaan ja graafiin. "Vieras"-merkintä näkyy. | Korkea |
| WT-02 | Painon lisääminen (Kirjautunut) | Paino tallentuu tietokantaan ja päivittyy reaaliaikaisesti. | Korkea |
| WT-03 | Virheellinen syöte | Negatiivinen paino tai ei-numeerinen arvo estetään/ilmoitetaan virheestä. | Keski |
| WT-04 | Graafin skaalautuvuus | Graafi näkyy oikein mobiililaitteella ja mukautuu uusiin datapisteisiin. | Korkea |
| WT-05 | Pull-to-refresh | Listan vetäminen alaspäin päivittää tiedot (mobiili). | Matala |

### 2.4. Ruoka-annoslaskuri (Food Calculator)

| ID | Testitapaus | Odotettu lopputulos | Prioriteetti |
| :--- | :--- | :--- | :--- |
| CALC-01 | Ruoan valinta | Listasta voi valita ruoan. Valinta aktivoi laskentaparametrit. | Korkea |
| CALC-02 | Laskennan suoritus | Syötetyillä arvoilla (paino, ikä, aktiivisuus) saadaan järkevä grammamäärä. | Korkea |
| CALC-03 | Puuttuvat tiedot | Laskentaa ei suoriteta, jos pakollisia tietoja puuttuu. Virheilmoitus näkyy. | Keski |
| CALC-04 | Tulosten näyttö mobiilissa | Tulokset (g/päivä, g/ateria) näkyvät selkeästi ilman vaakatason skrollausta. | Korkea |

### 2.5. Mobiilikäytettävyys ja UI

| ID | Testitapaus | Odotettu lopputulos | Prioriteetti |
| :--- | :--- | :--- | :--- |
| MOB-01 | Kosketusalueet | Kaikki napit ja linkit ovat riittävän suuria (min. 44x44px) ja helposti painettavia. | Korkea |
| MOB-02 | Alapalkin navigaatio | Alapalkki on kiinnitetty alareunaan, ei peitä sisältöä, ja "Safe Area" on huomioitu (iPhone). | Korkea |
| MOB-03 | Virtuaalinäppäimistö | Näppäimistön avautuminen ei riko taittoa (esim. input-kentät pysyvät näkyvissä). | Korkea |
| MOB-04 | Latausnäkymät (Skeleton) | Tietojen latautuessa näytetään Skeleton-placeholderit spinnerin sijaan. | Keski |

## 3. Testauksen suoritus

1.  **Manuaalinen testaus:** Kehittäjä käy läpi yllä olevat tapaukset kehitysympäristössä (localhost).
2.  **Laitetestaus:** Testaus fyysisellä mobiililaitteella tai emulaattorilla (Chrome DevTools Device Mode).
3.  **Käyttäjätestaus:** (Valinnainen) Beta-käyttäjät kokeilevat sovellusta ja raportoivat bugeista.

## 4. Tunnetut ongelmat ja rajoitteet

*   Vieras-tilan tiedot ovat laitekohtaisia (localStorage).
*   Jotkut vanhemmat mobiiliselaimet eivät välttämättä tue kaikkia animaatioita.

## 5. Virheraportointi

Löydetyt virheet kirjataan ja priorisoidaan seuraavasti:
*   **Kriittinen:** Estää sovelluksen käytön (esim. kaatuminen, kirjautuminen ei toimi).
*   **Merkittävä:** Toiminnallisuus on puutteellinen, mutta kiertotie on olemassa.
*   **Vähäinen:** Kosmeettinen virhe tai pieni käytettävyysongelma.
