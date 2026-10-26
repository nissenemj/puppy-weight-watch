# Welcome to your Lovable project

## Project info

<!-- Deployment trigger for route fixes -->

**URL**: https://lovable.dev/projects/3219ec70-7c28-4d36-bf27-bfe4d9c39c8b

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/3219ec70-7c28-4d36-bf27-bfe4d9c39c8b) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/3219ec70-7c28-4d36-bf27-bfe4d9c39c8b) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## Käyttöoikeuskorjaukset

`supabase/security/` sisältää kolmen käyttöoikeusmuutoksen SQL-lähteet.
Niistä on luotu Supabase CLI:n `migration new` -komennolla vastaavat tiedostot
`supabase/migrations/`-hakemistoon. SQL ei tule käyttöön Vercel-buildin mukana.
Kohdekannan migraatiohistoria on tarkistettava ennen ajoa: tuotannossa on myös
erillisen ruokien lähdeaineistotyön migraatioita, jotka puuttuvat tästä haarasta.
Älä korjaa tätä eroa ajamalla koko paikallista migraatioketjua tuotantoon.

- `catalog_admin_writes.sql`: kuuden nykyisen ruokaluettelotaulun kirjoitus vaatii
  tietokannan `admin`-roolin ja muun kuin anonyymin Auth-istunnon. Julkinen luku säilyy.
  Muutos antaa ylläpitäjälle myös päivitys- ja poisto-oikeuden tauluihin, joissa niitä
  ei aiemmin ollut. Käyttäjän itse muokkaama `user_metadata.role` ei anna oikeuksia.
- `private_puppy_book_images.sql`: `puppy-books` muutetaan yksityiseksi. Omistaja
  saa lukea ja poistaa omat kuvat. Vanha `<bookId>/tiedosto` edellyttää sekä omaa
  kirjaa että omaa lataajatunnistetta (`owner_id`, vanhoissa tiedoissa `owner`).
  Pelkkä valittu kirjatunniste ei saa antaa pääsyä toisen käyttäjän kansioon.
  Uudet lataukset sallitaan vain `<userId>/puppy-profile/tiedosto`- ja
  `<userId>/books/<bookId>/tiedosto`-polkuihin. Ylläpitäjän
  ruokaluettelorooli ei anna pääsyä muiden kuviin. `food-images` ja `blog-images`
  säilyvät ennallaan.
- Molemmissa on rajoittavat RLS-säännöt, jotta toinen salliva sääntö ei yksin avaa
  suojattuja toimintoja uudelleen. SQL pysähtyy, jos oletettu perusrakenne puuttuu.
- `isolate_blog_image_admin_lookup.sql`: blogikuvien vanha sääntö luki suoraan
  `auth.users`-taulua, mikä esti myös muiden bucketien latauksia. Muutos siirtää
  täsmälleen nykyisen ylläpitäjäehdon `private.can_write_blog_images(text)`
  -apufunktioon. Se tarkistaa vain kutsujan `auth.uid()`-tunnisteen ja palauttaa
  totuusarvon. Funktio käyttää tyhjää `search_path`-asetusta ja on suoritettavissa
  vain `authenticated`-roolilla API:n ulkopuolisessa skeemassa. Asiakkaat eivät saa
  lukuoikeutta Auth-tauluun. Nykyinen blogiylläpitäjien rajaus säilyy.

