import { useEffect, useState } from "react";
import ParcSocialPage from "./pages/ParcSocialPage";
import MapFrance from "./components/MapFrance";
<<<<<<< HEAD
import TauxLogementsPage from "./pages/TauxLogements";
=======
>>>>>>> 562e7d5df9a5cc30a69eb520494d43e83a44bf96

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
<<<<<<< HEAD
      <h1>Statistiques Logement & Carte Interactive</h1>
=======
      <h1>Carte Interactive</h1>
>>>>>>> 562e7d5df9a5cc30a69eb520494d43e83a44bf96

      {/* Test de l'API de base */}
      {data && <p>{data.message}</p>}

<<<<<<< HEAD
      {/* Historique: Graphiques du Parc Social */}
=======
>>>>>>> 562e7d5df9a5cc30a69eb520494d43e83a44bf96
      <ParcSocialPage />
      <MapFrance />
<<<<<<< HEAD


      {/* Intégration de la carte */}
      <MapFrance />


      {/* Taux Logements */}
      <TauxLogementsPage />
=======
>>>>>>> 562e7d5df9a5cc30a69eb520494d43e83a44bf96
    </div>
  );
}

export default App;