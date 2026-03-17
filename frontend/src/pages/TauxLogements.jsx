// CONNEXION AU DONNEES POUR LES CHARTS TAUX DE LOGEMENTS

import { useEffect, useState } from "react";
import TauxLogementsChart from "../chart/TauxLogementsChart";

export default function TauxLogementsPage() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [filteredData, setFilteredData] = useState([]);
    const [years, setYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState("");

    useEffect(() => {
        fetch("http://localhost:8000/api/taux-logement")
            .then((res) => {
                if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
                return res.json();
            })

            //FILTRE
            .then((json) => {
                setData(json);

                const uniqueYears = [...new Set(json.map(item => item.critere?.anneePublication))]
                    .filter(Boolean)
                    .sort();
                setYears(uniqueYears);

                if (uniqueYears.length > 0) {
                    setSelectedYear(uniqueYears[uniqueYears.length - 1].toString());
                } else {
                    setFilteredData(json);
                }
            })
            .catch((err) => setError(err.message));
    }, []);


    //FILTRE
    useEffect(() => {
        if (!data) return;

        //FILTRE
        if (selectedYear) {
            const filtered = data.filter(
                item => item.critere?.anneePublication?.toString() === selectedYear
            );
            setFilteredData(filtered);
        } else {
            setFilteredData(data);
        }
    }, [selectedYear, data]);

    if (error) return <p style={{ color: "red" }}>Erreur : {error}</p>;
    if (!data) return <p>Chargement des données...</p>;

    //FILTRE
    return (
        <div style={{ maxWidth: "900px", margin: "2rem auto", padding: "0 1rem" }}>
            <h2>Taux Logements</h2>

            <div style={{ marginBottom: "2rem" }}>
                <label htmlFor="year-select" style={{ marginRight: "0.5rem", fontWeight: "bold" }}>
                    Année :
                </label>
                <select
                    id="year-select"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    style={{ padding: "0.5rem", borderRadius: "4px" }}
                >
                    <option value="">Toutes les années (Cumul global)</option>
                    {years.map(y => (
                        <option key={y} value={y.toString()}>
                            {y}
                        </option>
                    ))}
                </select>
            </div>

            <TauxLogementsChart data={filteredData} />
        </div>
    );
}