Supabasen [Storage-omistajuuden ohje](https://supabase.com/docs/guides/storage/security/ownership)
kuvaa JWT:stä asetettavan `owner_id`-tiedon. `owner`-varakenttä tukee tämän projektin
vanhaa skeemaa. Tuntematonta lataajaa ei päätellä pelkästä kirjatunnisteesta.

Kuvien tallennus käyttää samaa palvelua profiilissa ja muistoissa. Tietueeseen
tallennetaan kuvan pysyvä polku. Katselua varten haetaan viisi minuuttia voimassa
oleva signed URL, joka uusitaan neljän minuutin välein. Vanhoja saman Supabase-
projektin `puppy-books`-osoitteita tuetaan ilman tietueiden massamuutosta. Muun
palvelun osoite, virheellinen polku tai evätty allekirjoitus ei johda julkisen
kuvaosoitteen näyttämiseen. Käyttäjän vaihtuessa edellisen käyttäjän kuvaosoite
poistuu näkymästä. Signed URL:ia ei tallenneta tietokantaan tai localStorageen.
Uusien kuvien rajat ovat JPEG/PNG/WebP ja 5 Mt. Muistokuvan poistossa käytetään koko
tallennettua polkua. Jos Storage palauttaa virheen tai ei poistettua kohdetta,
muiston tietuetta ei poisteta. Jo kadonneen kuvan tietue tarvitsee erillisen siivouksen.

### Testit ilman palveluyhteyttä

JavaScript-testit käyttävät Supabase-kutsujen korvikkeita, eivät oikeaa palvelua:

```sh
npm test -- --maxWorkers=2
npm run lint
./node_modules/.bin/tsc --noEmit -p tsconfig.app.json
./node_modules/.bin/tsc --noEmit -p tsconfig.node.json
npm run build
```

Rajoitettu rinnakkaisuus vähentää tämän ympäristön aikakatkaisuja. Älä aja buildia
ja tyyppitarkistusta samaan aikaan testisarjan kanssa. `npm run type-check` ei
tarkista sovellusta kattavasti, joten käytä yllä olevia `tsconfig.app.json`- ja
`tsconfig.node.json`-komentoja.

Lähtöversion `04b393b7ca45cd178936673e48042d74de6861ba` neljä aiempaa tyyppivirhettä
korjattiin 26.10.2026 samoilla muutoksilla, jotka ovat jo
[PR:ssä #11](https://github.com/nissenemj/puppy-weight-watch/pull/11).
PR tarkistettiin ennen muokkausta: se on avoin luonnos, pääcommit
`9c78c7de2bcc9ba37fb6c9b123f862686c42a848`, eikä sitä ole yhdistetty `main`-haaraan.
Tähän paikalliseen haaraan otettiin vain kolme tyyppikorjausta:

- `CreateBookPrompt.tsx`: kirjanvalinnan callback käyttää nykyistä `PuppyBook`-tyyppiä.
- `PuppyBook.tsx`: luodun kirjan tyyppimuunnos viittaa olemassa olevaan `PuppyBookType`-tyyppiin.
- `SettingsDialog.tsx`: `theme` ja `privacy_settings` ovat valinnaisia kuten muualla pentukirjan tyypissä.

PR:n navigaatio- ja laskurimuutoksia ei otettu mukaan. Tämän haaran yksityisyys- ja
käyttöoikeuskorjaukset säilyivät.

Paikallinen tarkistus 26.10.2026 (Node 22.23.4, npm 10.9.9):

| Tarkistus | Tulos |
| --- | --- |
| Koko Vitest-sarja, `--maxWorkers=2` | 138 hyväksytty, yksi aiempi testi ohitettu; mukana 62 uutta testiä |
| PostgreSQL 17.10, kaikki kolme SQL:ää kahdesti | Oikeus- ja omistustestit hyväksytty |
| Kumpikin alkuperäisten sääntöjen vastakoe | Odotettu exit 1; alkuperäinen puute havaitaan |
| ESLint | 0 virhettä, 152 varoitusta |
| Tuotantobuild | Hyväksytty |
| Sovelluksen TypeScript | Hyväksytty, 0 virhettä |
| Node-asetusten TypeScript | Hyväksytty |

Kaikki yllä olevat ajot, myös npm-skriptien lapsiprosessit ja SQL-testien ajaja,
käyttivät Node 22.23.4:ää. Riippuvuuksina käytettiin aiemmin asennettua
`node_modules`-hakemistoa. Projektin riippuvuuksia tai lukitustiedostoa ei muutettu.
Node ladattiin erilliseen väliaikaiskansioon virallisena darwin-arm64-pakettina ja
sen SHA-256 tarkistettiin [julkaisun tarkistussummasta](https://nodejs.org/dist/v22.23.4/SHASUMS256.txt).

Tämän koneen tarkistusskriptien uudelleenajo nykyisellä väliaikaisella ajonaikaisella
ympäristöllä:

```sh
export PATH="/private/tmp/pentulaskuri-node22-20261026-dpe_v68k/node-v22.23.4-darwin-arm64/bin:$PATH"
node --version  # v22.23.4
npm --version   # 10.9.9
# Aja tämän jälkeen yllä luetellut tarkistuskomennot.
```

Väliaikaiskansio voi poistua koneen siivouksessa. Sen jälkeen valitse Node 22
käyttämälläsi versionhallintatyökalulla ja tarkista versio ennen ajoa.
Yllä oleva Node 22 -ajo tehtiin valmisteluvaiheessa. Julkaisun valmistelussa
26.10.2026 ajettiin lisäksi 43 hyväksyttyä testiä oikean paikallisen Supabase Auth-,
Data API- ja Storage HTTP -rajapinnan kautta Node 22.23.4:llä. Testi käyttää kahta
synteettistä käyttäjää, PostgreSQL 17.11:ta ja Storage API v1.84.19:ää.
Se tarkistaa latauksen, luvun, allekirjoituksen, vanhat polut ja lataajatiedon,
käyttäjä- ja kirjatunnisteiden törmäykset, toisen omistajan pääsyn eston,
tiedostorajat, pysyvän polun tallennuksen, linkin vanhenemisen ja poiston.
Mukana on myös blogisäännön virheen toistaminen ja korjauksen tarkistus.
Paikallinen testi ei käytä tuotantotunnuksia tai pilvipalvelua.

`scripts/test-storage-api.mjs` hyväksyy vain erillisen paikallisen testiprojektin,
jonka polku on `/private/tmp/pentulaskuri-storage-http-<tunniste>`, projektitunnus
alkaa `pentulaskuri-storage-http-` ja API-osoite on `http://127.0.0.1:55321`.
Alusta sitä varten uusi tyhjä CLI-projekti, aseta API-portiksi 55321 ja tietokannan
portiksi 55322 sekä käynnistä Auth, Data API ja Storage. Älä kopioi tuotannon
config.toml-tiedostoa tai migraatioita testiprojektiin. Anna uuden projektin polku
muuttujassa `STORAGE_TEST_WORKDIR` ja CLI:n suoritustiedoston polku muuttujassa
`STORAGE_TEST_CLI`, ja aja `npm run test:security:storage`. Ajo edellyttää tyhjää
testikantaa ja paikallista Dockeria. CLI:n status sisältää paikallisia avaimia;
testi käsittelee ne muistissa eikä tulosta niitä.

RLS-testit käyttävät paikallista Dockeria ja valmiiksi koneella olevaa PostgreSQL 17
-imagea. Skripti ei lataa imagea, lue `.env`-tiedostoja tai Supabase-asetuksia eikä
käytä tuotannon tunnuksia. Se alustaa uuden synteettisen kannan konttiin ilman
verkkoyhteyttä, julkaistuja portteja tai levyliitoksia. Kontti poistetaan lopuksi.
Etä-Docker ja `DOCKER_HOST` hylätään. Olemassa oleviin kontteihin ei kosketa.

```sh
# Oletuksena käytetään jo ladattua postgres:17-imagea.
npm run test:security:db

# Tai anna jo paikallisesti olevan PostgreSQL 17 -imagen nimi.
ACCESS_TEST_POSTGRES_IMAGE=backend_service-postgres:latest npm run test:security:db

# Vastakokeet: onnistuminen tarkoittaa tässä tarkoituksellista exit 1 -virhettä.
# Molemmat korjaukset puuttuvat.
ACCESS_TEST_POSTGRES_IMAGE=backend_service-postgres:latest npm run test:security:db:baseline
```

Rajatut vastakokeet poistavat käytöstä vain yhden korjauksen:

```sh
ACCESS_TEST_POSTGRES_IMAGE=backend_service-postgres:latest node scripts/test-access-policies.mjs --baseline=catalog
ACCESS_TEST_POSTGRES_IMAGE=backend_service-postgres:latest node scripts/test-access-policies.mjs --baseline=storage
ACCESS_TEST_POSTGRES_IMAGE=backend_service-postgres:latest node scripts/test-access-policies.mjs --baseline=blog
```

Positiivinen RLS-ajo soveltaa molemmat muutokset kahdesti ja tarkistaa oikeudet
`anon`- ja `authenticated`-rooleissa. Mukana ovat kaksi omistajaa, oikea ylläpitäjä,
anonyymi Auth-tili, väärennetty user_metadata-rooli, kirja- ja käyttäjätunnisteiden
törmäykset sekä ylimääräinen salliva RLS-sääntö. Tuntemattoman lataajan vanha kuva
ei avaudu pelkän kirjatunnisteen perusteella; mahdollinen korjaus vaatii erillisen
omistuksen tarkistuksen.
Testi käyttää supistettua taulurakennetta. Se ei testaa Supabase Storage HTTP API:a,
oikeiden JWT:iden tarkistusta, palvelun välimuisteja tai tuotannon koko migraatioketjua.

### Julkaisemisen järjestys

1. Tarkista kohdekannan nykyiset säännöt, rooliapufunktiot ja kuvapolkujen muodot
   uudelleen. Tuotannon rakenne tarkistettiin myös 26.10.2026 ennen julkaisuvalmistelua.
2. Tarkista, että CLI:llä luotujen migraatioiden sisältö vastaa `supabase/security/`
   -lähteitä. Aja vain nämä kolme muutosta. Jos palvelun antama migraatioversio
   poikkeaa paikallisesta, kirjaa tiedostonimeen palvelun todellinen versio.
3. Testaa erillisessä Supabase-testiympäristössä kahden käyttäjän oikeilla
   istunnoilla: profiili, muiston lisäys ja poisto, vanha kuvapolku, allekirjoituksen
   vanheneminen sekä suora public-osoite ilman kirjautumista. Toisen omistajan
   lataus, luku, päivitys, poisto ja signed URL -pyyntö on estettävä.
4. Tarkista Preview. Koodin julkaisu ja tietokantamuutokset edellyttävät omistajan
   julkaisulupaa.
   Vanhat `visibility: public` -arvot eivät muodosta julkista jakamistoimintoa:
   tässä valmisteltu kuvamalli on omistajalle yksityinen. Käyttöliittymän
   julkisuusvalinnat on poistettu ja asetusten tallennus käyttää `private`-arvoa.
   Tietueisiin ei tehdä massamuutosta. Julkinen jakaminen vaatii oman toteutuksen.
5. Vie signed URL -yhteensopiva käyttöliittymä ensin ja sulje kuvabucket vasta
   hyväksytyllä SQL-muutoksella. Vanhat avoimet välilehdet voivat tarvita päivityksen.
   Tarkista omistajan kuvat ja ulkopuolisen pääsyn esto heti muutoksen jälkeen.
6. Palautuksessa pidä bucket yksityisenä ja käytä signed URL -yhteensopivaa koodia.
   Älä palauta julkista bucketia käyttöliittymävirheen kiertämiseksi. Jo ladattuja
   julkisia kopioita ei voi peruuttaa. Annettu signed URL on haltijansa käytettävissä
   enintään voimassaolonsa ajan, myös uloskirjautumisen jälkeen.

Paikallisen testin läpäisy ei yksin ole tuotannon julkaisulupa. Ympäristömuuttujien
muutoksia tai uusia riippuvuuksia nämä korjaukset eivät edellytä.

### Tuotannon tarkistus 26.10.2026

Projektissa `ckwwxuyteyaaxfcvozvb` otettiin käyttöön migraatiot
`20261026081338_restrict_catalogue_writes`,
`20261026083923_private_puppy_book_images` ja
`20261026084947_isolate_blog_image_admin_lookup`.
Kuvabucket on yksityinen, raja on 5 MiB ja sallitut tyypit ovat JPEG/PNG/WebP.

Tuotannossa hyväksyttiin 26 rajapintatarkistusta kahdella tätä ajoa varten luodulla
synteettisellä anonyymillä Auth-istunnolla. Ne kattavat kuuden luettelotaulun
julkisen luvun ja luvattoman kirjoituksen eston, kuvan latauksen ja allekirjoitetun
luvun, toisen omistajan luku-, allekirjoitus-, päivitys- ja poistoyrityksen eston,
kansikuvan polun tallennuksen sekä muistokuvan tallennuksen ja omistajasuojauksen.
Testikuvat, kirjat, muistot, niiden automaattisesti syntyneet koirat sekä molemmat
testitilit poistettiin. Alkuperäiset neljä kuvaa säilyivät.
Kaikkien neljän aiemmat julkiset osoitteet palauttivat HTTP 400:n sekä tavallisella
että välimuistin ohittavalla HEAD-pyynnöllä.

Vercel Preview-build valmistui, mutta Preview'n selainkäyttö jäi kirjautumisen
taakse. Jaettavaa pääsylinkkiä ei luotu. Käyttöliittymän julkiset näkymät tarkistettiin
paikallisesta buildista ja tuotannosta; paikallinen pentukirjan sivu tarkistettiin
leveyksillä 320, 768, 1024 ja 1440 px. Kirjautuneen käyttäjän koko selainpolkua
omalla sähköpostitilillä ei tämän julkaisun yhteydessä vahvistettu.
