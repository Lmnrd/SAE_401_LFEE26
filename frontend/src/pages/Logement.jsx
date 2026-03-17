import { useEffect, useState } from "react";
import LogementChart from "../chart/LogementChart";

export default function LogementsPage() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const [filteredData, setFilteredData] = useState([]);
    const [years, setYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState("");
    const [names, setNames] = useState([]);
    const [selectedName, setSelectedName] = useState("");

    useEffect(() => {
        fetch("/api/logements")
            .then((res) => {
                if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
                return res.json();
            })
            .then((json) => {
                setData(json);

                // 🔹 Années (tri numérique descendant, stockées en string)
                const uniqueYears = [...new Set(json.map(item => item.anneePublication))]
                    .filter(Boolean)
                    .map(Number)
                    .sort((a, b) => b - a)
                    .map(y => y.toString());
                setYears(uniqueYears);

                // 🔹 Départements
                const uniqueNames = [...new Set(json.map(item => item.nomDepartement))]
                    .filter(Boolean)
                    .sort();
                setNames(uniqueNames);

                // Laisser la sélection par défaut vide pour afficher toutes les années/départements
            })
            .catch((err) => setError(err.message));
    }, []);

    // 🔥 FILTRAGE
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

        setFilteredData(filtered);
    }, [selectedYear, selectedName, data]);

    if (error) return <p style={{ color: "red" }}>Erreur : {error}</p>;
    if (!data) return <p>Chargement...</p>;

    return (
        <div style={{ maxWidth: "900px", margin: "2rem auto" }}>
            <h2>Logements</h2>

            {/* FILTRES */}
            <div style={{ display: "flex", gap: "2rem", marginBottom: "2rem" }}>

                {/* Année */}
                <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                    <option value="">Toutes les années</option>
                    {years.map(y => (
                        <option key={y} value={y}>{y}</option>
                    ))}
                </select>

                {/* Département */}
                <select value={selectedName} onChange={(e) => setSelectedName(e.target.value)}>
                    <option value="">Tous les départements</option>
                    {names.map(n => (
                        <option key={n} value={n}>{n}</option>
                    ))}
                </select>

                {/* Reset */}
                <button onClick={() => {
                    setSelectedYear("");
                    setSelectedName("");
                }}>
                    Reset
                </button>
            </div>

            <LogementChart data={filteredData} />
        </div>
    );
}