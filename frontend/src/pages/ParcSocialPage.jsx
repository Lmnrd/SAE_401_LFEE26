import { useEffect, useState } from "react";
import ParcSocialChart from "../chart/ParcSocialChart";

export default function ParcSocialPage() {
  // États pour gérer les données, erreurs, données filtrées, années et année sélectionnée
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");

  // Effet pour récupérer les données depuis l'API
  useEffect(() => {
    fetch("http://localhost:8000/api/parc-social")
      .then((res) => {
        // Vérification du statut de la réponse HTTP
        if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        // Stockage des données récupérées
        setData(json);

        // Extraction des années uniques depuis les critères des données
        const uniqueYears = [...new Set(json.map(item => item.critere?.anneePublication))].filter(Boolean).sort();
        setYears(uniqueYears);

        // Sélection de l'année la plus récente par défaut
        if (uniqueYears.length > 0) {
          setSelectedYear(uniqueYears[uniqueYears.length - 1].toString());
        } else {
          // Si aucune année, utiliser toutes les données
          setFilteredData(json);
        }
      })
      .catch((err) => setError(err.message));
  }, []);

  // Effet pour filtrer les données en fonction de l'année sélectionnée
  useEffect(() => {
    if (!data) return;

    if (selectedYear) {
      // Filtrage des données pour l'année sélectionnée
      const filtered = data.filter(item => item.critere?.anneePublication?.toString() === selectedYear);
      setFilteredData(filtered);
    } else {
      // Si aucune année sélectionnée, utiliser toutes les données
      setFilteredData(data);
    }
  }, [selectedYear, data]);

  // Gestion des états d'erreur et de chargement
  if (error) return <p style={{ color: "red" }}>Erreur : {error}</p>;
  if (!data) return <p>Chargement des données...</p>;

  // Rendu du composant avec le titre, le sélecteur d'année et le graphique
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
