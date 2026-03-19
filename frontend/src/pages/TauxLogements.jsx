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
                    json.map(item => item.anneePublication)
                )]
                    .filter(Boolean)
                    .sort((a, b) => b - a);

                setYears(uniqueYears);

                const uniqueNames = [...new Set(
                    json.map(item => item.nomDepartement)
                )]
                    .filter(Boolean)
                    .sort();

                setNames(uniqueNames);

                setFilteredData(json); //valeur de base dans le filtre
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

        if (selectedName) {
            filtered = filtered.filter(
                item => item.nomDepartement === selectedName
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
                        style={{ padding: "0.5rem", borderRadius: "4px" }}
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
                        style={{ padding: "0.5rem", borderRadius: "4px" }}
                    >
                        <option value="">Tous les départements</option>
                        {names.map(name => (
                            <option key={name} value={name}>
                                {name}
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