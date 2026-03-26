import { useEffect, useState } from "react";
import ParcSocialChart from "../chart/ParcSocialChart";
import "../css_pages/parcSocial.css";
import { getParcSocial } from "../services/fetch.js";

export default function ParcSocialPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [filteredData, setFilteredData] = useState([]);

  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");

  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");

  const [names, setNames] = useState([]);
  const [selectedName, setSelectedName] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/api/parc-social")
      .then((res) => {
        if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        setData(json);
        setFilteredData(json);

        const uniqueYears = [...new Set(json.map(item => item.critere?.anneePublication))]
          .filter(Boolean)
          .sort((a, b) => b - a);
        setYears(uniqueYears);

        const uniqueRegions = [...new Set(json.map(item => item.critere?.nomRegion))]
          .filter(Boolean)
          .sort();
        setRegions(uniqueRegions);

        const uniqueNames = [...new Set(json.map(item => item.critere?.nomDepartement))]
          .filter(Boolean)
          .sort();
        setNames(uniqueNames);
      })
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    if (!data) return;

    let filtered = data;

    if (selectedYear) {
      filtered = filtered.filter(
        item => item.critere?.anneePublication?.toString() === selectedYear
      );
    }

    if (selectedRegion) {
      filtered = filtered.filter(
        item => item.critere?.nomRegion === selectedRegion
      );
    }

    if (selectedName) {
      filtered = filtered.filter(
        item => item.critere?.nomDepartement === selectedName
      );
    }

    setFilteredData(filtered);
  }, [selectedYear, selectedRegion, selectedName, data]);

  if (error) return <p style={{ color: "red" }}>Erreur : {error}</p>;
  if (!data) return <p>Chargement des données...</p>;

  return (
    <div className="parc-page-wrapper">
      <h1 className="parc-page-title">Tableau de bord - Parc Social</h1>

      <div className="parc-filters">
        <div className="parc-filter-item">
          <label htmlFor="year-select">Année Publication</label>
          <select
            id="year-select"
            className="parc-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="">Toutes les années</option>
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <div className="parc-filter-item">
          <label htmlFor="region-select">Région</label>
          <select
            id="region-select"
            className="parc-select"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
          >
            <option value="">Toutes les régions</option>
            {regions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>

        <div className="parc-filter-item">
          <label htmlFor="dept-select">Département</label>
          <select
            id="dept-select"
            className="parc-select"
            value={selectedName}
            onChange={(e) => setSelectedName(e.target.value)}
          >
            <option value="">Tous les départements</option>
            {names.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>

        <div className="parc-filter-item">
          <button
            className="parc-reset-btn"
            onClick={() => {
              setSelectedYear("");
              setSelectedRegion("");
              setSelectedName("");
            }}
          >
            Réinitialiser
          </button>
        </div>
      </div>

      <div className="parc-content">
        <ParcSocialChart data={filteredData} />
      </div>
    </div>
  );
}