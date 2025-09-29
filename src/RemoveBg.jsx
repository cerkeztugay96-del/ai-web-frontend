import { useState } from "react";

function RemoveBg() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Backend Render URL
  const API_BASE = "https://ai-web-backend-1.onrender.com";

  // Dosya seçildiğinde çalışır
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setResultImage(null);
  };

  // Dosyayı backend’e gönder
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Lütfen bir dosya seçin!");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/arka-plan-kaldir`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Sunucudan hata döndü");
      }

      // Backend’den gelen dosyayı blob olarak al
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setResultImage(imageUrl);
    } catch (error) {
      alert("Bir hata oluştu: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="remove-bg-container" style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>Arka Plan Kaldır</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "İşleniyor..." : "Yükle ve İşle"}
      </button>

      {resultImage && (
        <div style={{ marginTop: "20px" }}>
          <h3>Sonuç:</h3>
          <img src={resultImage} alt="Sonuç" style={{ maxWidth: "100%", border: "1px solid #ccc" }} />
          <a href={resultImage} download="output.png">
            <button style={{ marginTop: "10px" }}>İndir</button>
          </a>
        </div>
      )}
    </div>
  );
}

export default RemoveBg;
