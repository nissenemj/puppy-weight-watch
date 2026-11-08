# Pentulaskurin jatkokehityssuunnitelma

8.11.2026. Suunnitelma perustuu nykyiseen lähdekoodiin ja tämän keskustelun tuotantotarkistuksiin. Käyttäjämääriä, kysyntää tai kannattavuutta ei ole oletettu. Alla olevat tavoitteet ja työmäärät ovat ehdotuksia, eivät vahvistettuja tuloksia tai aikataulusitoumuksia.

Tavoite on saada koiranomistaja palaamaan omaan pentukirjaansa. Kuvahaaste tuo ensimmäisen onnistumisen, muistojen tallentaminen jatkuvan hyödyn. Turvallisuusseuranta tukee luotettavuutta. Maksullinen tuote valmistellaan vasta, kun näiden käyttö ja toimitus toimivat.

## Nykyisen kokeilun rajat

- Kirjautuminen ja vahvistettu sähköposti vaaditaan. Anonyymi tili ei riitä.
- Kaikkien kuvakäyttäjien yhteinen yläraja on 20 USD kalenterikuukaudessa. Palvelimen kirjanpito käyttää UTC-kuukautta. Aiemmat saman kuukauden koekulut ja keskeneräisten pyyntöjen varaukset sisältyvät rajaan.
- Käyttäjä voi tehdä kaksi kuvapyyntöä ja varata neljä lähtökuvaa päivässä. Myös epäonnistunut kuvapyyntö lasketaan päiväkohtaiseen pyyntörajaan. Epäselvä laskutus pysäyttää uuden kulutuksen tarkistusta varten.
- Alkuperäinen kuva pysyy yksityisenä ja poistuu automaattisessa siivouksessa vuorokauden kuluttua. Valmis kuva ja pentukirjan kopio ovat erillisiä omistajan aineistoja.
- Maksullinen myynti pysyy suljettuna. Peruslaskurit ja nykyiset maksuttomat kirjaominaisuudet säilyvät maksuttomina.

## Toteutusjärjestys

| Järjestys | Muutos ja käyttäjän hyöty                           | Pienin testattava toteutus                                                                                                                                                                                                | Valmis, kun                                                                                                                                                                   |
| --------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1         | Varmista myös uuden asiakkaan kirjautuminen         | Testaa uuden osoitteen rekisteröinti, vahvistusviesti, kirjautuminen ja poistunut istunto tuotannossa. Nykyinen toimiva istunto ei osoita sähköpostitoimituksen toimivan.                                                 | Uusi käyttäjä pääsee kuvaamaan ilman ylläpitäjän apua; virheestä saa ymmärrettävän ohjeen.                                                                                    |
| 2         | Tee käyttörajoista näkyviä ennen kuvan lähettämistä | Näytä palvelimelta käyttäjän jäljellä olevat päivän pyynnöt ja tieto yhteisen kokeilun tauosta. Säilytä samanaikaiset varaukset ja budjettiraja palvelimella.                                                             | Käyttäjä näkee tauon jo ennen lähtökuvan lähettämistä; tietoa ei voi muuttaa selaimesta.                                                                                      |
| 3         | Anna omistajalle kuvien poistaminen ja palaute      | Lisää kuvalle poistaminen sekä palaute: onnistuiko toimitus ja muistuttaako tulos omaa koiraa. Erota alkuperäinen tulos pentukirjan kopiosta ja kerro, kumpi poistuu.                                                     | Toisen käyttäjän kuvan poistaminen estyy; poistettu aineisto ei jää ladattavaksi. Palautteeseen ei tarvita kuvan julkistamista.                                               |
| 4         | Paranna viittä nykyistä tyyliä palautteen avulla    | Vertaa saman koiran tuntomerkkien säilymistä, erityisesti ihmishahmossa. Tarkista eri turkin värit ja muodot ennen uusien tyylien lisäämistä.                                                                             | Tyylikohtaiset ongelmat ja käyttäjäarviot on kirjattu. Uudella tyylillä on vertailu nykyiseen.                                                                                |
| 5         | Helpota paluuta muistoihin ja jakamista             | Tuo valmis kuva heti löydettäväksi omiin kuviin ja pentukirjaan. Valmistele ladattava pystykuvakortti jo syntyneestä kuvasta.                                                                                             | Kortti syntyy ilman uutta maksullista mallipyyntöä. Jakaminen vaatii käyttäjän oman toiminnon.                                                                                |
| 6         | Vahvista turvallisuusseurannan kattavuus            | Tarkista, löytyvätkö lemmikkiruokien takaisinvedot ja koirille olennaiset tautitiedotteet nykyisiltä kahdelta lähdesivulta. Lisää korkeintaan yksi viranomaislähde kerrallaan, lähdekohtaiset testit ja katkosten näyttö. | Tunnetut esimerkkitiedotteet löytyvät, katkos ei näy väitteenä vaarattomuudesta ja alkuperäinen ohje on aina avattavissa. Yleisuutisvirtaa ei lisätä ilman osoitettua hyötyä. |
| 7         | Tee pentukirjasta painettavan kirjan prototyyppi    | Kokoa yksi oikeaa käyttöä vastaava mallikirja ja painoon sopiva PDF. Tarkista kuvien tarkkuus, marginaalit, fontit ja sivujärjestys; tilaa koevedos vasta erikseen hyväksytyllä hinnalla.                                 | Fyysinen koevedos on arvioitu. Valmistus, toimitus, reklamaatiot ja kustannukset tunnetaan ennen myyntilupausta.                                                              |
| 8         | Valmistele yksi automaattinen maksullinen lisätuote | Testaa erillinen muistopaketti ensin maksupalvelun testiympäristössä. Palvelinvahvistus, käyttöoikeus, toimitus, uusintayritys ja peruutus käsitellään yhtenä polkuna.                                                    | Myyjän tiedot ja ehdot on päätetty ja koko polku todennettu. Oikea myynti avataan vain erillisellä luvalla.                                                                   |
| 9         | Kokeile ideaa “Koti pennun korkeudelta”             | Suunnittele yksi lyhyt etukäteen tehty kotikierros ja siihen vaaranpaikkojen etsintä. Arvioi ensin kuvakäsikirjoitus.                                                                                                     | Hyöty on arvioitu ennen videopalvelun valintaa. Videon tekemiselle on oma kustannusarvio ja lupa; kuvien 20 USD:n budjettia ei käytetä videoon.                               |

