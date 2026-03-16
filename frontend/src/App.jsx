<<<<<<< HEAD
import ParcSocialPage from "./pages/ParcSocialPage";

function App() {
  return (
    <div>
      <h1>Statistiques Logement</h1>
      <ParcSocialPage />
=======
import { useEffect, useState } from "react";
import MapFrance from "./components/MapFrance";

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
      <h1>Ma Carte de France Interactive</h1>
      {data && <p>{data.message}</p>}
      
      {/* Intégration de la carte */}
      <MapFrance />
>>>>>>> 66d7d7d37559777b301626b3300b8ca13dd0ec25
    </div>
  );
}

export default App;