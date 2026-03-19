// CONNEXION AU DONNEES POUR LES CHARTS TAUX DE LOGEMENTS

import { useEffect, useState } from "react";
import TauxLogementsChart from "../chart/TauxLogementsChart";

export default function TauxLogementsPage() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [filteredData, setFilteredData] = useState([]);
    const [years, setYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState("");
    const [names, setNames] = useState([]);
    const [selectedName, setSelectedName] = useState("");
    const [regions, setRegions] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState("");

    useEffect(() => {
        fetch("http://localhost:8000/api/taux-logement")
            .then((res) => {
                if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
                return res.json();
            })
            .then((json) => {
                setData(json);

                // extraction des années du json
                const uniqueYears = [...new Set(json.map(item => item.critere?.anneePublication))]
                    .filter(Boolean)
                    .sort();
                setYears(uniqueYears);

                // extraction des départements du json
                const uniqueNames = [...new Set(json.map(item => item.critere?.nomDepartement))]
                    .filter(Boolean)
                    .sort();
                setNames(uniqueNames);

                //extraction des régions
                const uniqueRegions = [...new Set(json.map(item => item.critere?.nomRegion))]
                    .filter(Boolean)
                    .sort();
                setRegions(uniqueRegions);

                setFilteredData(json); //valeur de base dans le filtre
            })
            .catch((err) => setError(err.message));
    }, []);


    // GESTION DES FILTRES (Année & Département)
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

    //FILTRE années et départements
    return (
        <div style={{ maxWidth: "900px", margin: "2rem auto", padding: "0 1rem" }}>
            <h2>Taux Logements</h2>

            <div style={{ display: 'flex', gap: '2rem', marginBottom: "2rem", flexWrap: 'wrap' }}>
                <div>
                    <label htmlFor="year-select" style={{ marginRight: "0.5rem", fontWeight: "bold" }}>
                        Année :
                    </label>
                    <select
                        id="year-select"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        style={{ padding: "0.5rem", borderRadius: "4px", border: '1px solid #ddd' }}
                    >
                        <option value="">Toutes les années</option>
                        {years.map(y => (
                            <option key={y} value={y.toString()}>
                                {y}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="name-select" style={{ marginRight: "0.5rem", fontWeight: "bold" }}>
                        Département :
                    </label>
                    <select
                        id="name-select"
                        value={selectedName}
                        onChange={(e) => setSelectedName(e.target.value)}
                        style={{ padding: "0.5rem", borderRadius: "4px", border: '1px solid #ddd' }}
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
                        style={{ padding: "0.5rem", borderRadius: "4px", border: '1px solid #ddd' }}
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
