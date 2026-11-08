# Decision Log

| Date       | Decision                                                        | Context            | Owner     |
| ---------- | --------------------------------------------------------------- | ------------------ | --------- |
| 2025-09-27 | Adopt 2-week sprints with roadmap phases 0-5                    | Kick-off agreement | PM        |
| 2025-09-27 | Enforce DoD pipeline (format ? lint ? type-check ? test ? a11y) | Kick-off agreement | Tech Lead |

## 8.11.2026: turvallisuustiedotteet ja koiran valokuvan muokkaus

- Työversio: `codex/safety-and-storybook-images-20261108`, pohjana tuotannon `855549050c5416dabf0b4fc659965bc9b710859a`. Alkuperäisen yksityisen projektikopion keskeneräinen maksutoteutus ja muut muutokset säilytettiin koskemattomina. Tämä kokonaisuus ei avaa maksullista myyntiä. Ei git pushia, pilvitietokantamuutoksia tai tuotantojulkaisua ilman erillistä lupaa.
- Käyttäjän hyväksynnät: OpenAI-kuville enintään 20 USD/kk, ensimmäiseen laatukokeeseen enintään 10 kuvaa yhteensä, `linkedom` 0.18.15 ja Supabase CLI 3.0.0. API-avain tallennettiin käyttäjän omalla lomakesyötöllä vain paikalliseen, versionhallinnasta suljettuun tiedostoon. Avain ei kuulu selainkoodiin tai tähän dokumenttiin.
- Käyttäjän tarkennus korvasi tekstipohjaisen kuvittamisen valokuvan muokkauksella. Valmiit tyylit: Prinsessaseikkailu, Koirani ihmisenä, Kuninkaallinen muotokuva, Retro-koulukuva ja Avaruussankari. Lisäksi enintään 240 merkin lisätoive. Prinsessan tyyli on oma animaatiosadun hahmo. Ihmismuokkaus luo kuvitteellisen aikuisen henkilön koiran värityksen ja ilmeen pohjalta.
- Kuva valmistellaan selaimessa PNG-muotoon, pitkän sivun enimmäiskoko 1024 px. JPG/PNG/WebP, enintään 5 Mt. Vasta luontipainike lähettää kuvan. Alkuperäinen tiedostonimi ja metatiedot poistetaan. Palvelin tarkistaa PNG-rakenteen ja poistaa metatiedot uudelleen. OpenAI saa kuvan, kiinteän tyyliohjeen, lisätoiveen ja käyttäjätunnuksen teknisen tiivisteen. Muita pentukirjan tietoja tai sähköpostiosoitetta ei lähetetä.
- Lähtökuva ja tulos ovat yksityisissä tallennustiloissa. Lähtökuvan käyttöoikeus vanhenee vuorokaudessa, minkä jälkeen ajastettu siivous poistaa sen käsittelyn päätyttyä. Lyhyt latauslinkki tarkistetaan omistajan kirjautumisen perusteella. Pentukirjaan lisätään erillinen, pysyvällä yksityisellä polulla oleva kopio vain käyttäjän pyynnöstä. Toistuva toimitus lisää yhden muiston.
- Kuvien luonti on oletuksena suljettu ja vaatii palvelimella myönnetyn kokeiluoikeuden sekä vahvistetun sähköpostin. Rajat ovat palvelimen tietokannassa: kaksi pyyntöä päivässä käyttäjää kohden, neljä lähtökuvan varausta päivässä, kokeilun yhteinen kuvamäärä ja kuukausibudjetti. Pyyntötunnus estää kaksoisluonnin. Toimitusvirheessä uusitaan tallennettujen tavujen toimitus, ei maksullista mallipyyntöä. Epäselvä laskutus pitää varauksen ja keskeyttää uuden kulutuksen tarkistukseen asti.
- Todellinen paikallinen päästä päähän -koe käytti Supabasen Authia, Edge Functionia, tietokantaa, yksityistä Storagea ja OpenAI Images Edit -rajapintaa mallilla `gpt-image-2.6-flare`. Saman sivuston oman esimerkkikoiran prinsessa- ja ihmismuokkaukset onnistuivat, samoin PNG-lataus ja lisäys synteettiseen testipentukirjaan. Molemmat muokkaukset maksoivat toteutuneen käytön mukaan yhteensä 0,061974 USD. Aiempi tekstipohjaisen prototyypin yksi koe mukaan lukien käytettiin kolme kuvaa ja 0,087199 USD. Kaikki nämä kulut kuuluvat hyväksyttyyn laatukokeeseen ja kuukausibudjettiin.
- Tuotannon kokeilun avaamisessa huomioidaan jo käytetyt kolme kuvaa: ensimmäisen laatukokeen jäljellä oleva raja on enintään seitsemän uutta kuvaa, ellei käyttäjä muuta sitä. Samassa kuussa jo käytetty 87 199 mikro-USD kirjataan tuotannon budjettiin ennen avaamista. Rajat koskevat Pentulaskurin omaa käyttöä. Muun samalla OpenAI-tilillä tapahtuvan käytön määrää ei ole oletettu.

