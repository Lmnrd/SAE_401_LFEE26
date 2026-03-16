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
    </div>
  );
}

export default App;