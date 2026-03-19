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
    // 1er Graphique : Doughnut (plus moderne qu'un Pie plein)
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
                    '#6366F1', // Indigo (Sociaux)
                    '#F59E0B', // Amber (Vacants)
                    '#94A3B8', // Slate (Individuels)
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
                backgroundColor: 'rgba(245, 158, 11, 0.1)', // Soft amber background
                borderColor: '#F59E0B',
                pointBackgroundColor: '#F59E0B',
                tension: 0.4,
                yAxisID: 'y'
            },
            {
                label: "Nombre total de logements",
                data: series.map((item) => Number(item?.nombreLogements ?? 0)),
                fill: false,
                borderColor: '#6366F1',
                backgroundColor: '#6366F1',
                pointBackgroundColor: '#6366F1',
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
                title: { display: true, text: 'Taux (%)', color: '#F59E0B', font: { weight: 'bold' } },
                ticks: { callback: (value) => value + ' %' }
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                title: { display: true, text: 'Volume Logements', color: '#6366F1', font: { weight: 'bold' } },
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
            backgroundColor: [ '#6366F1', '#E2E8F0' ],
            borderColor: '#ffffff',
            borderWidth: 2,
            hoverOffset: 8
        }]
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

            <div className="taux-card">
                <h3>1. Répartition détaillée des types de logements</h3>
                
                <div style={{ 
                    display: "flex", 
                    flexWrap: "wrap", 
                    gap: "2rem", 
                    alignItems: "center", 
                    marginTop: "2rem" 
                }}>
                    {/* Colonne de gauche : Le Graphique */}
                    <div style={{ flex: "1 1 300px", height: "300px" }}>
                        <Doughnut
                            data={pieData}
                            options={{
                                cutout: '70%',
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: { display: false } // On cache la légende car on va mettre le texte à droite
                                }
                            }}
                        />
                    </div>

                    {/* Colonne de droite : Le Texte */}
                    <div style={{ flex: "1 1 300px" }}>
                        <div style={{ marginBottom: "1.5rem" }}>
                            <p style={{ margin: 0, color: "#64748b", fontSize: "0.875rem", fontWeight: "600", textTransform: "uppercase" }}>
                                Localisation
                            </p>
                            <p style={{ margin: 0, fontSize: "1.25rem", fontWeight: "700", color: "#1e293b" }}>
                                {firstItem.critere?.nomDepartement} <span style={{ color: "#6366f1" }}>({firstItem.critere?.anneePublication})</span>
                            </p>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                <div style={{ width: "12px", height: "12px", borderRadius: "3px", backgroundColor: "#6366F1" }}></div>
                                <span style={{ flex: 1, color: "#475569" }}>Logements Sociaux</span>
                                <span style={{ fontWeight: "700", color: "#1e293b" }}>{firstItem.pourcTauxLogementsSociaux}%</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                <div style={{ width: "12px", height: "12px", borderRadius: "3px", backgroundColor: "#F59E0B" }}></div>
                                <span style={{ flex: 1, color: "#475569" }}>Logements Vacants</span>
                                <span style={{ fontWeight: "700", color: "#1e293b" }}>{firstItem.pourcTauxLogementsVacants}%</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                <div style={{ width: "12px", height: "12px", borderRadius: "3px", backgroundColor: "#94A3B8" }}></div>
                                <span style={{ flex: 1, color: "#475569" }}>Logements Individuels</span>
                                <span style={{ fontWeight: "700", color: "#1e293b" }}>{firstItem.pourcTauxLogementsIndividuels}%</span>
                            </div>
                        </div>

                        <p style={{ marginTop: "2rem", fontSize: "0.875rem", color: "#64748b", fontStyle: "italic", lineHeight: "1.5" }}>
                            Ce graphique illustre la distribution relative des différentes catégories de logements pour ce département sur l'année sélectionnée.
                        </p>
                    </div>
                </div>
            </div>


            <div className="taux-card">
                <h3>2. Évolution du parc ({firstItem.critere?.nomDepartement})</h3>
                <div style={{ height: "400px", marginTop: "1.5rem" }}>
                    <Line data={lineData} options={{ ...lineOptions, maintainAspectRatio: false }} />
                </div>
            </div>

            <div className="taux-card" style={{ maxWidth: "600px", margin: "0 auto", width: "100%" }}>
                <h3>3. Focus : Part du Parc Social ({firstItem.critere?.anneePublication})</h3>
                <div style={{ height: "300px", marginTop: "1.5rem" }}>
                    <Doughnut
                        data={doughnutData}
                        options={{
                            cutout: '65%',
                            maintainAspectRatio: false,
                            plugins: {
                                legend: { position: 'bottom', labels: { usePointStyle: true } }
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
