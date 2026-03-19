import { useEffect, useState } from "react";
import ParcSocialChart from "../chart/ParcSocialChart";
import { getParcSocial } from "../services/fetch.js"; 

export default function ParcSocialPage() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [filteredData, setFilteredData] = useState([]);

  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");

  useEffect(() => {
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

        setYears(uniqueYears);

        if (uniqueYears.length > 0) {
          setSelectedYear(uniqueYears[0].toString());
        }
      })
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    if (!data) return;

    let filtered = data;

    if (selectedYear) {
      filtered = filtered.filter(
        item => item.anneePublication?.toString() === selectedYear
      );
    }

    setFilteredData(filtered);
  }, [selectedYear, data]);

  if (error) return <p style={{ color: "red" }}>Erreur : {error}</p>;
  if (!data) return <p>Chargement des données...</p>;

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