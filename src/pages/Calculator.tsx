import React, { useEffect } from 'react';
import Footer from '@/components/Footer';
import AdvancedFoodCalculator from '@/components/AdvancedFoodCalculator';
import SEO from '@/components/SEO';
import FAQ from '@/components/FAQ';
import { createCalculatorSchema, createFAQSchema, createBreadcrumbSchema } from '@/utils/structuredData';
import { trackPageViewed } from '@/utils/analytics';
import { Calculator as CalculatorIcon, Sparkles, TrendingUp, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { entranceAnimations } from '@/animations';
import { Badge } from '@/components/ui/badge';
import MeshBackground from '@/components/MeshBackground';

const Calculator = () => {
  useEffect(() => {
    trackPageViewed('Calculator', '/calculator');
  }, []);

  const faqs = [{
    question: "Kuinka paljon ruokaa pentu tarvitsee painon mukaan?",
    answer: "Ruokamäärä lasketaan elopainokiloa kohden. Pienet rodut (1-5 kg): 42g/kg 6 viikon iässä, vähennetään 31g/kg 7 kuukauteen mennessä. Suuret rodut (10-20 kg): 26g/kg 6 viikon iässä, vähennetään 19g/kg 8 kuukauteen mennessä. Esimerkki: 4kg, 5kk ikäinen pentu tarvitsee noin 136g päivässä."
  }, {
    question: "Kuinka monta kertaa päivässä pentua tulisi ruokkia?",
    answer: "7-10 viikkoa: 4 kertaa päivässä. 3-4 kuukautta: 3 kertaa päivässä. 4-6 kuukautta: 3 kertaa päivässä. 6-7 kuukautta: 2 kertaa päivässä. Vuoden ikäisenä: 1-2 kertaa päivässä. Sopiva ruokintaväli on noin 4 tuntia."
  }, {
    question: "Tulisiko kuivaruoan nappulat turvottaa pennulle?",
    answer: "Kyllä, turvottaminen on suositeltavaa pennuille, joiden hampaat ovat vielä kehittymässä. Kuivaruoan nappuloilla menee 'jokunen tunti turvota'. Lämpimällä vedellä turvottaminen on nopeampaa. Turvottaminen varmistaa riittävän nesteyden saannin."
  }, {
    question: "Milloin voin lopettaa nappuloiden turvottamisen?",
    answer: "Noin 5 kuukauden iässä voi lopettaa pienen koiran ruoan kostuttamisen. Hampaiden vaihtuminen tapahtuu 3-7 kuukauden ikäisenä. Siirtymä tehdään asteittain: ensin turvotettuna, sitten maistellen kuivia, lopulta kokonaan kuivina kun hampaat ovat kehittyneet riittävästi."
  }, {
    question: "Kuinka paljon raakaruokaa pentu tarvitsee?",
    answer: "Raakaruokinnassa pentu syö keskimäärin 2,5-3% oletetusta aikuispainosta. Määrät ovat aina suuntaa antavia ja ruokamäärää tulee säätää pennun painokehityksen mukaan. Seuraa pennun kasvua ja säädä määriä tarpeen mukaan."
  }, {
    question: "Miten seurata pennun ruokamäärien riittävyyttä?",
    answer: "Seuraa pennun painokehitystä ja säädä ruokamäärää tarpeen mukaan. Pentu tulisi pitää hoikkana ja hyvässä kunnossa. Kylkiluut tulee tuntua kevyesti ihon ja ohuen rasvakerroksen alta. Tarjoa ruokaa tiettyinä ruoka-aikoina noin 15 minuutin ajan."
  }, {
    question: "Miksi pennulle ei voi antaa aikuisen koiran ruokaa?",
    answer: "Penturuoka sisältää enemmän energiaa ja proteiinia kuin aikuisen koiran ruoka. Aikuisten koirien ruoka on pennulle liian kevyttä nopeaan kasvuun ja kehitykseen. Valitse pennulle aina laadukas, lihapitoinen penturuoka, joka tukee optimaalista kasvua."
  }, {
    question: "Mitä hyötyä kuivien nappuloiden syömisestä on?",
    answer: "Kuivat nappulat auttavat tukemaan suuhygieniaa nappuloiden mekaanisen harjausvaikutuksen ansiosta. Aikuinen koira voi syödä kuivaruokaa kuivana, kunhan vettä on jatkuvasti saatavilla. Kuivat nappulat ovat parempia koiran hampaille kuin turvonneet."
  }];

  const structuredData = [
    createCalculatorSchema(),
    createFAQSchema(faqs),
    createBreadcrumbSchema([{
      name: "Etusivu",
      url: window.location.origin
    }, {
      name: "Pentulaskuri",
      url: `${window.location.origin}/calculator`
    }])
  ];

  variants = { entranceAnimations.staggerContainer }
  className = "max-w-3xl mx-auto space-y-6"
    >
            <motion.div variants={entranceAnimations.staggerChild}>
              <Badge variant="secondary" className="bg-white border-stone-200 text-stone-600 px-4 py-1.5 text-sm shadow-sm">
                <CalculatorIcon className="w-3.5 h-3.5 mr-2 text-terracotta-500" />
                Tarkka ruokalaskuri
              </Badge>
            </motion.div>

            <motion.h1
              variants={entranceAnimations.staggerChild}
              className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-stone-900 tracking-tight"
            >
              Pentulaskuri <br />
              <span className="text-terracotta-500">Ruokamäärät</span>
            </motion.h1>

            <motion.p
              variants={entranceAnimations.staggerChild}
              className="text-lg text-stone-600 leading-relaxed max-w-xl mx-auto"
            >
              Laske koiranpentusi optimaalinen päivittäinen ruokamäärä huomioiden rodun, iän, painon ja aktiivisuustason.
            </motion.p>

            <motion.div
              variants={entranceAnimations.staggerChild}
              className="flex flex-wrap justify-center gap-6 pt-4"
            >
              <div className="flex items-center gap-2 text-stone-600 font-medium">
                <CheckCircle className="w-5 h-5 text-sage-500" />
                <span>Tarkat tulokset</span>
              </div>
              <div className="flex items-center gap-2 text-stone-600 font-medium">
                <CheckCircle className="w-5 h-5 text-sage-500" />
                <span>Ammattimaiset suositukset</span>
              </div>
            </motion.div>
          </motion.div >
        </div >
      </section >

  {/* Calculator Section */ }
  < section className = "container px-4 md:px-6 mx-auto max-w-4xl" >
    <AdvancedFoodCalculator user={null} />
      </section >

  {/* FAQ Section */ }
  < section className = "container px-4 md:px-6 mx-auto max-w-3xl" >
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-4">Usein kysytyt kysymykset</h2>
          <p className="text-lg text-stone-600">
            Kattava opas koiranpennun ruokintaan ja ruokamäärien laskentaan
          </p>
        </div>
        <FAQ items={faqs} />
      </section >

  <Footer />
    </div >
  );
};

export default Calculator;