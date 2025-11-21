import React, { useEffect } from 'react'
import { MobileOptimizedLayout } from '@/components/MobileOptimizedLayout'
import { Navigation } from '@/components/Navigation'
import Footer from '@/components/Footer'
import { Section, Container } from '@/components/ui/Layout'
import { trackPageViewed } from '@/utils/analytics'

const PrivacyPolicy = () => {
  useEffect(() => {
    trackPageViewed('Privacy Policy', '/privacy')
  }, [])

  return (
    <MobileOptimizedLayout>
      <Navigation />
      <main id="main-content" className="full-width-section bg-gradient-soft pt-20 md:pt-24">
        <Section className="mobile-container-safe">
          <Container className="content-narrow">
            <h1 className="text-h1 mb-8">Tietosuojaseloste</h1>

            <div className="prose prose-lg max-w-none space-y-6">
              <p className="text-body-lg text-muted mb-8">
                Viimeksi päivitetty: {new Date().toLocaleDateString('fi-FI')}
              </p>

              <section>
                <h2 className="text-h2 mb-4">1. Rekisterinpitäjä</h2>
                <p className="text-body mb-4">
                  Pentulaskuri.com<br />
                  Sähköposti: nissenemj@gmail.com
                </p>
              </section>

              <section>
                <h2 className="text-h2 mb-4">2. Rekisterin nimi</h2>
                <p className="text-body mb-4">
                  Pentulaskuri.com -palvelun käyttäjärekisteri
                </p>
              </section>

              <section>
                <h2 className="text-h2 mb-4">3. Henkilötietojen käsittelyn tarkoitus</h2>
                <p className="text-body mb-4">
                  Käsittelemme henkilötietojasi seuraaviin tarkoituksiin:
                </p>
                <ul className="list-disc list-inside space-y-2 text-body ml-4">
                  <li>Palvelun tarjoaminen ja ylläpito</li>
                  <li>Käyttäjätilin hallinta ja autentikointi</li>
                  <li>Pennun kasvun ja painon seuranta</li>
                  <li>Palvelun kehittäminen ja parantaminen</li>
                  <li>Uutiskirjeen lähettäminen (jos olet tilannut)</li>
                  <li>Yhteydenotto asiakaspalveluasioissa</li>
                </ul>
              </section>

              <section>
                <h2 className="text-h2 mb-4">4. Rekisterin tietosisältö</h2>
                <p className="text-body mb-4">
                  Rekisteriin voidaan tallentaa seuraavia tietoja:
                </p>
                <ul className="list-disc list-inside space-y-2 text-body ml-4">
                  <li>Nimi (vapaaehtoinen)</li>
                  <li>Sähköpostiosoite</li>
                  <li>Salasana (salattu)</li>
                  <li>Koiran tiedot (nimi, rotu, syntymäaika)</li>
                  <li>Painomittaukset ja niiden päivämäärät</li>
                  <li>Pentukirjan merkinnät ja kuvat</li>
                  <li>Palvelun käyttöön liittyvät tekniset tiedot (IP-osoite, selaintyyppi, käyttöjärjestelmä)</li>
                  <li>Analytiikkatiedot (sivukäynnit, toiminnot)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-h2 mb-4">5. Säännönmukaiset tietolähteet</h2>
                <p className="text-body mb-4">
                  Henkilötiedot kerätään:
                </p>
                <ul className="list-disc list-inside space-y-2 text-body ml-4">
                  <li>Käyttäjän itsensä ilmoittamina rekisteröityessä ja palvelua käyttäessä</li>
                  <li>Automaattisesti palvelun käytön yhteydessä (analytiikka, evästeet)</li>
                  <li>Kolmansien osapuolien autentikointipalveluista (esim. Google-kirjautuminen)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-h2 mb-4">6. Tietojen säilytysaika</h2>
                <p className="text-body mb-4">
                  Säilytämme henkilötietojasi niin kauan kuin:
                </p>
                <ul className="list-disc list-inside space-y-2 text-body ml-4">
                  <li>Käyttäjätilisi on aktiivinen</li>
                  <li>Tarvitsemme tietoja lakisääteisten velvoitteidemme täyttämiseksi</li>
                  <li>Tarvitsemme tietoja oikeusvaatimusten käsittelyyn</li>
                </ul>
                <p className="text-body mt-4">
                  Kun poistat tilisi, poistamme kaikki henkilötietosi 30 päivän kuluessa, paitsi tiedot joita meidän on säilytettävä lain nojalla.
                </p>
              </section>

              <section>
                <h2 className="text-h2 mb-4">7. Tietojen luovutukset ja siirrot</h2>
                <p className="text-body mb-4">
                  Emme myy, vuokraa tai luovuta henkilötietojasi kolmansille osapuolille markkinointitarkoituksiin.
                </p>
                <p className="text-body mb-4">
                  Käytämme seuraavia alihankkijoita ja palveluntarjoajia:
                </p>
                <ul className="list-disc list-inside space-y-2 text-body ml-4">
                  <li><strong>Supabase</strong> - Tietokanta ja autentikointi (EU-alue)</li>
                  <li><strong>Vercel/Cloudflare</strong> - Hosting ja CDN (EU-alue)</li>
                </ul>
                <p className="text-body mt-4">
                  Kaikki alihankkijat ovat sitoutuneet GDPR-vaatimuksiin ja käsittelevät tietoja ainoastaan ohjeidemme mukaisesti.
                </p>
              </section>

              <section>
                <h2 className="text-h2 mb-4">8. Rekisterin suojauksen periaatteet</h2>
                <p className="text-body mb-4">
                  Suojaamme henkilötietojasi seuraavilla teknisillä ja organisatorisilla toimenpiteillä:
                </p>
                <ul className="list-disc list-inside space-y-2 text-body ml-4">
                  <li>SSL/TLS-salattu tiedonsiirto (HTTPS)</li>
                  <li>Salasanat tallennetaan salattuna (bcrypt)</li>
                  <li>Tietokannat suojattu palomuurilla ja pääsynhallinnalla</li>
                  <li>Säännölliset tietoturva-auditoinnit</li>
                  <li>Rajoitettu pääsy henkilötietoihin (vain valtuutettu henkilöstö)</li>
                  <li>Säännölliset varmuuskopiot</li>
                </ul>
              </section>

              <section>
                <h2 className="text-h2 mb-4">9. Rekisteröidyn oikeudet</h2>
                <p className="text-body mb-4">
                  Sinulla on oikeus:
                </p>
                <ul className="list-disc list-inside space-y-2 text-body ml-4">
                  <li><strong>Tarkastusoikeus</strong> - Tarkastaa mitä tietoja sinusta on tallennettu</li>
                  <li><strong>Oikeus tietojen oikaisuun</strong> - Korjata virheelliset tai puutteelliset tiedot</li>
                  <li><strong>Oikeus tietojen poistamiseen</strong> - Pyytää tietojesi poistamista ("oikeus tulla unohdetuksi")</li>
                  <li><strong>Oikeus käsittelyn rajoittamiseen</strong> - Rajoittaa tietojesi käsittelyä tietyissä tilanteissa</li>
                  <li><strong>Vastustamisoikeus</strong> - Vastustaa tietojesi käsittelyä</li>
                  <li><strong>Siirto-oikeus</strong> - Saada tietosi koneluettavassa muodossa</li>
                  <li><strong>Oikeus peruuttaa suostumus</strong> - Peruuttaa antamasi suostumus milloin tahansa</li>
                </ul>
                <p className="text-body mt-4">
                  Voit käyttää oikeuksiasi ottamalla yhteyttä sähköpostitse osoitteeseen nissenemj@gmail.com
                </p>
              </section>

              <section>
                <h2 className="text-h2 mb-4">10. Evästeet ja analytiikka</h2>
                <p className="text-body mb-4">
                  Käytämme välttämättömiä evästeitä palvelun toiminnan varmistamiseksi ja analytiikkaevästeitä palvelun kehittämiseen.
                  Lisätietoja evästeiden käytöstä löydät <a href="/cookies" className="text-[var(--color-primary-600)] hover:underline">evästekäytännöstä</a>.
                </p>
              </section>

              <section>
                <h2 className="text-h2 mb-4">11. Tietosuojaselosteen muutokset</h2>
                <p className="text-body mb-4">
                  Voimme päivittää tätä tietosuojaselostetta ajoittain. Ilmoitamme merkittävistä muutoksista palvelussa tai sähköpostitse.
                  Päivitetty tietosuojaseloste tulee voimaan sen julkaisemispäivästä lähtien.
                </p>
              </section>

              <section>
                <h2 className="text-h2 mb-4">12. Valvontaviranomainen</h2>
                <p className="text-body mb-4">
                  Jos koet, että henkilötietojesi käsittelyssä on rikottu tietosuojalainsäädäntöä, sinulla on oikeus tehdä valitus valvontaviranomaiselle:
                </p>
                <p className="text-body">
                  <strong>Tietosuojavaltuutetun toimisto</strong><br />
                  Käyntiosoite: Ratapihantie 9, 6. krs, 00520 Helsinki<br />
                  Postiosoite: PL 800, 00521 Helsinki<br />
                  Puhelinvaihde: 029 566 6700<br />
                  Sähköposti: tietosuoja@om.fi<br />
                  Verkkosivu: <a href="https://tietosuoja.fi" target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary-600)] hover:underline">www.tietosuoja.fi</a>
                </p>
              </section>

              <section>
                <h2 className="text-h2 mb-4">13. Yhteystiedot</h2>
                <p className="text-body mb-4">
                  Jos sinulla on kysymyksiä tietosuojaselosteesta tai henkilötietojesi käsittelystä, ota yhteyttä:
                </p>
                <p className="text-body">
                  Sähköposti: nissenemj@gmail.com
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

export default PrivacyPolicy
