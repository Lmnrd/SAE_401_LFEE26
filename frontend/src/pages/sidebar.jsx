import "../css_pages/sidebar.css";

export default function Sidebar({ setPage, currentPage }) {
    return (
        <div className="sidebar">
            <h1 className="menu-title" onClick={() => setPage("main")} style={{ cursor: "pointer" }}>
                HabitatFrance.fr
            </h1>

            <div className="sidebar-menu" style={{ justifyContent: "flex-end" }}>
                <button
                    onClick={() => setPage("parc-social")}
                    className={currentPage === "parc-social" ? "active" : ""}
                >
                    Analyse Parc Social
                </button>

                <button
                    onClick={() => setPage("taux-logements")}
                    className={currentPage === "taux-logements" ? "active" : ""}
                >
                    Taux Logements
                </button>

                <button
                    onClick={() => setPage("logements")}
                    className={currentPage === "logements" ? "active" : ""}
                >
                    Statistique des logements
                </button>

                <button
                    onClick={() => setPage("main")}
                    className={currentPage === "main" ? "active" : ""}
                    style={{
                        backgroundColor: currentPage === "main" ? "#6c209bff" : "transparent",
                        color: currentPage === "main" ? "white" : "#64748b",
                        marginLeft: "1rem",
                        border: currentPage === "main" ? "none" : "1px solid #6c209b"
                    }}
                >
                    Carte
                </button>
            </div>
        </div>
    );
}