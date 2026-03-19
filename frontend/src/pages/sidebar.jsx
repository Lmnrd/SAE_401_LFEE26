import "../css_pages/sidebar.css";

export default function Sidebar({ setPage }) {
    return (
        <div className="sidebar">

            <div className="sidebar-menu">
                <p className="menu-title">Accueil →</p>

                <div className="menu-section">

                    <button onClick={() => setPage("main")}>
                        Cartographie Nationale (Carte de France)
                    </button>

                </div>

                <div className="menu-section">
                    <button onClick={() => setPage("parc-social")}>
                        Analyse du Parc Social
                    </button>
                </div>

                <div className="menu-section">
                    <button onClick={() => setPage("taux-logements")}>
                        Densité de Logements (Taux Logements)
                    </button>
                </div>
                <div className="menu-section">
                    <button onClick={() => setPage("logements")}>
                        Chiffres clés de l'Habitat (Logements)
                    </button>
                </div>
            </div>
        </div>
    );
}