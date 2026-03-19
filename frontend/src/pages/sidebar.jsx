import "../css_pages/sidebar.css";

export default function Sidebar({ setPage }) {
    return (
        <div className="sidebar">
            <h1 className="menu-title" onClick={() => setPage("main")} style={{ cursor: "pointer" }}>
                Habitat France
            </h1>

            <div className="sidebar-menu" style={{ justifyContent: "flex-end" }}>
                <button onClick={() => setPage("parc-social")}>
                    Analyse Parc Social
                </button>

                <button onClick={() => setPage("taux-logements")}>
                    Taux Logements
                </button>

                <button onClick={() => setPage("logements")}>
                    Chiffres Habitat
                </button>

                <button onClick={() => setPage("main")} style={{ backgroundColor: "#6366f1", color: "white", marginLeft: "1rem" }}>
                    Carte
                </button>
            </div>
        </div>
    );
}