// CONNEXION AU DONNEES POUR LES CHARTS TAUX DE LOGEMENTS

import { useEffect, useState } from "react";
import TauxLogementsChart from "../chart/TauxLogementsChart";

export default function TauxLogementsPage() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("http://localhost:8000/api/taux-logement")
            .then((res) => {
                if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
                return res.json();
            })
            .then((json) => setData(json))
            .catch((err) => setError(err.message));
    }, []);

    if (error) return <p style={{ color: "red" }}>Erreur : {error}</p>;
    if (!data) return <p>Chargement des données...</p>;

    return (
        <div style={{ maxWidth: "800px", margin: "2rem auto" }}>
            <TauxLogementsChart data={data} />
        </div>
    );
}
