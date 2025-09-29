import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import RemoveBg from "./RemoveBg";

function Home() {
  return (
    <div className="page">
      {/* Üst renkli header alanı */}
      <header className="hero">
        <h2 className="brand">Yapay Zeka Araçları</h2>
        <nav className="nav">
          <a href="#">Araçlar</a>
          <a href="#">Fiyatlandırma</a>
          <a href="#">Giriş</a>
        </nav>
      </header>

      {/* Video Arka Planlı Başlık */}
      <section className="intro">
        <video autoPlay muted loop className="bg-video">
          <source src="/ilteray.mp4" type="video/mp4" />
        </video>
        <div className="overlay">
          <h1 className="title">AI ile Fotoğraf Düzenleme</h1>
          <p className="subtitle">
            Arka plan kaldır, fotoğraf netleştir, dosya çevir — hepsi tek bir yerde!
          </p>
        </div>
      </section>

      {/* Araç kartları */}
      <section className="tools">
        <Link to="/arka-plan-kaldir" className="card">
          <h3>Arka Plan Kaldır</h3>
          <p>Fotoğraflarınızdan arka planı saniyeler içinde kaldırın.</p>
        </Link>
        <div className="card">
          <h3>Fotoğraf Netleştir</h3>
          <p>Bulanık fotoğraflarınızı yapay zeka ile daha net hale getirin.</p>
        </div>
        <div className="card">
          <h3>Dosya Çevir</h3>
          <p>PNG, JPG ve diğer formatlar arasında kolayca dönüştürün.</p>
        </div>
      </section>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/arka-plan-kaldir" element={<RemoveBg />} />
      </Routes>
    </Router>
  );
}
