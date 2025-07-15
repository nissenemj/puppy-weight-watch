
import React from "react";
import { motion } from "framer-motion";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import puppyHero from "./assets/dog1.png";
import dog2 from "./assets/dog2.png";
import dog3 from "./assets/dog3.png";

const testimonials = [
  {
    text: "Helppo käyttää, pentuni kasvaa hienosti!",
    author: "Anna, labradorin omistaja 🐕",
    stars: 5,
    img: dog2,
  },
  {
    text: "Painonseuranta motivoi pitämään huolta!",
    author: "Mikko, corgin omistaja 🐶",
    stars: 5,
    img: dog3,
  },
];

export default function App() {
  return (
    <div className="bg-gradient-to-b from-cute-green to-white min-h-screen font-poppins">
      {/* Hero */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center p-8 md:p-16">
        <motion.img
          src={puppyHero}
          alt="Söpö pentu"
          className="w-48 md:w-64 mx-auto rounded-full shadow-lg"
          whileHover={{ rotate: [0, 10, -10, 0], transition: { duration: 0.8, repeat: Infinity } }}
        />
        <h1 className="text-4xl md:text-5xl font-bold text-fun-orange mt-6 font-fredoka">
          Seuraa pennun kasvua hauskasti! 🐶💕
        </h1>
        <p className="text-lg md:text-xl mt-2 mb-4">
          Painonseuranta, ruokamäärät ja vinkkejä – varmista paras alku pennullesi.
        </p>
        <Button className="bg-fun-orange text-white text-lg px-8 py-4 rounded-full shadow-lg hover:scale-105 transition">
          Luo profiili ilmaiseksi
        </Button>
        <div className="mt-4 text-cute-green font-semibold">
          Jo yli <span className="text-fun-orange font-bold">10 000</span> pentua seurannassa!
        </div>
      </motion.section>

      {/* Ominaisuudet */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 md:p-16">
        <motion.div whileHover={{ scale: 1.05 }}>
          <Card className="flex flex-col items-center p-6 rounded-2xl shadow-lg">
            <span className="text-4xl mb-2">📈</span>
            <h3 className="font-bold text-lg mb-1">Painonseuranta</h3>
            <p className="text-center text-sm">Seuraa kasvukäyrää reaaliajassa!</p>
          </Card>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }}>
          <Card className="flex flex-col items-center p-6 rounded-2xl shadow-lg">
            <span className="text-4xl mb-2">🍲</span>
            <h3 className="font-bold text-lg mb-1">Ruokalaskuri</h3>
            <p className="text-center text-sm">Laske pennun oikea ruokamäärä helposti.</p>
          </Card>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }}>
          <Card className="flex flex-col items-center p-6 rounded-2xl shadow-lg">
            <span className="text-4xl mb-2">❤️</span>
            <h3 className="font-bold text-lg mb-1">Yhteisö</h3>
            <p className="text-center text-sm">Jaa kokemuksia muiden omistajien kanssa.</p>
          </Card>
        </motion.div>
      </section>
      <ul className="flex flex-wrap justify-center gap-4 mb-8">
        <li>📈 Näe kasvukäyrä reaaliajassa!</li>
        <li>🍲 Henkilökohtaiset ruokavinkit!</li>
        <li>❤️ Tuki ja yhteisö!</li>
      </ul>

      {/* Testimonialit */}
      <section className="bg-cute-green/10 py-8">
        <h2 className="text-2xl font-bold text-center mb-6">Mitä käyttäjät sanovat?</h2>
        <div className="flex overflow-x-auto gap-6 px-4">
          {testimonials.map((t, i) => (
            <Card key={i} className="min-w-[250px] p-4 rounded-xl shadow-md">
              <div className="flex items-center gap-2 mb-2">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <span key={j} className="text-fun-orange">★</span>
                ))}
              </div>
              <p className="italic">"{t.text}"</p>
              <div className="flex items-center gap-2 mt-2">
                <img src={t.img} alt="Pentu" className="w-8 h-8 rounded-full" />
                <span className="text-sm">{t.author}</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-10">
        <h3 className="text-xl font-bold mb-2">Aloita nyt – rekisteröidy ja saat ilmaisen pentukirjan!</h3>
        <form className="flex flex-col md:flex-row justify-center items-center gap-2">
          <input
            type="email"
            placeholder="Sähköpostisi"
            className="border rounded-full px-4 py-2"
            required
          />
          <Button className="bg-fun-orange text-white px-6 py-2 rounded-full shadow-lg hover:scale-105 transition">
            Rekisteröidy
          </Button>
        </form>
      </section>

      {/* Footer */}
      <footer className="bg-cute-green/20 py-6 text-center flex flex-col md:flex-row justify-between items-center px-8 gap-4">
        <div className="flex gap-4">
          <a href="/about" className="hover:underline">Tietoa meistä</a>
          <a href="/contact" className="hover:underline">Yhteystiedot</a>
          <a href="/privacy" className="hover:underline">Tietosuoja</a>
        </div>
        <div className="flex gap-3">
          <a href="https://x.com" aria-label="X"><span>🐦</span></a>
          <a href="https://instagram.com" aria-label="Instagram"><span>📸</span></a>
        </div>
      </footer>
    </div>
  );
}
