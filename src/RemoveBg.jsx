import { useRef, useState } from "react";

export default function RemoveBg() {
  const API_BASE = import.meta.env.VITE_API_BASE;
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);
  const [error, setError] = useState("");

  const pickFile = () => {
    setResultUrl(null);
    setError("");
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadAndProcess(file);
  };

  const uploadAndProcess = async (file) => {
    try {
      setLoading(true);
      setError("");
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch(`${API_BASE}/arka-plan-kaldir`, {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        throw new Error(`Sunucu hatası: ${res.status}`);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
    } catch (err) {
      setError(err.message || "Bilinmeyen hata");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <header className="hero">
        <h2 className="brand">Arka Plan Kaldır</h2>
      </header>

      <main className="card">
        <h1 className="title">Fotoğraf Yükle</h1>
        <p className="hint">Seçtiğin görselden arka plan otomatik kaldırılacak.</p>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          style={{ display: "none" }}
        />

        <button className="cta" onClick={pickFile} disabled={loading}>
          {loading ? "İşleniyor..." : "Görsel Seç ve Yükle"}
        </button>

        {error && <div className="error">⚠️ {error}</div>}

        {resultUrl && (
          <div className="result">
            <img src={resultUrl} alt="Sonuç" />
            <a className="download" href={resultUrl} download="sonuc.png">
              PNG’yi İndir
            </a>
          </div>
        )}
      </main>
    </div>
  );
}
