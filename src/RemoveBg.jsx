import { useState, useRef } from "react";

/**
 * Arka plan kaldırma sayfası (tam sürüm)
 * - CORS/preflight için ekstra header YOK (tarayıcı boundary'i otomatik ekler)
 * - Hata yakalama ve kullanıcıya mesaj gösterme var
 * - İlk istekler yavaşsa (model indiriliyor) uyarı metni var
 * - Console.log'lar ekli (Network debug için)
 */
export default function RemoveBg() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [resultUrl, setResultUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const inputRef = useRef(null);

  // .env varsa onu kullan, yoksa Render URL'ine düş
  const API_BASE =
    (import.meta.env && import.meta.env.VITE_API_BASE
      ? String(import.meta.env.VITE_API_BASE).replace(/\/$/, "")
      : "https://ai-web-backend-1.onrender.com");

  const ENDPOINT = `${API_BASE}/arka-plan-kaldir`;

  const reset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResultUrl(null);
    setMsg("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    reset();
    if (!file) return;

    // Basit boyut ve tip kontrolü (isteğe bağlı)
    const okTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!okTypes.includes(file.type)) {
      setMsg("Lütfen PNG/JPG/WEBP türünde bir görsel seçin.");
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setMsg("Dosya boyutu 15MB'ı geçmemeli.");
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMsg("Lütfen bir dosya seçin.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    setLoading(true);
    setMsg("İşleniyor... (İlk çalıştırmada 5–20 sn sürebilir)");
    setResultUrl(null);

    try {
      console.log("👉 API_BASE:", API_BASE);
      console.log("👉 POST:", ENDPOINT);

      // DİKKAT: headers eklemiyoruz (özellikle Content-Type) → preflight'ı gereksiz tetikler
      const resp = await fetch(ENDPOINT, {
        method: "POST",
        body: formData,
      });

      console.log("👉 Response status:", resp.status, resp.statusText);

      if (!resp.ok) {
        // JSON hata dönerse yakala
        let detail = "";
        try {
          const j = await resp.clone().json();
          detail = j?.error || JSON.stringify(j);
        } catch {
          detail = await resp.clone().text();
        }
        throw new Error(`HTTP ${resp.status} – ${detail || "Sunucu hatası"}`);
      }

      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      setMsg("✅ Tamam! Aşağıdan sonucu indirebilirsin.");
    } catch (err) {
      console.error("👉 Hata:", err);
      // Tipik CORS/network hatası için kullanıcı dostu mesaj
      if (String(err).includes("Failed to fetch")) {
        setMsg(
          "Ağ isteği başarısız. Backend adresi, CORS veya internet bağlantısı sorunlu olabilir."
        );
      } else {
        setMsg(String(err.message || err));
      }
    } finally {
      setLoading(false);
    }
  };

  const testBackend = async () => {
    setMsg("Backend testi yapılıyor...");
    try {
      const url = `${API_BASE}/`;
      console.log("👉 GET:", url);
      const r = await fetch(url);
      const txt = await r.text();
      console.log("👉 GET / cevap:", r.status, txt);
      setMsg(`Backend test: ${r.status} – ${txt}`);
    } catch (e) {
      console.error(e);
      setMsg("Backend test başarısız (GET /).");
    }
  };

  return (
    <div className="page" style={{ maxWidth: 900, margin: "0 auto" }}>
      <h2>Arka Plan Kaldır</h2>

      <div style={{ marginTop: 10 }}>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>

      {previewUrl && (
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 13, color: "#666" }}>
            Seçilen dosya: <b>{selectedFile?.name}</b>
          </div>
          <img
            src={previewUrl}
            alt="Önizleme"
            style={{
              maxWidth: "100%",
              marginTop: 8,
              borderRadius: 8,
              border: "1px solid #ddd",
            }}
          />
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        <button
          className="cta"
          onClick={handleUpload}
          disabled={loading || !selectedFile}
        >
          {loading ? "İşleniyor..." : "Yükle ve İşle"}
        </button>

        <button
          className="cta"
          onClick={testBackend}
          disabled={loading}
          style={{ marginLeft: 10, background: "#6c757d" }}
          title="Backend / endpoint hızlı sağlık testi"
        >
          Bağlantıyı Test Et
        </button>

        <button
          className="cta"
          onClick={reset}
          disabled={loading}
          style={{ marginLeft: 10, background: "#999" }}
        >
          Sıfırla
        </button>
      </div>

      {msg && (
        <div style={{ marginTop: 12, color: msg.startsWith("✅") ? "#2e7d32" : "#c62828" }}>
          {msg}
        </div>
      )}

      {resultUrl && (
        <div className="result" style={{ marginTop: 20 }}>
          <h3>Sonuç</h3>
          <img
            src={resultUrl}
            alt="Sonuç"
            style={{
              maxWidth: "100%",
              borderRadius: 8,
              border: "1px solid #ddd",
            }}
          />
          <a
            className="download"
            href={resultUrl}
            download="sonuc.png"
            style={{ display: "inline-block", marginTop: 10 }}
          >
            İndir
          </a>
        </div>
      )}
    </div>
  );
}
