import React, { useEffect } from 'react'
import { MobileOptimizedLayout } from '@/components/MobileOptimizedLayout'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { Section, Container } from '@/components/ui/Layout'
import { trackPageViewed } from '@/utils/analytics'
import { CheckCircle, AlertCircle } from 'lucide-react'

const AccessibilityStatement = () => {
  useEffect(() => {
    trackPageViewed('Accessibility Statement', '/accessibility')
  }, [])

  return (
    <MobileOptimizedLayout>
      <Navigation />
      <main id="main-content" className="full-width-section bg-gradient-soft pt-20 md:pt-24">
        <Section className="mobile-container-safe">
          <Container className="content-narrow">
            <h1 className="text-h1 mb-8">Saavutettavuusseloste</h1>

            <div className="prose prose-lg max-w-none space-y-6">
              <p className="text-body-lg text-muted mb-8">
                Viimeksi päivitetty: {new Date().toLocaleDateString('fi-FI')}
              </p>

              <section>
                <h2 className="text-h2 mb-4">Sitoutumisemme saavutettavuuteen</h2>
                <p className="text-body mb-4">
                  Pentulaskuri.com sitoutuu tekemään palvelustaan saavutettavan kaikille käyttäjille. Pyrimme noudattamaan
                  Web Content Accessibility Guidelines (WCAG) 2.1 -standardin tason AA vaatimuksia ja Euroopan unionin
                  saavutettavuusdirektiiviä (EU 2016/2102).
                </p>
                <p className="text-body mb-4">
                  Tavoitteenamme on, että kaikki käyttäjät – riippumatta heidän kyvyistään tai käyttämistään apuvälineistä
                  – voivat käyttää Palveluamme tehokkaasti ja miellyttävästi.
                </p>
              </section>

              <section>
                <h2 className="text-h2 mb-4">Saavutettavuuden taso</h2>
                <p className="text-body mb-4">
                  Palvelumme täyttää WCAG 2.1 -standardin tason AA vaatimukset osittain. Jatkamme aktiivista työtä
                  täyden vaatimustenmukaisuuden saavuttamiseksi.
                </p>
              </section>

              <section>
                <h2 className="text-h2 mb-4">Saavutettavuusominaisuudet</h2>
                <p className="text-body mb-4">
                  Palveluumme on toteutettu seuraavat saavutettavuusominaisuudet:
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-[var(--color-success-50)] border border-[var(--color-success-200)] rounded-lg">
                    <CheckCircle className="w-5 h-5 text-[var(--color-success-600)] flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-body-lg font-semibold mb-1">Näppäimistönavigaatio</h3>
                      <p className="text-body text-muted">
                        Kaikki toiminnot ovat käytettävissä näppäimistöllä ilman hiirtä. Tab-näppäimellä voit navigoida
                        elementtien välillä ja Enter/Space-näppäimillä aktivoida toimintoja.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-[var(--color-success-50)] border border-[var(--color-success-200)] rounded-lg">
                    <CheckCircle className="w-5 h-5 text-[var(--color-success-600)] flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-body-lg font-semibold mb-1">Ruudunlukijatuki</h3>
                      <p className="text-body text-muted">
                        Palvelu on optimoitu ruudunlukijoille. Käytämme semanttista HTML:ää, ARIA-attribuutteja ja
                        kuvaavia tekstejä varmistaaksemme hyvän käyttökokemuksen ruudunlukijaa käyttäville.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-[var(--color-success-50)] border border-[var(--color-success-200)] rounded-lg">
                    <CheckCircle className="w-5 h-5 text-[var(--color-success-600)] flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-body-lg font-semibold mb-1">Värikontrastit</h3>
                      <p className="text-body text-muted">
                        Tekstin ja taustan väliset kontrastit täyttävät WCAG 2.1 AA -tason vaatimuksen (4.5:1 normaali teksti, 3:1 iso teksti).
                        Tärkeät toiminnot eivät perustu pelkästään väriin.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-[var(--color-success-50)] border border-[var(--color-success-200)] rounded-lg">
                    <CheckCircle className="w-5 h-5 text-[var(--color-success-600)] flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-body-lg font-semibold mb-1">Responsiivinen design</h3>
                      <p className="text-body text-muted">
                        Palvelu toimii kaikilla laitteilla ja näyttöko'oilla. Tukemme myös tekstin suurentamista jopa 200% ilman, että sisältö menee päällekkäin.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-[var(--color-success-50)] border border-[var(--color-success-200)] rounded-lg">
                    <CheckCircle className="w-5 h-5 text-[var(--color-success-600)] flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-body-lg font-semibold mb-1">Selkeät fokusindikaattorit</h3>
                      <p className="text-body text-muted">
                        Kaikilla interaktiivisilla elementeillä on selkeä visuaalinen fokusindikaattori, joka auttaa
                        näppäimistönavigaatiossa.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-[var(--color-success-50)] border border-[var(--color-success-200)] rounded-lg">
                    <CheckCircle className="w-5 h-5 text-[var(--color-success-600)] flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-body-lg font-semibold mb-1">Kuvaavat linkit ja painikkeet</h3>
                      <p className="text-body text-muted">
                        Kaikilla linkeillä ja painikkeilla on kuvaavat tekstit. Vältetään epämääräisiä tekstejä kuten "klikkaa tästä".
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-[var(--color-success-50)] border border-[var(--color-success-200)] rounded-lg">
                    <CheckCircle className="w-5 h-5 text-[var(--color-success-600)] flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-body-lg font-semibold mb-1">Virheviestit ja lomakkeet</h3>
                      <p className="text-body text-muted">
                        Lomakkeet sisältävät selkeät ohjeet ja virheviestit. Virheet ilmoitetaan sekä visuaalisesti että ruudunlukijalle.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-[var(--color-success-50)] border border-[var(--color-success-200)] rounded-lg">
                    <CheckCircle className="w-5 h-5 text-[var(--color-success-600)] flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-body-lg font-semibold mb-1">Riittävät kosketus kohteet</h3>
                      <p className="text-body text-muted">
                        Mobiililaitteilla kaikki kosketuskohteet ovat vähintään 44×44 pikseliä WCAG-suositusten mukaisesti.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-[var(--color-success-50)] border border-[var(--color-success-200)] rounded-lg">
                    <CheckCircle className="w-5 h-5 text-[var(--color-success-600)] flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-body-lg font-semibold mb-1">Animaatioiden hallinta</h3>
                      <p className="text-body text-muted">
                        Kunnioitamme käyttäjän "prefers-reduced-motion" -asetusta. Animaatiot vähenevät tai poistuvat,
                        jos käyttäjä on pyytänyt vähentyneitä liikkeitä.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-h2 mb-4">Tunnetut saavutettavuusongelmat</h2>
                <p className="text-body mb-4">
                  Olemme tietoisia seuraavista saavutettavuusongelmista ja pyrimme korjaamaan ne:
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-[var(--color-warning-50)] border border-[var(--color-warning-200)] rounded-lg">
                    <AlertCircle className="w-5 h-5 text-[var(--color-warning-600)] flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-body-lg font-semibold mb-1">Kaavioiden saavutettavuus</h3>
                      <p className="text-body text-muted">
                        Painokaaviot eivät ole täysin saavutettavia ruudunlukijalla. Työskentelemme datapisteiden
                        tekstimuotoisen esityksen parissa.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-[var(--color-warning-50)] border border-[var(--color-warning-200)] rounded-lg">
                    <AlertCircle className="w-5 h-5 text-[var(--color-warning-600)] flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-body-lg font-semibold mb-1">Kuvien alt-tekstit</h3>
                      <p className="text-body text-muted">
                        Käyttäjien lataamat kuvat eivät automaattisesti sisällä alt-tekstejä. Kehitämme ominaisuutta,
                        joka pyytää käyttäjiä lisäämään kuvaavan tekstin kuville.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-h2 mb-4">Testatut ympäristöt</h2>
                <p className="text-body mb-4">
                  Olemme testanneet palvelun saavutettavuuden seuraavissa ympäristöissä:
                </p>
                <ul className="list-disc list-inside space-y-2 text-body ml-4">
                  <li><strong>Selaimet:</strong> Google Chrome, Mozilla Firefox, Safari, Microsoft Edge (uusimmat versiot)</li>
                  <li><strong>Ruudunlukijat:</strong> NVDA (Windows), JAWS (Windows), VoiceOver (macOS, iOS), TalkBack (Android)</li>
                  <li><strong>Laitteet:</strong> Windows PC, Mac, iPhone, iPad, Android-puhelimet ja -tabletit</li>
                  <li><strong>Apuvälineet:</strong> Näppäimistönavigaatio, suurennettu teksti, korkean kontrastin tila</li>
                </ul>
              </section>

              <section>
                <h2 className="text-h2 mb-4">Jatkuva parantaminen</h2>
                <p className="text-body mb-4">
                  Saavutettavuus on jatkuva prosessi. Teemme säännöllisesti:
                </p>
                <ul className="list-disc list-inside space-y-2 text-body ml-4">
                  <li>Automaattisia saavutettavuustestejä (axe-core)</li>
                  <li>Manuaalisia käyttäjätestauk sia</li>
                  <li>Koodiarvioita saavutettavuuden näkökulmasta</li>
                  <li>Käyttäjäpalautteen keräämistä ja analysointia</li>
                </ul>
                <p className="text-body mt-4">
                  Päivitämme Palvelua säännöllisesti saavutettavuuden parantamiseksi ja uusien standardien noudattamiseksi.
                </p>
              </section>

              <section>
                <h2 className="text-h2 mb-4">Palaute ja yhteystiedot</h2>
                <p className="text-body mb-4">
                  Otamme mielellämme vastaan palautetta Palvelun saavutettavuudesta. Jos kohtaat saavutettavuusongelmia
                  tai haluat antaa ehdotuksia saavutettavuuden parantamiseksi, ota yhteyttä:
                </p>
                <p className="text-body mb-4">
                  Sähköposti: nissenemj@gmail.com
                </p>
                <p className="text-body mb-4">
                  Pyrimme vastaamaan kaikkiin saavutettavuuteen liittyviin yhteydenottoihin 5 työpäivän kuluessa.
                  Jos ongelma on kriittinen, yritämme ratkaista sen mahdollisimman pian.
                </p>
              </section>

              <section>
                <h2 className="text-h2 mb-4">Täytäntöönpanomenettely</h2>
                <p className="text-body mb-4">
                  Jos huomaat puutteita palvelun saavutettavuudessa, anna ensin palautetta meille sivuston ylläpitäjälle.
                  Vastauksessa voi mennä 14 päivää. Jos et ole tyytyväinen saamaasi vastaukseen tai et saa vastausta
                  lainkaan kahden viikon aikana, voit tehdä ilmoituksen puutteesta Etelä-Suomen aluehallintovirastoon.
                </p>
                <p className="text-body mb-4">
                  <strong>Etelä-Suomen aluehallintovirasto</strong><br />
                  Saavutettavuuden valvonnan yksikkö<br />
                  <a href="https://www.saavutettavuusvaatimukset.fi" target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary-600)] hover:underline">
                    www.saavutettavuusvaatimukset.fi
                  </a><br />
                  Sähköposti: saavutettavuus@avi.fi<br />
                  Puhelinvaihde: 0295 016 000
                </p>
              </section>

              <section>
                <h2 className="text-h2 mb-4">Hyödyllisiä resursseja</h2>
                <p className="text-body mb-4">
                  Lisätietoja verkkosivustojen saavutettavuudesta:
                </p>
                <ul className="list-disc list-inside space-y-2 text-body ml-4">
                  <li>
                    <a href="https://www.w3.org/WAI/WCAG21/quickref/" target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary-600)] hover:underline">
                      WCAG 2.1 Quick Reference (englanniksi)
                    </a>
                  </li>
                  <li>
                    <a href="https://www.saavutettavuusvaatimukset.fi" target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary-600)] hover:underline">
                      Saavutettavuusvaatimukset.fi
                    </a>
                  </li>
                  <li>
                    <a href="https://www.papunet.net/tietoa/saavutettavuus" target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary-600)] hover:underline">
                      Papunet - Saavutettavuus
                    </a>
                  </li>
                </ul>
              </section>

              <section className="bg-[var(--color-primary-50)] border-l-4 border-[var(--color-primary-500)] p-4 rounded-r-lg">
                <p className="text-body font-semibold mb-2">
                  Kiitos palautteestasi!
                </p>
                <p className="text-body">
                  Palautteesi auttaa meitä tekemään Pentulaskuri.com:sta paremman ja saavutettavamman kaikille käyttäjille.
                  Olemme sitoutuneet jatkuvaan parantamiseen ja arvostamme jokaista ehdotusta. 🐾
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

export default AccessibilityStatement