Ensimmäisen vaiheen karkea työmäärä on 2–4 kehityspäivää kohtiin 1–3. Kohdat 4–6 vievät arviolta 3–6 kehityspäivää palautteen kertymisen lisäksi. Kirjan, maksutuotteen ja videon työmäärät arvioidaan vasta hyväksytyn prototyypin perusteella. Työ tehdään pienissä erikseen testattavissa julkaisuissa.

## Mistä päätetään seuraava askel

Arvioi kokeilu ensimmäisten 20 valmistuneen kuvan jälkeen tai kahden viikon käytön jälkeen. Jos käyttöä kertyy vähän, kirjaa otoskoko; älä päättele kysyntää tai kannattavuutta tyhjästä.

Seuraa ensisijaisesti palvelimen jo tuntemia tietoja: aloitetut pyynnöt, valmistuneet kuvat, virheet, toimituksen uusinnat ja toteutunut kuvakulu. Lisää käyttäjän oma arvio kuvan laadusta sekä tietosuojan kannalta arvioitu lataus- ja kirjatallennusten mittaus. Latausten määrä ei ole tällä hetkellä vahvistettu mittari. Yleistä seurantapalvelua tai kuvien sisältöä ei tarvita ensimmäiseen arvioon.

Ehdotetut jatkamisen ehdot ovat: budjetti ei ylity, toisen käyttäjän aineisto ei avaudu, vähintään 90 % hyväksytyistä kuvapyynnöistä valmistuu ilman ylläpidon apua ja vähintään puolet palautteen antaneista pitää kuvaa säilyttämisen arvoisena. Nämä ovat tavoiterajoja, eivät nykyisen kokeilun tuloksia. Virheellinen käyttöoikeus tai epäselvä veloitus tutkitaan ennen käytön lisäämistä. Kysyntää tai tuloja ei ennusteta ilman havaintoja.

## Erillistä päätöstä vaativat asiat

Budjetin korotus, uusi riippuvuus, uusi maksullinen palvelu, oikean myynnin avaaminen, painokumppanin sopimus ja videotuotanto edellyttävät käyttäjän hyväksyntää. Nykyisen 20 USD:n kuvakokeilun parannukset voidaan valmistella arvioitaviksi ilman näitä sitoumuksia.
