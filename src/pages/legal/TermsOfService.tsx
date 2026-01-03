import React, { useEffect } from 'react'
import { MobileOptimizedLayout } from '@/components/MobileOptimizedLayout'
import { Navigation } from '@/components/Navigation'
import Footer from '@/components/Footer'
import { Section, Container } from '@/components/ui/Layout'
import { trackPageViewed } from '@/utils/analytics'

const TermsOfService = () => {
  useEffect(() => {
    trackPageViewed('Terms of Service', '/terms')
  }, [])

  return (
    <MobileOptimizedLayout>
      <Navigation />
      <main id="main-content" className="full-width-section bg-gradient-soft pt-20 md:pt-24">
        <Section className="mobile-container-safe">
          <Container className="content-narrow">
            <h1 className="text-h1 mb-8">Käyttöehdot</h1>

            <div className="prose prose-lg max-w-none space-y-6">
              <p className="text-body-lg text-muted-foreground mb-8">
                Viimeksi päivitetty: {new Date().toLocaleDateString('fi-FI')}
              </p>

              <section>
                <h2 className="text-h2 mb-4">1. Palvelun kuvaus</h2>
                <p className="text-body mb-4">
                  Pentulaskuri.com ("Palvelu") on verkkopohjainen sovellus, joka auttaa koiranomistajia seuraamaan koiransa kasvua,
                  laskemaan ruoka-annoksia ja tallentamaan muistoja pentukirjaan. Palvelu on maksuton käyttäjille ja tarjotaan
                  "sellaisena kuin se on" -periaatteella.
                </p>
              </section>

              <section>
                <h2 className="text-h2 mb-4">2. Käyttöehtojen hyväksyminen</h2>
                <p className="text-body mb-4">
                  Rekisteröitymällä ja käyttämällä Palvelua hyväksyt nämä käyttöehdot sitovasti. Jos et hyväksy käyttöehtoja,
                  älä käytä Palvelua.
                </p>
              </section>

              <section>
                <h2 className="text-h2 mb-4">3. Käyttäjän velvollisuudet</h2>
                <p className="text-body mb-4">Käyttäjänä sitoudut:</p>
                <ul className="list-disc list-inside space-y-2 text-body ml-4">
                  <li>Antamaan totuudenmukaisia tietoja rekisteröityessä</li>
                  <li>Pitämään käyttäjätilisi salasanan turvassa</li>
                  <li>Olemaan jakamatta käyttäjätiliäsi muiden kanssa</li>
                  <li>Käyttämään Palvelua vain laillisiin tarkoituksiin</li>
                  <li>Olemaan loukkaamatta muiden käyttäjien tai kolmansien osapuolten oikeuksia</li>
                  <li>Olemaan lataamatta haittaohjelmia tai muuta haitallista sisältöä</li>
                  <li>Olemaan yrittämättä murtautua Palveluun tai häiritä sen toimintaa</li>
                  <li>Noudattamaan kaikkia sovellettavia lakeja ja säädöksiä</li>
                </ul>
              </section>

              <section>
                <h2 className="text-h2 mb-4">4. Palvelun käyttö</h2>
                <p className="text-body mb-4">
                  Palvelu on tarkoitettu yksityishenkilöiden omaan käyttöön koiriensa kasvun seuraamiseen. Kaupallinen käyttö
                  ilman kirjallista lupaa on kielletty.
                </p>
                <p className="text-body mb-4">
                  Sinulla on oikeus käyttää Palvelua henkilökohtaisiin, ei-kaupallisiin tarkoituksiin. Meillä on oikeus rajoittaa,
                  keskeyttää tai lopettaa pääsysi Palveluun ilman ennakkoilmoitusta, jos rikot näitä käyttöehtoja.
                </p>
              </section>

              <section>
                <h2 className="text-h2 mb-4">5. Käyttäjän sisältö</h2>
                <p className="text-body mb-4">
                  Säilytät omistusoikeuden kaikkeen sisältöön, jonka lataat Palveluun (kuvat, tekstit, painotiedot jne.).
                  Myönnät meille kuitenkin rajoitetun, ei-yksinomaisen, maailmanlaajuisen, rojaltivapaan lisenssin käyttää,
                  tallentaa ja näyttää sisältöäsi Palvelun tarjoamiseksi sinulle.
                </p>
                <p className="text-body mb-4">
                  Et saa ladata Palveluun sisältöä, joka:
                </p>
                <ul className="list-disc list-inside space-y-2 text-body ml-4">
                  <li>Rikkoo tekijänoikeuksia tai muita immateriaalioikeuksia</li>
                  <li>On laitonta, loukkaavaa, uhkaavaa tai sopima tonta</li>
                  <li>Sisältää haittaohjelmia tai viruksia</li>
                  <li>Loukkaa muiden yksityisyyttä</li>
                  <li>Sisältää eläinten väkivaltaa tai eläinten kaltoinkohtelua</li>
                </ul>
                <p className="text-body mt-4">
                  Meillä on oikeus poistaa sisältö, joka rikkoo näitä ehtoja.
                </p>
              </section>

              <section>
                <h2 className="text-h2 mb-4">6. Tietoturva ja yksityisyys</h2>
                <p className="text-body mb-4">
                  Käsittelemme henkilötietojasi <a href="/privacy" className="text-[var(--color-primary-600)] hover:underline">tietosuojaselosteen</a> mukaisesti.
                  Vaikka teemme parhaamme tietojesi suojaamiseksi, emme voi taata 100% tietoturvaa internetissä.
                  Käytät Palvelua omalla vastuullasi.
                </p>
              </section>

              <section>
                <h2 className="text-h2 mb-4">7. Terveyssuositukset ja vastuunrajoitukset</h2>
                <p className="text-body mb-4 font-semibold text-[var(--color-warning)]">
                  TÄRKEÄ HUOMAUTUS:
                </p>
                <p className="text-body mb-4">
                  Palvelu tarjoaa yleisiä ohjeita ja suosituksia pennun kasvusta ja ruokinnasta. Nämä tiedot eivät korvaa
                  eläinlääkärin ammattimaista neuvontaa. Ota aina yhteyttä eläinlääkäriin, jos:
                </p>
                <ul className="list-disc list-inside space-y-2 text-body ml-4">
                  <li>Koirasi kasvaa epänormaalin hitaasti tai nopeasti</li>
                  <li>Huomaat terveysongelmia tai käyttäytymismuutoksia</li>
                  <li>Olet epävarma ruokinnan määrästä tai laadusta</li>
                  <li>Koirallasi on erityisruokavalio tai terveydellisiä rajoituksia</li>
                </ul>
                <p className="text-body mt-4">
                  Emme ole vastuussa mahdollisista vahingoista, jotka aiheutuvat Palvelun käytöstä tai siinä annettujen
                  neuvojen noudattamisesta.
                </p>
              </section>

              <section>
                <h2 className="text-h2 mb-4">8. Vastuunrajoitukset</h2>
                <p className="text-body mb-4">
                  Palvelu tarjotaan "sellaisena kuin se on" ilman minkäänlaisia takuita. Emme takaa, että Palvelu:
                </p>
                <ul className="list-disc list-inside space-y-2 text-body ml-4">
                  <li>Toimii keskeytyksettä tai virheettömästi</li>
                  <li>On turvallinen tai vapaa haittaohjelmista</li>
                  <li>Tuottaa tarkkoja tai täydellisiä tuloksia</li>
                  <li>Vastaa tarkkapiirteisesti kuvauksia</li>
                </ul>
                <p className="text-body mt-4">
                  Käytät Palvelua omalla vastuullasi. Emme ole vastuussa välittömistä, välillisistä tai seurannaisvahingoista,
                  jotka johtuvat Palvelun käytöstä tai käyttämättömyydestä, mukaan lukien:
                </p>
                <ul className="list-disc list-inside space-y-2 text-body ml-4">
                  <li>Tietojen menetys tai vioittuminen</li>
                  <li>Liiketoiminnan keskeytys</li>
                  <li>Taloudellinen menetys</li>
                  <li>Eläimen terveyteen liittyvät ongelmat</li>
                </ul>
              </section>

              <section>
                <h2 className="text-h2 mb-4">9. Immateriaalioikeudet</h2>
                <p className="text-body mb-4">
                  Kaikki Palvelun sisältö, rakenne, design, koodi, logot ja muut materiaalit ovat Pentulaskuri.com:n tai
                  sen lisenssinantajien omaisuutta ja suojattuja tekijänoikeus-, tavaramerkki- ja muilla immateriaalioikeuksilla.
                </p>
                <p className="text-body mb-4">
                  Et saa kopioida, muokata, jakaa, myydä tai käyttää mitään Palvelun sisältöä ilman kirjallista lupaa.
                </p>
              </section>

              <section>
                <h2 className="text-h2 mb-4">10. Linkit kolmansien osapuolten sivustoille</h2>
                <p className="text-body mb-4">
                  Palvelu voi sisältää linkkejä kolmansien osapuolten verkkosivustoille. Emme ole vastuussa näiden sivustojen
                  sisällöstä, tietosuojakäytännöistä tai toiminnasta. Linkitys ei tarkoita, että hyväksymme tai suosittelemme näitä sivustoja.
                </p>
              </section>

              <section>
                <h2 className="text-h2 mb-4">11. Palvelun muutokset ja lopettaminen</h2>
                <p className="text-body mb-4">
                  Meillä on oikeus milloin tahansa:
                </p>
                <ul className="list-disc list-inside space-y-2 text-body ml-4">
                  <li>Muuttaa, keskeyttää tai lopettaa Palvelu kokonaan tai osittain</li>
                  <li>Muuttaa Palvelun ominaisuuksia ja toiminnallisuuksia</li>
                  <li>Asettaa rajoituksia Palvelun käytölle</li>
                  <li>Päivittää näitä käyttöehtoja</li>
                </ul>
                <p className="text-body mt-4">
                  Pyrimme ilmoittamaan merkittävistä muutoksista etukäteen, mutta meillä on oikeus tehdä muutoksia ilman ennakkoilmoitusta.
                </p>
              </section>

              <section>
                <h2 className="text-h2 mb-4">12. Käyttöehtojen muutokset</h2>
                <p className="text-body mb-4">
                  Voimme päivittää näitä käyttöehtoja ajoittain. Ilmoitamme merkittävistä muutoksista Palvelussa tai sähköpostitse.
                  Palvelun jatkuva käyttö muutosten jälkeen tarkoittaa, että hyväksyt päivitetyt käyttöehdot.
                </p>
              </section>

              <section>
                <h2 className="text-h2 mb-4">13. Tilin sulkeminen</h2>
                <p className="text-body mb-4">
                  Voit sulkea tilisi milloin tahansa asetuksista. Pidätämme oikeuden sulkea tai jäädyttää tilisi, jos:
                </p>
                <ul className="list-disc list-inside space-y-2 text-body ml-4">
                  <li>Rikot näitä käyttöehtoja</li>
                  <li>Tiliäsi käytetään petokselliseen toimintaan</li>
                  <li>Käytät Palvelua tavalla, joka voi vahingoittaa meitä tai muita käyttäjiä</li>
                  <li>Tiliäsi ei ole käytetty yli 24 kuukauteen</li>
                </ul>
              </section>

              <section>
                <h2 className="text-h2 mb-4">14. Sovellettava laki ja riitojen ratkaisu</h2>
                <p className="text-body mb-4">
                  Näihin käyttöehtoihin sovelletaan Suomen lakia. Kaikki Palveluun liittyvät riidat ratkaistaan ensisijaisesti
                  neuvottelemalla. Jos riitojen ratkaisua ei neuvottelemalla saavuteta, riita ratkaistaan Suomen tuomioistuimissa.
                </p>
              </section>

              <section>
                <h2 className="text-h2 mb-4">15. Yhteystiedot</h2>
                <p className="text-body mb-4">
                  Jos sinulla on kysymyksiä näistä käyttöehdoista, ota yhteyttä:
                </p>
                <p className="text-body">
                  Sähköposti: nissenemj@gmail.com
                </p>
              </section>

              <section className="bg-[var(--color-warning-50)] border-l-4 border-[var(--color-warning-500)] p-4 rounded-r-lg">
                <p className="text-body font-semibold mb-2">
                  Muistathan:
                </p>
                <p className="text-body">
                  Tämä Palvelu on informatiivinen työkalu. Ota aina yhteyttä eläinlääkäriin koirasi terveyttä
                  koskevissa kysymyksissä. Olemme vastuullisia koiranomistajia yhdessä! 🐾
                </p>
              </section>
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
      <div className="h-20 md:hidden" aria-hidden="true" />
    </MobileOptimizedLayout>
  )
}

export default TermsOfService
