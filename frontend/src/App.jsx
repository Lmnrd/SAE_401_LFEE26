import { useEffect, useState } from "react";
import ParcSocialPage from "./pages/ParcSocialPage";
import MapFrance from "./components/MapFrance";
import TauxLogementsPage from "./pages/TauxLogements";
import Navbar from "./pages/Navbar"

function App() {
  const [data, setData] = useState(null);
  const [page, setPage] = useState("main"); // POUR LA NAVIGATION VERS LES PAGES

  useEffect(() => {
    fetch("http://localhost:8000/api/test")
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.error("API error:", err));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <Navbar />

      <h1>Statistiques Logement & Carte Interactive</h1>

      {/* Test de l'API de base */}
      {data && <p>{data.message}</p>}

      {/* Intégration de la carte */}
      <MapFrance />
    </div >
  );
}

export default App;