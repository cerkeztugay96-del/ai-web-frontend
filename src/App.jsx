import { useState } from "react";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Netlify ortam değişkeninden backend adresi alınıyor
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

      // 🚀 Artık backend ile uyumlu endpoint: /remove-bg
      const response = await fetch(`${API_BASE}/remove-bg`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("İstek başarısız!");
      }

      const data = await response.blob();
      const imageUrl = URL.createObjectURL(data);
      setResultImage(imageUrl);
    } catch (error) {
      console.error("Hata:", error);
      alert("Bir hata oluştu!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Arka Plan Kaldırma</h1>

      <input type="file" onChange={handleFileChange} />
      <br />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Yükleniyor..." : "Yükle ve İşle"}
      </button>

      {resultImage && (
        <div style={{ marginTop: "20px" }}>
          <h2>Sonuç:</h2>
          <img src={resultImage} alt="Sonuç" width="400" />
        </div>
      )}
    </div>
  );
}

export default App;
