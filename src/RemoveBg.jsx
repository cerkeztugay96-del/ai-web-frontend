import { useState } from "react";

function RemoveBg() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE; // .env içindeki backend adresi

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
        throw new Error("Arka plan kaldırma başarısız oldu.");
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setResultImage(imageUrl);
    } catch (error) {
      console.error(error);
      alert("Bir hata oluştu!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Arka Plan Kaldırma</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <br />
      <button
        onClick={handleUpload}
        disabled={loading}
        style={{
          marginTop: "10px",
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        {loading ? "İşleniyor..." : "Yükle ve İşle"}
      </button>

      {resultImage && (
        <div style={{ marginTop: "20px" }}>
          <h3>Sonuç</h3>
          <img
            src={resultImage}
            alt="Sonuç"
            style={{ maxWidth: "100%", border: "1px solid #ddd", borderRadius: "8px" }}
          />
          <br />
          <a
            href={resultImage}
            download="sonuc.png"
            style={{
              display: "inline-block",
              marginTop: "10px",
              padding: "10px 20px",
              backgroundColor: "#2196F3",
              color: "white",
              textDecoration: "none",
              borderRadius: "5px",
            }}
          >
            İndir
          </a>
        </div>
      )}
    </div>
  );
}

export default RemoveBg;
