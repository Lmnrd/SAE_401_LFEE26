import { useEffect, useState } from "react";
import ParcSocialChart from "../chart/ParcSocialChart";
import { getParcSocial } from "../services/fetch.js"; 

export default function ParcSocialPage() {
<<<<<<< HEAD
  // États pour gérer les données, erreurs, données filtrées, années et année sélectionnée
  const [data, setData] = useState(null);
=======
  const [data, setData] = useState([]);
>>>>>>> daebe45c5c7c7cf36c50c4917535eb0719e71866
  const [error, setError] = useState(null);
  const [filteredData, setFilteredData] = useState([]);

  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");

  // Effet pour récupérer les données depuis l'API
  useEffect(() => {
<<<<<<< HEAD
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
=======
    getParcSocial() 
      .then((json) => {
        console.log("DATA:", json);

        setData(json);
        setFilteredData(json);

        const uniqueYears = [...new Set(
          json.map(item => item.anneePublication)
        )]
          .filter(Boolean)
          .sort((a, b) => b - a);

>>>>>>> daebe45c5c7c7cf36c50c4917535eb0719e71866
        setYears(uniqueYears);

        if (uniqueYears.length > 0) {
<<<<<<< HEAD
          setSelectedYear(uniqueYears[uniqueYears.length - 1].toString());
        } else {
          // Si aucune année, utiliser toutes les données
          setFilteredData(json);
=======
          setSelectedYear(uniqueYears[0].toString());
>>>>>>> daebe45c5c7c7cf36c50c4917535eb0719e71866
        }
      })
      .catch((err) => setError(err.message));
  }, []);

  // Effet pour filtrer les données en fonction de l'année sélectionnée
  useEffect(() => {
    if (!data) return;

    let filtered = data;

    if (selectedYear) {
<<<<<<< HEAD
      // Filtrage des données pour l'année sélectionnée
      const filtered = data.filter(item => item.critere?.anneePublication?.toString() === selectedYear);
      setFilteredData(filtered);
    } else {
      // Si aucune année sélectionnée, utiliser toutes les données
      setFilteredData(data);
=======
      filtered = filtered.filter(
        item => item.anneePublication?.toString() === selectedYear
      );
>>>>>>> daebe45c5c7c7cf36c50c4917535eb0719e71866
    }

    setFilteredData(filtered);
  }, [selectedYear, data]);

  // Gestion des états d'erreur et de chargement
  if (error) return <p style={{ color: "red" }}>Erreur : {error}</p>;
  if (!data) return <p>Chargement des données...</p>;

  // Rendu du composant avec le titre, le sélecteur d'année et le graphique
  return (
    <div style={{ maxWidth: "900px", margin: "2rem auto", padding: "0 1rem" }}>
      <h2>Parc Social</h2>

      <div style={{ marginBottom: "2rem" }}>
        <label style={{ marginRight: "0.5rem", fontWeight: "bold" }}>
          Année :
        </label>

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="filter-control"
        >
          <option value="">Toutes les années</option>

          {years.map(y => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <ParcSocialChart data={filteredData} />
    </div>
  );
}