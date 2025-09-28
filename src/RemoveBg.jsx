function RemoveBg() {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Arka Plan Kaldır</h1>
      <p>
        Buraya fotoğraf yükleyip arka planını kaldırabileceksin. 
        (Şimdilik demo sayfa)
      </p>
      <input type="file" />
      <br /><br />
      <button style={{ padding: "10px 20px" }}>Yükle ve Kaldır</button>
    </div>
  );
}

export default RemoveBg;
