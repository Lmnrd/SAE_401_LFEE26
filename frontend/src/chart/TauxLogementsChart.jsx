import { //import des bibliothèques nécessaires pour les graphiques
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Pie, Line, Doughnut } from "react-chartjs-2";
import "../css_pages/tauxLogements.css";


ChartJS.register( //import des éléments nécessaires pour les graphiques
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

export default function TauxLogementsChart({ data }) {
    if (!data || data.length === 0) return <p>Aucune donnée disponible.</p>;
    //gestion du cas où les données ne sont pas encore chargées ou sont vides

    const sampleData = data.slice(0, 300); //limite les éléments, avec la valeur après la virgule
    const firstItem = sampleData[0]; //définition de l'ID à 0 pour l'affichage, EXTRACTION DU PREMIER ELEMENT
    const departement = firstItem?.critere?.nomDepartement ?? null;
    //vérification de si firstItem existe et pareil pour critere pour acceder a nomDepartement

    // limite à un département pour avoir une courbe pour chaque année lisible
    const series = departement
        ? sampleData.filter((item) => item?.critere?.nomDepartement === departement)
        //filtre pour n'avoir que les éléments du département sélectionné dans le filtre
        : sampleData;

    // tri chronologique des années
    series.sort((a, b) => {
        const ay = Number(a?.critere?.anneePublication ?? 0);
        const by = Number(b?.critere?.anneePublication ?? 0);
        return ay - by; // ay - by pour ordre croissant, by - ay pour ordre décroissant
    });

    const labels = series.map((item) => String(item?.critere?.anneePublication ?? "")); // CHOIX DE LA DONNEE A AFFICHER
    // 1er Graphique : Doughnut
    const pieData = {
        labels: ["Logements Sociaux (%)", "Logements Vacants (%)", "Logements Individuels (%)"],
        datasets: [
            {
                label: `Taux pour ${firstItem.critere?.nomDepartement || 'département'}`,
                data: [
                    firstItem.pourcTauxLogementsSociaux,
                    firstItem.pourcTauxLogementsVacants,
                    firstItem.pourcTauxLogementsIndividuels,
                ],
                backgroundColor: [
                    '#6c209bff',
                    '#ab39e8ff',
                    '#d48cf8ff',
                ],
                borderColor: '#ffffff',
                borderWidth: 2,
                hoverOffset: 12,
            },
        ],
    };

    // 2ème Graphique : Line
    const lineData = {
        labels: labels,
        datasets: [
            {
                label: "Taux de logements vacants (%)",
                data: series.map((item) => Number(item?.pourcTauxLogementsVacants ?? 0)),
                fill: true,
                backgroundColor: 'rgba(108, 32, 155, 0.1)',
                borderColor: '#6c209bff',
                pointBackgroundColor: '#6c209bff',
                tension: 0.4,
                yAxisID: 'y'
            },
            {
                label: "Nombre total de logements",
                data: series.map((item) => Number(item?.nombreLogements ?? 0)),
                fill: false,
                borderColor: '#ab39e8ff',
                backgroundColor: '#ab39e8ff',
                pointBackgroundColor: '#ab39e8ff',
                tension: 0.4,
                yAxisID: 'y1'
            }
        ]
    };

    // paramètres avancés pour le graphique en courbes
    const lineOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top', labels: { usePointStyle: true, padding: 20 } },
            tooltip: {
                backgroundColor: '#1e293b',
                padding: 12,
                cornerRadius: 8,
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || '';
                        if (label) label += ': ';
                        if (context.datasetIndex === 0) {
                            label += context.parsed.y.toFixed(2) + ' %';
                        } else {
                            label += context.parsed.y.toLocaleString();
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                grid: { drawOnChartArea: false },
                title: { display: true, text: 'Taux (%)', color: '#6c209bff', font: { weight: 'bold' } },
                ticks: { callback: (value) => value + ' %' }
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                title: { display: true, text: 'Volume Logements', color: '#ab39e8ff', font: { weight: 'bold' } },
            },
        },
    };

    // 3ème Graphique : Doughnut
    const doughnutData = {
        labels: ["Logements Sociaux (%)", "Autres (%)"],
        datasets: [{
            data: [
                firstItem.pourcTauxLogementsSociaux,
                (100 - firstItem.pourcTauxLogementsSociaux).toFixed(2)
            ],
            backgroundColor: ['#6c209bff', '#E2E8F0'],
            borderColor: '#ffffff',
            borderWidth: 2,
            hoverOffset: 8
        }]
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

            <div className="taux-card">
                <h2>Répartition détaillée des types de logements</h2>

                <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "3rem",
                    alignItems: "flex-start",
                    marginTop: "2rem"
                }}>
                    {/* Colonne de gauche : Le Graphique (Fixé à gauche) */}
                    <div style={{ flex: "0 0 400px", height: "400px", minWidth: "300px" }}>
                        <Doughnut
                            data={pieData}
                            options={{
                                cutout: '70%',
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: { display: false }
                                }
                            }}
                        />
                    </div>

                    {/* Colonne de droite : Prend tout le reste de l'espace */}
                    <div style={{ flex: "1 1 400px", display: "flex", flexDirection: "column", gap: "1rem" }}>

                        <div>
                            <p style={{ margin: 0, color: "#64748b", fontSize: "0.85rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                Analyse Territoriale
                            </p>
                            <p style={{ margin: "0.5rem 0", fontSize: "1.5rem", fontWeight: "800", color: "#1e293b", letterSpacing: "-0.025em" }}>
                                {firstItem.critere?.nomDepartement} <span style={{ color: "#6c209bff" }}>({firstItem.critere?.anneePublication})</span>
                            </p>
                            <p style={{ fontSize: "0.95rem", color: "#475569", lineHeight: "1.6" }}>
                                Ce graphique présente la répartition structurelle du parc immobilier. L'analyse de ces données permet de comprendre les spécificités du marché local et d'orienter les politiques publiques d'aménagement.
                            </p>
                        </div>

                        {/* Statistiques clés */}
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                            gap: "1rem",
                            padding: "1.25rem",
                            backgroundColor: "#f8fafc",
                            borderRadius: "12px",
                            border: "1px solid #e2e8f0"
                        }}>
                            {/* PARTIE INFOS DES GRAPHS */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#6c209bff" }}></div>
                                    <span style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: "600" }}>SOCIAL</span>
                                </div>
                                <span style={{ fontSize: "1.25rem", fontWeight: "700", color: "#1e293b" }}>{firstItem.pourcTauxLogementsSociaux}%</span>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#ab39e8ff" }}></div>
                                    <span style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: "600" }}>VACANT</span>
                                </div>
                                <span style={{ fontSize: "1.25rem", fontWeight: "700", color: "#1e293b" }}>{firstItem.pourcTauxLogementsVacants}%</span>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#d48cf8ff" }}></div>
                                    <span style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: "600" }}>INDIVIDUEL</span>
                                </div>
                                <span style={{ fontSize: "1.25rem", fontWeight: "700", color: "#1e293b" }}>{firstItem.pourcTauxLogementsIndividuels}%</span>
                            </div>
                        </div>

                        <div>
                            <h4 style={{ margin: "0 0 0.75rem 0", fontSize: "0.95rem", color: "#1e293b", fontWeight: "700" }}>Points clés :</h4>
                            <ul style={{ margin: 0, paddingLeft: "1.25rem", fontSize: "0.9rem", color: "#475569", lineHeight: "1.5" }}>
                                <li>La part du parc social reflète l'engagement du département dans l'accès au logement pour tous.</li>
                                <li>Le taux de logements vacants peut indiquer une tension ou au contraire une faible attractivité de certaines zones.</li>
                                <li>L'habitat individuel reste une composante majeure de l'identité résidentielle de ce territoire.</li>
                            </ul>
                        </div>
                    </div>

                </div>
            </div>


            {/* 2ème Graphique : Évolution */}
            <div className="taux-card">
                <h2>Évolution temporelle et volume du parc</h2>
                <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "3rem",
                    alignItems: "center",
                    marginTop: "2rem"
                }}>
                    {/* Colonne de gauche : Le Graphique */}
                    <div style={{ flex: "1 1 500px", height: "450px" }}>
                        <Line data={lineData} options={{ ...lineOptions, maintainAspectRatio: false }} />
                    </div>

                    {/* Colonne de droite : Insights et Tendance */}
                    <div style={{ flex: "1 1 400px", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                        <div>
                            <p style={{ margin: 0, color: "#64748b", fontSize: "0.85rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                Analyse de Tendance
                            </p>
                            <p style={{ margin: "0.5rem 0", fontSize: "1.5rem", fontWeight: "800", color: "#1e293b", letterSpacing: "-0.025em" }}>
                                Dynamiques de <span style={{ color: "#ab39e8ff" }}>vacance</span> et de <span style={{ color: "#6c209bff" }}>volume</span>
                            </p>
                            <p style={{ fontSize: "0.95rem", color: "#475569", lineHeight: "1.6" }}>
                                Ce graphique croise deux indicateurs fondamentaux : le taux de vacance (en orange) et le volume total de logements (en bleu). Cette double lecture permet d'identifier si l'augmentation des logements s'accompagne d'une occupation réelle ou d'une hausse de l'inoccupation.
                            </p>
                        </div>

                        <div style={{
                            padding: "1.25rem",
                            backgroundColor: "rgba(108, 32, 155, 0.1)",
                            borderRadius: "12px",
                            border: "1px solid #6c209bff",
                            color: "#6c209bff"
                        }}>
                            <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "0.9rem", fontWeight: "700" }}>Focus sur la vacance :</h4>
                            <p style={{ fontSize: "0.85rem", lineHeight: "1.4", margin: 0 }}>
                                Une courbe stable ou descendante de la vacance face à un volume croissant témoigne d'une forte tension locative et d'une attractivité territoriale soutenue.
                            </p>
                        </div>

                        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                            <div style={{ flex: 1, minWidth: "120px" }}>
                                <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "700" }}>DÉBUT SÉRIE</span>
                                <div style={{ fontSize: "1.1rem", fontWeight: "700", color: "#1e293b" }}>{series[0]?.critere?.anneePublication}</div>
                            </div>
                            <div style={{ flex: 1, minWidth: "120px" }}>
                                <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "700" }}>FIN SÉRIE</span>
                                <div style={{ fontSize: "1.1rem", fontWeight: "700", color: "#1e293b" }}>{series[series.length - 1]?.critere?.anneePublication}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3ème Graphique : Focus Social (Doughnut) */}
            <div className="taux-card">
                <h2>Focus sur le Logement Social</h2>
                <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "3rem",
                    alignItems: "center",
                    marginTop: "2rem"
                }}>
                    {/* Colonne de gauche : Détails Social */}
                    <div style={{ flex: "1.2 1 350px" }}>
                        <p style={{ margin: 0, color: "#64748b", fontSize: "0.85rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            Indicateur Social
                        </p>
                        <p style={{ margin: "0.5rem 0", fontSize: "1.5rem", fontWeight: "800", color: "#6c209bff", letterSpacing: "-0.025em" }}>
                            Part du Parc Locatif Social
                        </p>

                        <div style={{
                            fontSize: "3rem",
                            fontWeight: "900",
                            color: "#1e293b",
                            margin: "1rem 0"
                        }}>
                            {firstItem.pourcTauxLogementsSociaux}<span style={{ fontSize: "1.5rem", fontWeight: "600", color: "#64748b" }}>%</span>
                        </div>

                        <p style={{ fontSize: "0.95rem", color: "#475569", lineHeight: "1.6", marginBottom: "1.5rem" }}>
                            Ce ratio illustre la proportion de logements conventionnés par rapport à l'offre globale. Un taux élevé indique une forte présence institutionnelle pour l'habitat abordable.
                        </p>

                        <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px" }}>
                            <div style={{ fontSize: "0.85rem", color: "#475569" }}>
                                <strong>Territoire :</strong> {firstItem.critere?.nomDepartement}<br />
                                <strong>Année :</strong> {firstItem.critere?.anneePublication}
                            </div>
                        </div>
                    </div>

                    {/* Colonne de droite : Le Graphique */}
                    <div style={{ flex: "1 1 300px", height: "350px" }}>
                        <Doughnut
                            data={doughnutData}
                            options={{
                                cutout: '65%',
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: { display: false }
                                }
                            }}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}

