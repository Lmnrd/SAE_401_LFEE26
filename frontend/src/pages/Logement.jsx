import { useEffect, useState } from "react";
import LogementChart from "../chart/LogementChart";
import "../css_pages/tauxLogements.css";
import { getLogements } from "../services/fetch";

export default function LogementsPage() {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [error, setError] = useState(null);

    const [years, setYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState("");

    const [names, setNames] = useState([]);
    const [selectedName, setSelectedName] = useState("");

    const [regions, setRegions] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState("");

    useEffect(() => {
        getLogements()
            .then((json) => {
                console.log("DATA LOGEMENTS:", json);
                console.log("PREMIER ELEMENT :", json[0]);

                setData(json);
                setFilteredData(json);

                const uniqueYears = [...new Set(
                    json.map(item => item.critere?.anneePublication)
                )]
                    .filter(Boolean)
                    .sort((a, b) => b - a);

                const uniqueNames = [...new Set(
                    json.map(item => item.critere?.nomDepartement)
                )]
                    .filter(Boolean)
                    .sort();

                const uniqueRegions = [...new Set(
                    json.map(item => item.critere?.nomRegion)
                )]
                    .filter(Boolean)
                    .sort();

                setYears(uniqueYears);
                setNames(uniqueNames);
                setRegions(uniqueRegions);
            })
            .catch((err) => setError(err.message));
    }, []);

    useEffect(() => {
        let filtered = data;

        if (selectedYear) {
            filtered = filtered.filter(
                item => item.critere?.anneePublication?.toString() === selectedYear
            );
        }

        if (selectedName) {
            filtered = filtered.filter(
                item => item.critere?.nomDepartement === selectedName
            );
        }

        if (selectedRegion) {
            filtered = filtered.filter(
                item => item.critere?.nomRegion === selectedRegion
            );
        }

        setFilteredData(filtered);
    }, [selectedYear, selectedName, selectedRegion, data]);

    if (error) return <p style={{ color: "red" }}>Erreur : {error}</p>;
    if (!data) return <p>Chargement des données...</p>;

    return (
        <div className="taux-page-wrapper">
            <h1 className="taux-page-title">Tableau de bord - Logements</h1>

            <div className="taux-filters">
                <div className="taux-filter-item">
                    <label htmlFor="year-select">Année Publication</label>
                    <select
                        id="year-select"
                        className="taux-select"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                    >
                        <option value="">Toutes les années</option>
                        {years.map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </div>

                <div className="taux-filter-item">
                    <label htmlFor="dept-select">Département</label>
                    <select
                        id="dept-select"
                        className="taux-select"
                        value={selectedName}
                        onChange={(e) => setSelectedName(e.target.value)}
                    >
                        <option value="">Tous les départements</option>
                        {names.map(name => (
                            <option key={name} value={name}>{name}</option>
                        ))}
                    </select>
                </div>

                <div className="taux-filter-item">
                    <label htmlFor="region-select">Région</label>
                    <select
                        id="region-select"
                        className="taux-select"
                        value={selectedRegion}
                        onChange={(e) => setSelectedRegion(e.target.value)}
                    >
                        <option value="">Toutes les régions</option>
                        {regions.map(region => (
                            <option key={region} value={region}>{region}</option>
                        ))}
                    </select>
                </div>

                <div className="taux-filter-item">
                    <button
                        className="filter-button"
                        onClick={() => {
                            setSelectedYear("");
                            setSelectedName("");
                            setSelectedRegion("");
                        }}
                    >
                        Reset
                    </button>
                </div>
            </div>

            <div className="taux-content">
                <LogementChart data={filteredData} />
            </div>
        </div>
    );
}