### Viranomaisseurantaa koskevat päätökset

- Ensimmäisen version ensisijaiset lähteet ovat Ruokaviraston [rehut](https://www.ruokavirasto.fi/elaimet/rehut/) ja [eläinten terveys](https://www.ruokavirasto.fi/elaimet/). Toimivaa omaa RSS-syötettä näille ei vahvistettu, joten toteutus lukee julkisten sivujen otsikkoja palvelimella. Muuttunut sivurakenne merkitään hakuvirheeksi. Seuranta ei väitä kattavansa kaikkia viranomaisjulkaisuja.
- Koiria ja lemmikkiruokia koskevat otsikot erotetaan yleisistä ihmisravinnon ja tuotantoeläinten uutisista. Takaisinvetoa, varoitusta tai tautia ei päätellä yleisestä uutisotsikosta. Päivämäärää, aluetta tai voimassaolon päättymistä ei keksitä. Käyttäjä avaa alkuperäisen tiedotteen. Vanhemmat ja päiväämättömät julkaisut ovat erikseen avattavassa arkistossa.
- Selain lukee oman palvelun välimuistia. Lähteet tarkistetaan 30 minuutin välein palvelimella, ehdollisin HTTP-pyynnöin ja rajatuin vastekokoin. Lähdekohtainen tarkistusaika ja virhe näkyvät käyttäjälle. Osittainen katkos säilyttää viimeksi onnistuneet tiedot eikä muutu väitteeksi, ettei varoituksia olisi.
- [Lemmikkiruoan turvallisuusohje](https://www.ruokavirasto.fi/elaimet/rehut/tietoa-rehuista/lemmikkielainten-ruoka/) on aina suoraan avattavissa. [Kennelliitto](https://www.kennelliitto.fi/ajankohtaista/) on täydentävä linkki. Ensimmäiseen automaattiseen seurantaan ei lisätty yleis-, some- tai yritysuutisvirtaa. [Ylen RSS-ehtojen](https://yle.fi/a/20-10008076) rajoitukset ja ePressin yritystiedotteiden luonne puoltavat tätä rajausta.

### Muut korjaukset ja julkaisuvalmistelu

- Turvallisuusohjeen paluulinkki osoittaa `/guides`-sivulle. Vanhentuneen JavaScript-osan latausvirhe näyttää suomenkielisen palautusnäkymän ja käyttäjän itse käynnistämän täyden uudelleenlatauksen. Luonnoksia vaarantavaa automaattista uudelleenlatausta ei lisätty. Vanha `/info`-reitti säilyy.
- Yhteinen alatunniste lisättiin sivuille, joilta se puuttui. Nykyinen yhteydenottolomake säilyy, ja osoite `asiakaspalvelu@pentulaskuri.com` näkyy myös suorana sähköpostilinkkinä. Lomakkeen Formspree-vastaanottajaa tai todellista viestitoimitusta ei tässä muutoksessa vahvistettu, eikä koeviestejä lähetetty.
- Neljä vanhaa kumppanuusseurantalinkkiä palautti `Invalid link`. Tilalle vaihdettiin tarkistetut suorat kauppalinkit Peten Koiratarvikkeeseen, Haukkulaan ja Muotitassuun sekä poistettiin rikkinäiset seurantakuvat. Suorista linkeistä ei luvata välityspalkkiota. Kumppanuusmyynti edellyttää myöhemmin voimassa olevia, omalta kumppanitililtä saatuja linkkejä.
- Ajastusten julkaisuvalmistelu on tiedostossa `supabase/security/safety_and_images_schedule.sql`: lähteet 30 minuutin välein, keskeneräisten kuvien toimitus ja lähtökuvien siivous minuutin välein. Kaksi ajastusta tarkistettiin oikeassa paikallisessa Supabase-tietokannassa transaktiossa, joka peruttiin kokonaan. Ajastukset eivät ole käytössä pilvessä.
- Tuotannon avaaminen edellyttää erillistä julkaisulupaa, kahden migraation ja kahden Edge Functionin julkaisua, OpenAI-avaimen ja satunnaisen ajastussalaisuuden turvallista tallennusta, Vault-asetuksia, ajastusten käyttöönottoa sekä nimettyä kokeilukäyttäjää. Pilvessä luonti säilyy oletuksena suljettuna, kunnes nämä on tarkistettu. Maksullista myyntiä ei avata tämän julkaisun osana.
- Käyttöönoton jälkeen varmistetaan tuotannosta lähteiden tarkistusajat, kirjautumisen jälkeinen käyttöoikeus ja yksi koko kuvatoimitus. Paikallinen onnistuminen ei ole tuotantovarmennus. Ylläpito tarkistaa budjettikirjanpidon ennen epäselvän pyynnön uudelleen avaamista.

### Varmennettu paikallinen tulos

- 317 yksikkötestiä läpi, yksi ennestään ohitettu testi. 311 projektin selaintestiä läpi. Uuden kokonaisuuden kuusi selaintestiä kattavat 320/768/1024/1440 px:n saavutettavuuden, kirjautumattoman vierailijan käyttöoikeusrajauksen, tiedotteiden paluulinkin ja vanhan moduulin latausvirheen palautumisen. Lisäksi 41 eristettyä tietokanta- ja Storage-käyttöoikeustarkistusta läpi.
- Molemmille todellisille kuvamuokkauksille tehtiin 17 koko paikallisen toimitusketjun tarkistusta. Toisen käyttäjän pääsy työhön, allekirjoitettuun kuvaan ja pentukirjamuistoon estettiin. Julkinen kuvalinkki ei avannut yksityistä kuvaa. Samanaikaiset toistot käyttivät samaa työtä ja samaa pentukirjamuistoa.
- TypeScriptin sovellus-, Node- ja toimintotarkistukset sekä tuotantobuild läpi. ESLint: nolla virhettä ja 146 aiempien tiedostojen varoitusta. Kokeilun uusia ominaisuuksia ei ilmoiteta pilveen julkaistuiksi.
- Esikatselu: `http://127.0.0.1:8088/.cache/feature-review.html`. Erillinen synteettinen käyttäjä ihmismuokkaukselle: sama osoite parametrilla `?account=b`. Oikeaa OpenAI-palvelua käytetään hyväksytyn rajan puitteissa, mutta tuotannon käyttäjätietoja tai pentukirjoja ei muuteta. Selain- ja testitodisteet ovat versionhallinnan ulkopuolisessa paikallisessa tuloskansiossa.

### Jatkoidea: Koti pennun korkeudelta

Käyttäjän videoidea säilyy jatkokehityksessä. Pienin arvioitava versio on yksi etukäteen tuotettu lyhyt, pennun silmien korkeudelta kuvattu kotikierros, jonka yhteydessä käyttäjä etsii kodin vaaranpaikat. Oman kodin kuvien tai videoiden muokkaus olisi erillinen myöhempi kokonaisuus. Videota ei ole toteutettu, sille ei ole valittu maksullista palvelua eikä kuvakokeen budjettia ole käytetty videoon.

### Tarkistetut palvelulähteet

OpenAI: [kuvamuokkaus](https://developers.openai.com/api/reference/resources/images/methods/edit), [malli](https://developers.openai.com/api/docs/models/gpt-image-2.6-flare), [hinnasto](https://developers.openai.com/api/docs/pricing) ja [API-datan käsittely](https://developers.openai.com/api/docs/guides/your-data). Toteutuneessa kustannuksessa tekstisyöte on 5 USD/miljoona tokenia, kuvasyöte 8 USD/miljoona ja kuvatulos 30 USD/miljoona. Käytössä on yksi 1024 × 1024 PNG, low-laatu ja low-complexity. Tilin omia erityisiä datansäilytysehtoja tai EU-käsittelyä ei oletettu.

### Rajatun tuotantokokeilun valmistelu 8.11.2026

Käyttäjä hyväksyi kokonaisuuden tuotantojulkaisun rajattuna kokeiluna, myynnin säilyttämisen suljettuna ja enintään 20 USD:n kuukausibudjetin. Kokeilu rajataan aluksi omistajan vahvistettuun tiliin. Kolmen paikallisen koekuvan 87 199 mikro-USD:n kulut ja ensimmäisen laatukokeen seitsemän jäljellä olevaa kuvaa huomioidaan tuotannon rajoissa ennen kuvien luonnin avaamista.

Kaikille kuudelle sisäiselle asetustaululle lisättiin RLS myös suljetun skeeman käyttöoikeuksien rinnalle. Kaikissa uusissa julkisissa ja yksityisissä ominaisuustauluissa on nyt RLS. Palvelimen service_role-käyttö ja omistajakohtaiset oikeudet varmennettiin uudelleen: 42 eristettyä tietokanta- ja Storage-tarkistusta läpi. Nykyinen GitHubin CI-putki säilytetään julkaisussa. Paikallinen ehdotus sen laajentamisesta lisätietokantatesteihin säilyy työpuussa, koska käytössä oleva GitHub-tunnus ei sisällä työnkulkujen muokkausoikeutta.
