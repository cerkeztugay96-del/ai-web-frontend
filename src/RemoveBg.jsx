import { useState } from "react";

function RemoveBg() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Backend adresi .env’den geliyor
  const API_BASE = import.meta.env.VITE_API_BASE;

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setResultImage(null);
  };

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

      const blob = await response.blob();
      setResultImage(URL.createObjectURL(blob));
    } catch (error) {
      console.error(error);
      alert("Bir hata oluştu, tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="remove-bg">
      <h2>Arka Plan Kaldır</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "İşleniyor..." : "Yükle ve İşle"}
      </button>

      {resultImage && (
        <div className="result">
          <h3>Sonuç</h3>
          <img src={resultImage} alt="Sonuç" />
          <a href={resultImage} download="sonuc.png">
            İndir
          </a>
        </div>
      )}
    </div>
  );
}

export default RemoveBg;
