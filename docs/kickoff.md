# Pentulaskuri Kick-off

**P�iv�m��r�:** 27.9.2025
**Kesto:** 90 min (00:00�01:30) + 30 min jatkokeskusteluvaraus
**Tavoite:** Vahvistaa sprintti- ja roadmap-aikataulu sek� vastuut kehityssuunnitelman mukaisesti.

## Osallistujat

- Tech Lead / CTO � (nimi)
- Product Manager � (nimi)
- Frontend Developer(t) � (nimet)
- Backend Developer � (nimi)
- Mobile Developer � (nimi)
- UX/UI Designer � (nimi)
- QA Engineer � (nimi)
- Data Analyst � (nimi)
- Marketing Manager � (nimi)
- Veterinary Advisor � (nimi)

## Agenda ja tuotokset

1. **Avaus & tavoitteet (PM)** � varmistettiin kokouksen tarkoitus ja onnistumiskriteerit.
2. **Roadmap & sprinttirakenne (PM)** � hyv�ksyttiin 2 viikon sprintit, vaiheet 0�5; sprintti 0 k�ynnistyy heti, julkaisut stagingiin jokaisen sprintin lopussa.
3. **Tekninen alusta (Tech Lead)** � vahvistettiin CI/CD-putki (GitHub Actions), suojatut tiedostot, Supabase-ymp�rist�t ja DoD-putki: `format ? lint ? type-check ? test ? a11y ? deploy`.
4. **Roolit & vastuut** � roolit yll� olevan listan mukaisesti, Tech Lead omistaa arkkitehtuurin, PM backlog-priorisoinnin, QA testistrategian.
5. **Riskit & mitigointi** � kohteina skaalautuvuus, tietoturva, tekninen velka ja resurssit; p��tettiin seurata riskilokia sprinttien retrospektiiveissa.
6. **Sprintti 0 backlog** � alustava teht�v�lista vahvistettiin (ks. alla). Ty�kaluna Jira/Linear, avattiin epicit: Infra, Supabase, UI-kehys.
7. **Q&A ja seuraavat askeleet** � ker�ttiin avoimet kysymykset, sovittiin vastuu niiden ratkaisemiseksi.

## P��t�kset

- Sprintit: 2 viikon syklit, Sprintti 0 (perustukset) alkaa 30.9.2025.
- Roadmap: noudatetaan dokumentoitua vaiheittaista etenemist� (0�5), arvioitu kesto 52 viikkoa.
- Palaverirytmi: p�ivitt�inen stand-up klo 09:15, sprint review + retro joka toinen perjantai, roadmap-sync kuukausittain.
- Dokumentointi: roadmap p�ivittyy tiedostoon `docs/roadmap.md`; DoD pidet��n repossa CONTRIBUTING.md:ss�.
- Kommunikaatio: Slack-kanava #pentu-dev, p��t�ksist� kirjalliset muistiot 24 h sis�ll�.

## Sprintti 0 � teht�v�t ja vastuuhenkil�t

1. **Backlog grooming** (PM + Tech Lead) � erottele k�ytt�j�tarinat moduuleittain, m��rit� hyv�ksymiskriteerit.
2. **CI/CD-asetukset** (Tech Lead) � lukitse GitHub Actions -workflowt, ota k�ytt��n branch protection, semanttiset tagit.
3. **Supabase-ymp�rist�** (Backend Dev) � k�ynnist� lokaali instanssi, luo perustaulut `puppies`, `weights`, testaa RLS-pohjat.
4. **UI-kehys** (Frontend Dev + UX) � varmistetaan Layout, Navigation, peruskomponenttien kirjasto, design tokenit.
5. **Testausstrategia** (QA) � julkaise yksikk�-, integraatio-, E2E- ja a11y-testauksen tiekartta.
6. **Dokumentaation luonti** (PM) � p�ivit� `docs/roadmap.md`, laadi `docs/DoD.md` ja jaa kaikille.

## Riskiloki (Kick-offissa nostetut)

- Skaalautuvuus: Supabase read replica tarpeet � vastuuhenkil� Backend Dev, tarkistus Sprintti 3 lopussa.
- Tietoturva: RLS-auditointi jokaisen release-kandidaatin yhteydess� � Tech Lead + Backend.
- Resurssit: UX- ja QA-kapasiteetti sprinttien 2�3 aikana � PM selvitt�� lis�resurssia.

## Seuraavat askeleet

1. PM l�hett�� kick-off recap -s�hk�postin + linkit materiaaleihin (24 h).
2. Tech Lead luo Sprintti 0 kanban-taulun ja t�ytt�� teht�v�t omistajille.
3. Ensimm�inen stand-up ma 30.9. klo 09:15; retro + review Sprintti 0 p��ttyess� 11.10.
4. P�ivitet��n riskiloki ja roadmap joka viikon perjantai.

---

_Muistiinpanot tallennettu repositorion `docs/`-hakemistoon. P�ivit� osallistujien nimet ja tilannetiedot tarpeen mukaan._
