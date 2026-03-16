import { useEffect, useState } from "react";
import ParcSocialChart from "../chart/ParcSocialChart";

export default function ParcSocialPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/api/parc-social")
      .then((res) => {
        if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        setData(json);
        
        // Extraction des années uniques depuis les critères
        const uniqueYears = [...new Set(json.map(item => item.critere?.anneePublication))].filter(Boolean).sort();
        setYears(uniqueYears);
        
        // Sélection de l'année la plus récente par défaut
        if (uniqueYears.length > 0) {
          setSelectedYear(uniqueYears[uniqueYears.length - 1].toString());
        } else {
          setFilteredData(json);
        }
      })
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    if (!data) return;

    if (selectedYear) {
      const filtered = data.filter(item => item.critere?.anneePublication?.toString() === selectedYear);
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [selectedYear, data]);

  if (error) return <p style={{ color: "red" }}>Erreur : {error}</p>;
  if (!data) return <p>Chargement des données...</p>;

  return (
    <div style={{ maxWidth: "900px", margin: "2rem auto", padding: "0 1rem" }}>
      <h2>Parc Social</h2>

      <div style={{ marginBottom: "2rem" }}>
        <label htmlFor="year-select" style={{ marginRight: "0.5rem", fontWeight: "bold" }}>Année :</label>
        <select
          id="year-select"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          style={{ padding: "0.5rem", borderRadius: "4px" }}
        >
          <option value="">Toutes les années (Cumul global)</option>
          {years.map(y => <option key={y} value={y.toString()}>{y}</option>)}
        </select>
      </div>

      <ParcSocialChart data={filteredData} />
    </div>
  );
}
