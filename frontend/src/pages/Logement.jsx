import { useEffect, useState } from "react";
import LogementChart from "../chart/LogementChart";

export default function LogementsPage() {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    const [selectedYear, setSelectedYear] = useState("");
    const [selectedName, setSelectedName] = useState("");

    const [years, setYears] = useState([]);
    const [names, setNames] = useState([]);

    // 🔹 FETCH DATA
    useEffect(() => {
        fetch("http://localhost:8000/api/logements")
            .then(res => res.json())
            .then(json => {
                console.log("DATA:", json);

                setData(json);
                setFilteredData(json);

                // 🔹 récupérer années
                const uniqueYears = [...new Set(
                    json.map(item => item.critere?.anneePublication)
                )].filter(Boolean);

                setYears(uniqueYears);

                // 🔹 récupérer départements
                const uniqueNames = [...new Set(
                    json.map(item => item.critere?.nomDepartement)
                )].filter(Boolean);

                setNames(uniqueNames);
            })
            .catch(err => console.error(err));
    }, []);

    // 🔥 FILTRE
    useEffect(() => {
        let filtered = data;

        if (selectedYear) {
            filtered = filtered.filter(
                item => item.critere?.anneePublication === selectedYear
            );
        }

        if (selectedName) {
            filtered = filtered.filter(
                item => item.critere?.nomDepartement === selectedName
            );
        }

        console.log("FILTERED:", filtered);

        setFilteredData(filtered);
    }, [selectedYear, selectedName, data]);

    return (
        <div style={{ maxWidth: "900px", margin: "2rem auto" }}>
            <h2>Logements</h2>

            {/* 🔹 FILTRES */}
            <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
                
                <select onChange={(e) => setSelectedYear(e.target.value)}>
                    <option value="">Toutes les années</option>
                    {years.map(y => (
                        <option key={y}>{y}</option>
                    ))}
                </select>

                <select onChange={(e) => setSelectedName(e.target.value)}>
                    <option value="">Tous les départements</option>
                    {names.map(n => (
                        <option key={n}>{n}</option>
                    ))}
                </select>

                <button onClick={() => {
                    setSelectedYear("");
                    setSelectedName("");
                }}>
                    Reset
                </button>
            </div>

            {/* 🔹 GRAPH */}
            <LogementChart data={filteredData} />
        </div>
    );
}