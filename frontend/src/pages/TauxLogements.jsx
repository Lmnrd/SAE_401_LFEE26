import { useEffect, useState } from "react";
import TauxLogementsChart from "../chart/TauxLogementsChart";
import "../css_pages/tauxLogements.css";
import { getTauxLogement } from "../services/fetch.js";

export default function TauxLogementsPage() {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [filteredData, setFilteredData] = useState([]);

    const [years, setYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState("");

    const [names, setNames] = useState([]);
    const [selectedName, setSelectedName] = useState("");
    const [regions, setRegions] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState("");

    useEffect(() => {
        getTauxLogement()
            .then((json) => {
                console.log("DATA:", json);

                setData(json);
                setFilteredData(json);

                const uniqueYears = [...new Set(
                    json.map(item => item.critere?.anneePublication)
                )]
                    .filter(Boolean)
                    .sort((a, b) => b - a);

                setYears(uniqueYears);

                const uniqueNames = [...new Set(
                    json.map(item => item.critere?.nomDepartement)
                )]
                    .filter(Boolean)
                    .sort();

                setNames(uniqueNames);

                const uniqueRegions = [...new Set(
                    json.map(item => item.critere?.nomRegion)
                )]
                    .filter(Boolean)
                    .sort();
                setRegions(uniqueRegions);

                setFilteredData(json); //valeur de base dans le filtre
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
            <h1 className="taux-page-title">Tableau de bord - Taux Logements</h1>

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
            </div>

            <div className="taux-content">
                <TauxLogementsChart data={filteredData} />
            </div>
        </div>
    );
}
import { useEffect, useState } from "react";
import TauxLogementsChart from "../chart/TauxLogementsChart";
import "../css_pages/tauxLogements.css";
import { getTauxLogement } from "../services/fetch.js";

export default function TauxLogementsPage() {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [filteredData, setFilteredData] = useState([]);

    const [years, setYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState("");

    const [names, setNames] = useState([]);
    const [selectedName, setSelectedName] = useState("");
    const [regions, setRegions] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState("");

    useEffect(() => {
        getTauxLogement()
            .then((json) => {
                console.log("DATA:", json);

                setData(json);
                setFilteredData(json);

                const uniqueYears = [...new Set(
                    json.map(item => item.critere?.anneePublication)
                )]
                    .filter(Boolean)
                    .sort((a, b) => b - a);

                setYears(uniqueYears);

                const uniqueNames = [...new Set(
                    json.map(item => item.critere?.nomDepartement)
                )]
                    .filter(Boolean)
                    .sort();

                setNames(uniqueNames);

                const uniqueRegions = [...new Set(
                    json.map(item => item.critere?.nomRegion)
                )]
                    .filter(Boolean)
                    .sort();
                setRegions(uniqueRegions);

                setFilteredData(json); //valeur de base dans le filtre
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
        <div style={{ maxWidth: "900px", margin: "2rem auto", padding: "0 1rem" }}>
            <h2>Taux Logements</h2>

            <div style={{ display: 'flex', gap: '2rem', marginBottom: "2rem", flexWrap: 'wrap' }}>

                <div>
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

                <div>
                    <label style={{ marginRight: "0.5rem", fontWeight: "bold" }}>
                        Département :
                    </label>
                    <select
                        value={selectedName}
                        onChange={(e) => setSelectedName(e.target.value)}
                        className="filter-control"
                    >
                        <option value="">Tous les départements</option>
                        {names.map(name => (
                            <option key={name} value={name}>
                                {name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="region-select" style={{ marginRight: "0.5rem", fontWeight: "bold" }}>
                        Région :
                    </label>
                    <select
                        id="region-select"
                        value={selectedRegion}
                        onChange={(e) => setSelectedRegion(e.target.value)}
                        className="filter-control"
                    >
                        <option value="">Toutes les régions</option>
                        {regions.map(region => (
                            <option key={region} value={region}>
                                {region}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/*ici on appelle le graphique*/}
            <TauxLogementsChart data={filteredData} />
        </div>
    );
}
