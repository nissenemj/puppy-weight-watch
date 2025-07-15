
import React from "react";
import "./App.css";
import dog1 from "./assets/dog1.png";
import dog2 from "./assets/dog2.png";
import dog3 from "./assets/dog3.png";

function App() {
  return (
    <div className="main-bg">
      <header>
        <div className="logo">Tipp</div>
        <nav>
          <a href="/">Etusivu</a>
          <a href="/palvelut">Palvelut</a>
          <a href="/yhteys">Yhteys</a>
          <button>Kirjaudu</button>
        </nav>
      </header>
      <section className="hero">
        <div className="side-menu">
          <button>Etusivu</button>
          <button>Palvelut</button>
          <button>Yhteys</button>
        </div>
        <div className="hero-content">
          <img src={dog1} alt="Söpö koira" className="hero-dog" />
          <h1>Tervetuloa!</h1>
          <p>Löydä parhaat vinkit lemmikeille</p>
        </div>
        <div className="side-menu right">
          <button>FAQ</button>
          <button>Ota yhteyttä</button>
          <button>Lisää</button>
        </div>
      </section>
      <section className="info-grid">
        <div className="info-card">Tietoa 1</div>
        <div className="info-card">Tietoa 2</div>
        <div className="info-card">Tietoa 3</div>
        <div className="info-card">Tietoa 4</div>
      </section>
      <section className="dogs-bottom">
        <img src={dog2} alt="Koirakuva" />
        <img src={dog3} alt="Koirakuva" />
      </section>
      <section className="info-grid bottom">
        <div className="info-card">Palvelu 1</div>
        <div className="info-card">Palvelu 2</div>
        <div className="info-card">Palvelu 3</div>
        <div className="info-card">Palvelu 4</div>
      </section>
    </div>
  );
}

export default App;
