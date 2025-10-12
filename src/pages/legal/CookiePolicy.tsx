import React, { useEffect } from 'react'
import { MobileOptimizedLayout } from '@/components/MobileOptimizedLayout'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { Section, Container } from '@/components/ui/Layout'
import { trackPageViewed } from '@/utils/analytics'

const CookiePolicy = () => {
  useEffect(() => {
    trackPageViewed('Cookie Policy', '/cookies')
  }, [])

  return (
    <MobileOptimizedLayout>
      <Navigation />
      <main id="main-content" className="full-width-section bg-gradient-soft pt-20 md:pt-24">
        <Section className="mobile-container-safe">
          <Container className="content-narrow">
            <h1 className="text-h1 mb-8">Evästekäytäntö</h1>

            <div className="prose prose-lg max-w-none space-y-6">
              <p className="text-body-lg text-muted mb-8">
                Viimeksi päivitetty: {new Date().toLocaleDateString('fi-FI')}
              </p>

              <section>
                <h2 className="text-h2 mb-4">1. Mitä evästeet ovat?</h2>
                <p className="text-body mb-4">
                  Evästeet (cookies) ovat pieniä tekstitiedostoja, jotka tallentuvat laitteellesi (tietokone, tabletti, älypuhelin),
                  kun vierailet verkkosivustolla. Evästeet auttavat verkkosivustoa tunnistamaan laitteesi ja tallentamaan tietoja
                  vierailustasi.
                </p>
                <p className="text-body mb-4">
                  Evästeitä käytetään parantamaan käyttökokemustasi, analysoimaan sivuston käyttöä ja tarjoamaan
                  henkilökohtaisempaa sisältöä.
                </p>
              </section>

              <section>
                <h2 className="text-h2 mb-4">2. Miten käytämme evästeitä?</h2>
                <p className="text-body mb-4">
                  Pentulaskuri.com käyttää evästeitä seuraaviin tarkoituksiin:
                </p>
                <ul className="list-disc list-inside space-y-2 text-body ml-4">
                  <li><strong>Välttämättömät evästeet</strong> - Palvelun perustoimintojen mahdollistamiseen</li>
                  <li><strong>Toiminnalliset evästeet</strong> - Käyttökokemuksen parantamiseen ja asetusten tallentamiseen</li>
                  <li><strong>Analytiikkaevästeet</strong> - Sivuston käytön analysointiin ja palvelun kehittämiseen</li>
                </ul>
              </section>

              <section>
                <h2 className="text-h2 mb-4">3. Käyttämämme evästeet</h2>

                <div className="space-y-6">
                  <div className="border-l-4 border-[var(--color-primary-500)] pl-4">
                    <h3 className="text-h3 mb-2">Välttämättömät evästeet</h3>
                    <p className="text-body mb-2">
                      Nämä evästeet ovat välttämättömiä Palvelun toiminnan kannalta. Ilman näitä evästeitä Palvelu ei toimi kunnolla.
                    </p>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-[var(--color-border)] mt-4">
                        <thead>
                          <tr>
                            <th className="px-4 py-2 text-left text-body-sm font-semibold">Evästeen nimi</th>
                            <th className="px-4 py-2 text-left text-body-sm font-semibold">Tarkoitus</th>
                            <th className="px-4 py-2 text-left text-body-sm font-semibold">Säilytysaika</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--color-border)]">
                          <tr>
                            <td className="px-4 py-2 text-body">sb-access-token</td>
                            <td className="px-4 py-2 text-body">Käyttäjän autentikointi</td>
                            <td className="px-4 py-2 text-body">Istunto</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 text-body">sb-refresh-token</td>
                            <td className="px-4 py-2 text-body">Istunnon uusiminen</td>
                            <td className="px-4 py-2 text-body">7 päivää</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 text-body">analytics_session</td>
                            <td className="px-4 py-2 text-body">Istunnon seuranta</td>
                            <td className="px-4 py-2 text-body">Istunto</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="border-l-4 border-[var(--color-secondary-500)] pl-4">
                    <h3 className="text-h3 mb-2">Toiminnalliset evästeet</h3>
                    <p className="text-body mb-2">
                      Nämä evästeet tallentavat käyttäjän valintoja ja asetuksia parantaakseen käyttökokemusta.
                    </p>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-[var(--color-border)] mt-4">
                        <thead>
                          <tr>
                            <th className="px-4 py-2 text-left text-body-sm font-semibold">Evästeen nimi</th>
                            <th className="px-4 py-2 text-left text-body-sm font-semibold">Tarkoitus</th>
                            <th className="px-4 py-2 text-left text-body-sm font-semibold">Säilytysaika</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--color-border)]">
                          <tr>
                            <td className="px-4 py-2 text-body">theme</td>
                            <td className="px-4 py-2 text-body">Teeman valinta (vaalea/tumma)</td>
                            <td className="px-4 py-2 text-body">1 vuosi</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 text-body">language</td>
                            <td className="px-4 py-2 text-body">Kielivalinta</td>
                            <td className="px-4 py-2 text-body">1 vuosi</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 text-body">onboarding_complete</td>
                            <td className="px-4 py-2 text-body">Perehdytyksen tila</td>
                            <td className="px-4 py-2 text-body">1 vuosi</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="border-l-4 border-[var(--color-tertiary-500)] pl-4">
                    <h3 className="text-h3 mb-2">Analytiikkaevästeet</h3>
                    <p className="text-body mb-2">
                      Nämä evästeet keräävät nimettömiä tilastotietoja siitä, miten käyttäjät käyttävät Palvelua.
                      Tiedot auttavat meitä kehittämään Palvelua paremmaksi.
                    </p>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-[var(--color-border)] mt-4">
                        <thead>
                          <tr>
                            <th className="px-4 py-2 text-left text-body-sm font-semibold">Evästeen nimi</th>
                            <th className="px-4 py-2 text-left text-body-sm font-semibold">Tarkoitus</th>
                            <th className="px-4 py-2 text-left text-body-sm font-semibold">Säilytysaika</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--color-border)]">
                          <tr>
                            <td className="px-4 py-2 text-body">_pww_analytics</td>
                            <td className="px-4 py-2 text-body">Sivuston käytön seuranta</td>
                            <td className="px-4 py-2 text-body">30 päivää</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 text-body">_pww_session_id</td>
                            <td className="px-4 py-2 text-body">Istunnon tunnistus</td>
                            <td className="px-4 py-2 text-body">Istunto</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p className="text-body text-muted mt-2 text-sm italic">
                      Huom: Analytiikkaevästeet ovat käytössä vain, jos olet hyväksynyt analytiikan käyttöehdoissa
                      tai evästeasetuksissa.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-h2 mb-4">4. Kolmannen osapuolen evästeet</h2>
                <p className="text-body mb-4">
                  Käytämme seuraavia kolmannen osapuolen palveluja, jotka voivat asettaa evästeitä:
                </p>
                <ul className="list-disc list-inside space-y-2 text-body ml-4">
                  <li>
                    <strong>Supabase</strong> - Autentikointi- ja tietokantapalvelu.
                    Asettaa teknisiä evästeitä kirjautumisen ylläpitämiseksi.
                  </li>
                  <li>
                    <strong>Vercel/Cloudflare</strong> - Hosting ja CDN-palvelu.
                    Asettaa teknisiä evästeitä turvallisuuden ja suorituskyvyn parantamiseksi.
                  </li>
                </ul>
                <p className="text-body mt-4">
                  Näiden palvelujen tietosuojakäytännöt:
                </p>
                <ul className="list-disc list-inside space-y-2 text-body ml-4">
                  <li>
                    <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary-600)] hover:underline">
                      Supabase Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary-600)] hover:underline">
                      Vercel Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary-600)] hover:underline">
                      Cloudflare Privacy Policy
                    </a>
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-h2 mb-4">5. Evästeiden hallinta</h2>
                <p className="text-body mb-4">
                  Voit hallita evästeitä seuraavilla tavoilla:
                </p>

                <h3 className="text-h3 mb-2 mt-4">Selaimen asetukset</h3>
                <p className="text-body mb-4">
                  Useimmat selaimet hyväksyvät evästeet oletuksena, mutta voit muuttaa selaimen asetuksia kieltääksesi evästeet
                  tai saadaksesi ilmoituksen, kun eväste asetetaan. Huomaa, että evästeiden estäminen voi vaikuttaa Palvelun toimivuuteen.
                </p>
                <p className="text-body mb-4">
                  Ohjeet evästeiden hallintaan eri selaimissa:
                </p>
                <ul className="list-disc list-inside space-y-2 text-body ml-4">
                  <li>
                    <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary-600)] hover:underline">
                      Google Chrome
                    </a>
                  </li>
                  <li>
                    <a href="https://support.mozilla.org/fi/kb/evasteiden-poistaminen" target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary-600)] hover:underline">
                      Mozilla Firefox
                    </a>
                  </li>
                  <li>
                    <a href="https://support.apple.com/fi-fi/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary-600)] hover:underline">
                      Safari
                    </a>
                  </li>
                  <li>
                    <a href="https://support.microsoft.com/fi-fi/windows/evasteiden-poistaminen-ja-hallinta-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary-600)] hover:underline">
                      Microsoft Edge
                    </a>
                  </li>
                </ul>

                <h3 className="text-h3 mb-2 mt-6">Analytiikkaevästeiden esto</h3>
                <p className="text-body mb-4">
                  Voit estää analytiikkaevästeiden käytön:
                </p>
                <ul className="list-disc list-inside space-y-2 text-body ml-4">
                  <li>Muuttamalla käyttäjäasetuksiasi Palvelussa (tulossa)</li>
                  <li>Käyttämällä selaimen "Do Not Track" -ominaisuutta</li>
                  <li>Asentamalla mainosten ja seurannan estäviä selainlaajennuksia</li>
                </ul>
              </section>

              <section>
                <h2 className="text-h2 mb-4">6. Local Storage ja Session Storage</h2>
                <p className="text-body mb-4">
                  Evästeiden lisäksi käytämme selaimen paikallista tallennustilaa (Local Storage ja Session Storage)
                  tietojen tallentamiseen laitteellesi. Nämä teknologiat toimivat samalla tavalla kuin evästeet,
                  mutta niiden tietosisältö ei lähetä automaattisesti palvelimelle jokaisella pyynnöllä.
                </p>
                <p className="text-body mb-4">
                  Käytämme näitä teknologioita:
                </p>
                <ul className="list-disc list-inside space-y-2 text-body ml-4">
                  <li>Käyttäjän asetusten tallentamiseen</li>
                  <li>Välimuistin hallintaan (parempi suorituskyky)</li>
                  <li>Offline-toiminnallisuuden mahdollistamiseen</li>
                </ul>
              </section>

              <section>
                <h2 className="text-h2 mb-4">7. Muutokset evästekäytäntöön</h2>
                <p className="text-body mb-4">
                  Voimme päivittää tätä evästekäytäntöä ajoittain. Ilmoitamme merkittävistä muutoksista Palvelussa
                  tai sähköpostitse. Suosittelemme tarkistamaan tämän sivun säännöllisesti pysyäksesi ajan tasalla
                  evästeiden käytöstä.
                </p>
              </section>

              <section>
                <h2 className="text-h2 mb-4">8. Lisätiedot</h2>
                <p className="text-body mb-4">
                  Jos sinulla on kysymyksiä evästekäytännöstämme, ota yhteyttä:
                </p>
                <p className="text-body">
                  Sähköposti: nissenemj@gmail.com
                </p>
                <p className="text-body mt-4">
                  Lisätietoja tietosuojastamme löydät <a href="/privacy" className="text-[var(--color-primary-600)] hover:underline">tietosuojaselosteesta</a>.
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

export default CookiePolicy
