import { useEffect, useState } from "react";
import ParcSocialPage from "./ParcSocialPage";
import TauxLogementsPage from "./TauxLogements";
import LogementsPage from "./Logement";

function Navbar() {
    const [data, setData] = useState(null);
    const [page, setPage] = useState("main"); // POUR LA NAVIGATION VERS LES PAGES

    useEffect(() => {
        fetch("http://localhost:8000/api/test")
            .then(res => res.json())
            .then(data => setData(data))
            .catch(err => console.error("API error:", err));
    }, []);

    if (page === "taux-logements") {
        return (
            <div style={{ padding: '20px' }}>
                <button onClick={() => setPage("main")}>← Retour</button>
                <TauxLogementsPage />
            </div>
        );
    }

    if (page === "parc-social") {
        return (
            <div style={{ padding: '20px' }}>
                <button onClick={() => setPage("main")}>← Retour</button>
                <ParcSocialPage />
            </div>
        );
    }

    if (page === "logements") {
        return (
            <div style={{ padding: '20px' }}>
                <button onClick={() => setPage("main")}>← Retour</button>
                <LogementsPage />
            </div>
        );
    }

    return (
        <div style={{ padding: '20px' }}>

            <button onClick={() => setPage("parc-social")}>
                Page Parc Social
            </button>

            <button onClick={() => setPage("taux-logements")}>
                Page Taux Logements
            </button>

            <button onClick={() => setPage("logements")}>
                Page Logements
            </button>
        </div >
    );
}

export default Navbar;