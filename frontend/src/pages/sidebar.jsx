import "../css_pages/Sidebar.css";

export default function Sidebar({ setPage }) {
    return (
        <div className="sidebar">

            <div className="sidebar-menu">
                <p className="menu-title">Accueil →</p>

                <div className="menu-section">

                    <button onClick={() => setPage("main")}>
                        Carte France
                    </button>

                </div>

                <div className="menu-section">
                    <button onClick={() => setPage("parc-social")}>
                        Parc Social 
                    </button>
                </div>

                <div className="menu-section">
                    <button onClick={() => setPage("taux-logements")}>
                        Taux de Logements
                    </button>
                </div>
                <div className="menu-section">
                <button onClick={() => setPage("logements")}>
                        Logements
                    </button>
                </div>
            </div>
        </div>
    );
}