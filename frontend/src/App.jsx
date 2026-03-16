import { useEffect, useState } from "react";
import ParcSocialPage from "./pages/ParcSocialPage";
import MapFrance from "./components/MapFrance";
import ParcSocialPage from "./pages/ParcSocialPage";

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/test")
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.error("API error:", err));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Statistiques Logement & Carte Interactive</h1>
      
      {/* Test de l'API de base */}
      {data && <p>{data.message}</p>}
<<<<<<< HEAD
      
      {/* Historique: Graphiques du Parc Social */}
      <ParcSocialPage />

      {/* Intégration de la nouvelle carte */}
      <MapFrance />
=======

      {/* Intégration de la carte */}
      <MapFrance />

      {/* Statistiques Logement */}
      <ParcSocialPage />
>>>>>>> 6333a75b89a9cef42f3280dcc9539dab0ec605e4
    </div>
  );
}

export default App;