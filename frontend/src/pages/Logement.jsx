import { useEffect, useState } from "react";
import LogementChart from "../chart/LogementChart";
import "../css_pages/logement.css";
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
        <div className="logement-page-wrapper">
            <h1 className="logement-page-title">Tableau de bord - Logements</h1>

            <div className="logement-filters">
                <div className="logement-filter-item">
                    <label htmlFor="year-select">Année Publication</label>
                    <select
                        id="year-select"
                        className="logement-select"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                    >
                        <option value="">Toutes les années</option>
                        {years.map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </div>

                <div className="logement-filter-item">
                    <label htmlFor="dept-select">Département</label>
                    <select
                        id="dept-select"
                        className="logement-select"
                        value={selectedName}
                        onChange={(e) => setSelectedName(e.target.value)}
                    >
                        <option value="">Tous les départements</option>
                        {names.map(name => (
                            <option key={name} value={name}>{name}</option>
                        ))}
                    </select>
                </div>

                <div className="logement-filter-item">
                    <label htmlFor="region-select">Région</label>
                    <select
                        id="region-select"
                        className="logement-select"
                        value={selectedRegion}
                        onChange={(e) => setSelectedRegion(e.target.value)}
                    >
                        <option value="">Toutes les régions</option>
                        {regions.map(region => (
                            <option key={region} value={region}>{region}</option>
                        ))}
                    </select>
                </div>

                <div className="logement-filter-item">
                    <button
                        className="logement-reset-btn"
                        onClick={() => {
                            setSelectedYear("");
                            setSelectedName("");
                            setSelectedRegion("");
                        }}
                    >
                        Réinitialiser
                    </button>
                </div>
            </div>

            <div className="logement-content">
                <LogementChart data={filteredData} />
            </div>
        </div>
    );
}