import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from "chart.js";
import { Line, Pie, Bar } from "react-chartjs-2";
import departments from "../data/departments.json";
import "../css_pages/logement.css";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function LogementChart({ data }) {
    if (!data || data.length === 0) {
        return <p>Aucune donnée disponible.</p>;
    }

    const sampleData = data.slice(0, 25);
    const firstItem = sampleData[0];

    const getDepartementName = (id) => {
        const code = String(id).padStart(2, "0");
        const dep = departments.features.find(
            (d) => d.properties.code === code
        );
        return dep ? dep.properties.nom : `ID ${id}`;
    };

    const labels = sampleData.map((item) => getDepartementName(item.id));

    // --- Totaux ---
    const totalPrincipales = sampleData.reduce(
        (sum, item) => sum + (Number(item.nombreResidencesPrincipales) || 0),
        0
    );
    const totalSecondaires = sampleData.reduce(
        (sum, item) => sum + (Number(item.nombreResidenceSecondaire) || 0),
        0
    );
    const totalVacants = sampleData.reduce(
        (sum, item) => sum + (Number(item.nombreLogementsVacants) || 0),
        0
    );
    const totalLogements = sampleData.reduce(
        (sum, item) => sum + (Number(item.nombreLogements) || 0),
        0
    );

    // --- 1er Graphique : Area Chart ---
    const areaData = {
        labels,
        datasets: [
            {
                label: "Résidences principales",
                data: sampleData.map(
                    (item) => Number(item.nombreResidencesPrincipales) || 0
                ),
                fill: true,
                backgroundColor: 'rgba(108, 32, 155, 0.5)',
                borderColor: "#6c209bff",
                tension: 0.4,
            },
            {
                label: "Résidences secondaires",
                data: sampleData.map(
                    (item) => Number(item.nombreResidenceSecondaire) || 0
                ),
                fill: true,
                backgroundColor: 'rgba(171, 57, 232, 0.5)',
                borderColor: "#ab39e8ff",
                tension: 0.4,
            },
        ],
    };

    const areaOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top",
                labels: { usePointStyle: true, padding: 15 }
            },
            tooltip: {
                backgroundColor: '#1e293b',
                padding: 12,
                cornerRadius: 8,
                callbacks: {
                    label: function (context) {
                        return `${context.dataset.label}: ${context.parsed.y.toLocaleString()}`;
                    }
                }
            }
        },
    };

    // --- 2ème Graphique : Pie ---
    const pieData = {
        labels: ["Principales", "Secondaires", "Vacants"],
        datasets: [
            {
                data: [totalPrincipales, totalSecondaires, totalVacants],
                backgroundColor: ['#6c209bff', '#ab39e8ff', '#d48cf8ff'],
                borderColor: '#ffffff',
                borderWidth: 2,
                hoverOffset: 12,
            },
        ],
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#1e293b',
                padding: 12,
                cornerRadius: 8,
                callbacks: {
                    label: function (context) {
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const value = context.raw;
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${value.toLocaleString()} (${percentage}%)`;
                    },
                },
            },
        },
    };

    // --- 3ème Graphique : Bar ---
    const topData = [...data]
        .sort((a, b) => (b.nombreLogements || 0) - (a.nombreLogements || 0))
        .slice(0, 10);

    const barData = {
        labels: topData.map((item) => getDepartementName(item.id)),
        datasets: [
            {
                label: "Top 10 - Nombre de logements",
                data: topData.map(item => Number(item.nombreLogements) || 0),
                backgroundColor: "#6c209bff",
                borderRadius: 6,
            },
        ],
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#1e293b',
                padding: 12,
                cornerRadius: 8,
                callbacks: {
                    label: function (context) {
                        return `${context.parsed.y.toLocaleString()} logements`;
                    }
                }
            }
        },
    };

    // Calculs pour les pourcentages
    const pourcPrincipales = totalLogements > 0 ? ((totalPrincipales / totalLogements) * 100).toFixed(1) : 0;
    const pourcSecondaires = totalLogements > 0 ? ((totalSecondaires / totalLogements) * 100).toFixed(1) : 0;
    const pourcVacants = totalLogements > 0 ? ((totalVacants / totalLogements) * 100).toFixed(1) : 0;

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

            {/* === 1er Graphique : Résidences principales vs secondaires === */}
            <div className="logement-card">
                <h2>Évolution des résidences principales et secondaires</h2>

                <div className="logement-card-content">
                    {/* Colonne gauche : Graphique */}
                    <div className="logement-chart-col" style={{ height: "350px" }}>
                        <Line data={areaData} options={areaOptions} />
                    </div>

                    {/* Colonne droite : Informations */}
                    <div className="logement-info-col">
                        <div>
                            <p className="logement-section-label">Analyse Territoriale</p>
                            <p className="logement-section-title">
                                Résidences <span className="highlight">principales</span> vs <span className="highlight">secondaires</span>
                            </p>
                            <p className="logement-description">
                                Ce graphique compare la répartition entre résidences principales et secondaires par département. Il permet de visualiser la densité d'habitation permanente face aux logements à usage occasionnel.
                            </p>
                        </div>

                        {/* Statistiques clés */}
                        <div className="logement-stats-grid">
                            <div className="logement-stat-item">
                                <div className="logement-stat-header">
                                    <div className="logement-stat-dot purple"></div>
                                    <span className="logement-stat-label">PRINCIPALES</span>
                                </div>
                                <span className="logement-stat-value">{totalPrincipales.toLocaleString()}</span>
                            </div>
                            <div className="logement-stat-item">
                                <div className="logement-stat-header">
                                    <div className="logement-stat-dot violet"></div>
                                    <span className="logement-stat-label">SECONDAIRES</span>
                                </div>
                                <span className="logement-stat-value">{totalSecondaires.toLocaleString()}</span>
                            </div>
                            <div className="logement-stat-item">
                                <div className="logement-stat-header">
                                    <div className="logement-stat-dot lavender"></div>
                                    <span className="logement-stat-label">TOTAL</span>
                                </div>
                                <span className="logement-stat-value">{totalLogements.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="logement-info-box">
                            <h4>À savoir :</h4>
                            <p>
                                Un fort ratio de résidences secondaires peut indiquer une zone touristique ou un territoire à forte attractivité saisonnière, mais peut aussi refléter une faible occupation permanente.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* === 2ème Graphique : Répartition des types de logements (Pie) === */}
            <div className="logement-card">
                <h2>Répartition des types de logements</h2>

                <div className="logement-card-content">
                    {/* Colonne gauche : Graphique */}
                    <div className="logement-pie-container">
                        <Pie data={pieData} options={pieOptions} />
                    </div>

                    {/* Colonne droite : Informations */}
                    <div className="logement-info-col">
                        <div>
                            <p className="logement-section-label">Ventilation du Parc</p>
                            <p className="logement-section-title">
                                Structure du parc <span className="highlight">immobilier</span>
                            </p>
                            <p className="logement-description">
                                Ce diagramme illustre la ventilation globale du parc de logements entre résidences principales, résidences secondaires et logements vacants. Ces proportions sont des indicateurs clés de la dynamique territoriale.
                            </p>
                        </div>

                        {/* Statistiques en pourcentage */}
                        <div className="logement-stats-grid">
                            <div className="logement-stat-item">
                                <div className="logement-stat-header">
                                    <div className="logement-stat-dot purple"></div>
                                    <span className="logement-stat-label">PRINCIPALES</span>
                                </div>
                                <span className="logement-stat-value">{pourcPrincipales}%</span>
                            </div>
                            <div className="logement-stat-item">
                                <div className="logement-stat-header">
                                    <div className="logement-stat-dot violet"></div>
                                    <span className="logement-stat-label">SECONDAIRES</span>
                                </div>
                                <span className="logement-stat-value">{pourcSecondaires}%</span>
                            </div>
                            <div className="logement-stat-item">
                                <div className="logement-stat-header">
                                    <div className="logement-stat-dot lavender"></div>
                                    <span className="logement-stat-label">VACANTS</span>
                                </div>
                                <span className="logement-stat-value">{pourcVacants}%</span>
                            </div>
                        </div>

                        <div className="logement-key-points">
                            <h4>Points clés :</h4>
                            <ul>
                                <li>La part de résidences principales reflète la capacité du territoire à accueillir une population permanente.</li>
                                <li>Le taux de logements vacants peut signaler une tension du marché ou un manque d'attractivité.</li>
                                <li>Les résidences secondaires indiquent l'attractivité touristique et récréative du département.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* === 3ème Graphique : Top 10 départements (Bar) === */}
            <div className="logement-card">
                <h2>Top 10 départements par nombre de logements</h2>

                <div className="logement-card-content">
                    {/* Colonne gauche : Graphique */}
                    <div className="logement-chart-col" style={{ height: "350px" }}>
                        <Bar data={barData} options={barOptions} />
                    </div>

                    {/* Colonne droite : Informations */}
                    <div className="logement-info-col">
                        <div>
                            <p className="logement-section-label">Classement National</p>
                            <p className="logement-section-title">
                                Les départements les plus <span className="highlight">peuplés</span>
                            </p>
                            <p className="logement-description">
                                Ce classement met en lumière les 10 départements disposant du plus grand nombre de logements. Ces territoires concentrent une part significative de l'offre immobilière nationale.
                            </p>
                        </div>

                        {/* Top 3 */}
                        {topData.length >= 3 && (
                            <div className="logement-stats-grid">
                                <div className="logement-stat-item">
                                    <div className="logement-stat-header">
                                        <div className="logement-stat-dot purple"></div>
                                        <span className="logement-stat-label">1er</span>
                                    </div>
                                    <span className="logement-stat-value" style={{ fontSize: "1rem" }}>
                                        {getDepartementName(topData[0].id)}
                                    </span>
                                    <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                                        {Number(topData[0].nombreLogements).toLocaleString()} logements
                                    </span>
                                </div>
                                <div className="logement-stat-item">
                                    <div className="logement-stat-header">
                                        <div className="logement-stat-dot violet"></div>
                                        <span className="logement-stat-label">2ème</span>
                                    </div>
                                    <span className="logement-stat-value" style={{ fontSize: "1rem" }}>
                                        {getDepartementName(topData[1].id)}
                                    </span>
                                    <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                                        {Number(topData[1].nombreLogements).toLocaleString()} logements
                                    </span>
                                </div>
                                <div className="logement-stat-item">
                                    <div className="logement-stat-header">
                                        <div className="logement-stat-dot lavender"></div>
                                        <span className="logement-stat-label">3ème</span>
                                    </div>
                                    <span className="logement-stat-value" style={{ fontSize: "1rem" }}>
                                        {getDepartementName(topData[2].id)}
                                    </span>
                                    <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                                        {Number(topData[2].nombreLogements).toLocaleString()} logements
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className="logement-info-box">
                            <h4>Analyse :</h4>
                            <p>
                                Les départements les plus dotés en logements sont généralement les plus urbanisés. Cette concentration reflète les dynamiques démographiques et économiques à l'échelle nationale.
                            </p>
                        </div>

                        {firstItem?.critere && (
                            <div className="logement-territory-info">
                                <div>
                                    <strong>Département :</strong> {firstItem.critere.nomDepartement}<br />
                                    <strong>Région :</strong> {firstItem.critere.nomRegion}<br />
                                    <strong>Année :</strong> {firstItem.critere.anneePublication}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}