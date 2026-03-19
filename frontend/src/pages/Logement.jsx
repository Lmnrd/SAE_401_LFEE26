import { useEffect, useState } from "react";
import LogementChart from "../chart/LogementChart";
import { getLogements}  from "../services/fetch"; 

export default function LogementsPage() {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    const [selectedYear, setSelectedYear] = useState("");
    const [selectedName, setSelectedName] = useState("");

    const [years, setYears] = useState([]);
    const [names, setNames] = useState([]);

    useEffect(() => {
        getLogements()   
            .then(json => {
                console.log("DATA:", json);

                setData(json);
                setFilteredData(json);

                const uniqueYears = [...new Set(
                    json.map(item => item.anneePublication)
                )].filter(Boolean);

                setYears(uniqueYears);

                const uniqueNames = [...new Set(
                    json.map(item => item.nomDepartement)
                )].filter(Boolean);

                setNames(uniqueNames);
            })
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
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

    return (
        <div style={{ maxWidth: "900px", margin: "2rem auto" }}>
            <h2>Logements</h2>

            <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>

                <select className="filter-control" onChange={(e) => setSelectedYear(e.target.value)}>
                    <option value="">Toutes les années</option>
                    {years.map(y => (
                        <option key={y} value={y}>
                            {y}
                        </option>
                    ))}
                </select>

                <select className="filter-control"
                    value={selectedName}
                    onChange={(e) => setSelectedName(e.target.value)}
                >
                    <option value="">Tous les départements</option>
                    {names.map(n => (
                        <option key={n} value={n}>
                            {n}
                        </option>
                    ))}
                </select>

                <button className="filter-button" onClick={() => {
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