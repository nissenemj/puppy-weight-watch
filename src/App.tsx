
import React from "react";
import { motion } from "framer-motion";
// HUOM: Button ja Card oletetaan löytyvän shadcn-ui:sta, muokkaa importtia tarvittaessa
import { Button, Card } from "@/components/ui";
import dog1 from "./assets/dog1.png";
import dog2 from "./assets/dog2.png";
import dog3 from "./assets/dog3.png";

const testimonials = [
  {
    text: "Helppo käyttää, pentuni kasvaa hienosti!",
    author: "Anna, labradorin omistaja 🐕",
    stars: 5,
    img: dog1
  },
  {
    text: "Yhteisöstä saa tukea ja vinkkejä!",
    author: "Mikko, corgin omistaja 🐶",
    stars: 5,
    img: dog2
  },
  {
    text: "Ruokalaskuri on superkätevä!",
    author: "Sari, villakoiran omistaja 🐩",
    stars: 5,
    img: dog3
  }
];

function App() {
  return (
    <div className="bg-gradient-to-b from-cute-green to-white min-h-screen font-heading">
      {/* Hero */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center p-10">
        <motion.img
          src={dog1}
          alt="Söpö pentu"
          className="w-64 mx-auto rounded-full shadow-lg"
          whileHover={{ rotate: [0, 10, -10, 0], transition: { duration: 0.6, repeat: Infinity } }}
        />
        <h1 className="text-5xl font-bold text-fun-orange mt-6">Seuraa pennun kasvua hauskasti! 🐶💕</h1>
        <p className="text-xl mt-2">Painonseuranta, ruokamäärät ja vinkkejä – varmista paras alku pennullesi.</p>
        <Button className="bg-fun-orange text-white text-lg px-8 py-4 mt-6 rounded-full shadow-lg hover:scale-105 transition">
          Luo profiili ilmaiseksi
        </Button>
        <div className="mt-4 text-cute-green font-bold text-lg">Jo yli 10 000 pentua seurannassa!</div>
      </motion.section>

      {/* Ominaisuudet */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 max-w-5xl mx-auto">
        <motion.div whileHover={{ scale: 1.05 }}>
          <Card>
            <div className="flex flex-col items-center">
              <img src={dog1} alt="Painonseuranta" className="w-12 mb-2" />
              <h3 className="font-playful text-xl">Painonseuranta</h3>
              <p className="text-center">📈 Näe kasvukäyrä reaaliajassa!</p>
            </div>
          </Card>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }}>
          <Card>
            <div className="flex flex-col items-center">
              <img src={dog2} alt="Ruokalaskuri" className="w-12 mb-2" />
              <h3 className="font-playful text-xl">Ruokalaskuri</h3>
              <p className="text-center">🍲 Laske oikea ruokamäärä helposti!</p>
            </div>
          </Card>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }}>
          <Card>
            <div className="flex flex-col items-center">
              <img src={dog3} alt="Yhteisö" className="w-12 mb-2" />
              <h3 className="font-playful text-xl">Yhteisö</h3>
              <p className="text-center">❤️ Tukea ja vinkkejä muilta omistajilta!</p>
            </div>
          </Card>
        </motion.div>
      </section>

      {/* Testimonialit */}
      <section className="bg-white py-8">
        <h2 className="text-3xl font-bold text-center mb-6">Käyttäjien kokemuksia</h2>
        <div className="flex overflow-x-auto gap-4 px-4">
          {testimonials.map((t, i) => (
            <Card key={i} className="min-w-[300px] p-4 flex flex-col items-center">
              <img src={t.img} alt="Pentu" className="w-16 h-16 rounded-full mb-2" />
              <div className="flex mb-2">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <span key={j}>⭐</span>
                ))}
              </div>
              <p className="italic">"{t.text}"</p>
              <div className="mt-2 font-bold">{t.author}</div>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-10">
        <h3 className="text-2xl font-bold mb-2">Aloita nyt – rekisteröidy ja saat ilmaisen pentukirjan!</h3>
        <form className="flex flex-col md:flex-row justify-center items-center gap-2 mt-4">
          <input type="email" placeholder="Sähköposti" className="border rounded-full px-4 py-2" />
          <Button className="bg-fun-orange text-white px-6 py-2 rounded-full">Rekisteröidy</Button>
        </form>
      </section>

      {/* Footer */}
      <footer className="bg-cute-green text-white py-6 flex flex-col md:flex-row justify-between items-center px-8 rounded-t-3xl">
        <div className="flex gap-4 mb-2 md:mb-0">
          <a href="/about">Tietoa meistä</a>
          <a href="/contact">Yhteystiedot</a>
          <a href="/privacy">Tietosuoja</a>
        </div>
        <div className="flex gap-4">
          <a href="https://x.com"><span className="text-2xl">X</span></a>
          <a href="https://instagram.com"><span className="text-2xl">IG</span></a>
        </div>
      </footer>
    </div>
  );
}

export default App;
