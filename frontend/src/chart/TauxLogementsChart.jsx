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
    if (!data || data.length === 0) return <p>Aucune donnée disponible.</p>; //gestion du cas où les données ne sont pas encore chargées ou sont vides

    const sampleData = data.slice(0, 300); //limite les éléments, avec la valeur après la virgule
    const firstItem = sampleData[0]; //définition de l'ID à 0 pour l'affichage, EXTRACTION DU PREMIER ELEMENT
    const departement = firstItem?.critere?.nomDepartement ?? null;
    //vérification de si firstItem existe et pareil pour critere pour acceder a nomDepartement

    // limite à un département pour avoir une courbe pour chaque année lisible
    const series = departement
        ? sampleData.filter((item) => item?.critere?.nomDepartement === departement) //filtre pour n'avoir que les éléments du département sélectionné dans le filtre
        : sampleData;

    // tri chronologique des années
    series.sort((a, b) => {
        const ay = Number(a?.critere?.anneePublication ?? 0);
        const by = Number(b?.critere?.anneePublication ?? 0);
        return ay - by; // ay - by pour ordre croissant, by - ay pour ordre décroissant
    });

    const labels = series.map((item) => String(item?.critere?.anneePublication ?? "")); // CHOIX DE LA DONNEE A AFFICHER
    //changement pour tout afficher

    // 1er Graphique : Pie ()
    const pieData = {
        labels: ["Logements Sociaux (%)", "Logements Vacants (%)", "Logements Individuels (%)"], //choix des labels pour le graphique, avec les textes à afficher dans la légende et les cotes du graphique
        datasets: [
            {
                label: `Taux pour ${firstItem.critere?.nomDepartement || 'département'}`,
                data: [
                    firstItem.pourcTauxLogementsSociaux, // données à afficher sur le graph
                    firstItem.pourcTauxLogementsVacants,
                    firstItem.pourcTauxLogementsIndividuels,
                ],
                backgroundColor: [ // couleur pour chaque partie, dans l'ordre des labels
                    '#4B7A71',
                    '#7DA9A1',
                    '#A4CEC6',
                ],
                borderColor: [
                    '#A4CEC6',
                    '#7DA9A1',
                    '#4B7A71',
                ],
                borderWidth: 1,
            },
        ],
    };


    // 2ème Graphique : Line
    const lineData = {
        labels: labels,
        datasets: [
            {
                label: "Taux de logements vacants (%)",
                data: series.map((item) => Number(item?.pourcTauxLogementsVacants ?? 0)), //premiere ligne correspond au taux de logements vacants, avec la valeur après la virgule, ??0 pour éviter les valeurs nulles ou indéfinies
                fill: false, //sert à ne pas remplir la zone sous la courbe, pour une meilleure lisibilité
                borderColor: '#A4CEC6',
                backgroundColor: '#A4CEC6',
                tension: 0.1,
                yAxisID: 'y'
            },
            {
                label: "Nombre total de logements",
                data: series.map((item) => Number(item?.nombreLogements ?? 0)), //deuxieme ligne correspond au nombre total de logements, avec la valeur après la virgule, ??0 pour éviter les valeurs nulles ou indéfinies
                fill: false,
                borderColor: '#4B7A71',
                backgroundColor: '#4B7A71',
                tension: 0.1, // tension pour lisser la courbe, 0 pour une courbe droite entre les points, plus la valeur est élevée plus la courbe est lisse
                yAxisID: 'y1' //permet d'associer cette courbe à l'axe y1, pour avoir des échelles différentes pour les deux courbes, et éviter que la courbe du nombre total de logements écrase celle du taux de logements vacants si les valeurs sont très différentes
            }
        ]
    };

    // partie 
    const lineOptions = {
        responsive: true,
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
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
                title: {
                    display: true,
                    text: 'Taux (%)',
                    color: '#A4CEC6'
                },
                ticks: {
                    callback: (value) => value + ' %'
                }
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                grid: { drawOnChartArea: false },
                title: {
                    display: true,
                    text: 'Nombre de logements',
                    color: '#4B7A71'
                },
                ticks: {
                    callback: (value) => value.toLocaleString()
                }
            },
        },
    };


    // 3ème Graphique : Doughnut
    const doughnutData = {
        labels: ["Logements Sociaux (%)", "Autres types de logements (%)"],
        datasets: [{
            label: `Proportion pour ${firstItem.critere?.nomDepartement || 'département'}`,
            data: [
                firstItem.pourcTauxLogementsSociaux,
                (100 - firstItem.pourcTauxLogementsSociaux).toFixed(2)
            ],
            backgroundColor: [
                '#7DA9A1',
                '#A4CEC6'
            ],
            hoverOffset: 4
        }]
    };

    return (


        <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>

            <section> TEXTE


            </section>

            {/* Graphique Pie */}
            <div style={{ width: "500px", margin: "0 auto" }}>
                <h3 style={{ textAlign: "center" }}>1. Répartition des taux ({firstItem.critere?.nomDepartement}) en {firstItem.critere?.anneePublication}</h3>
                <Pie
                    data={pieData}
                    options={{
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    label: (context) => ` ${context.label}: ${context.parsed}%`
                                }
                            }
                        }
                    }}
                />
            </div>

            {/* Graphique Line */}
            <div style={{ width: "100%", margin: "0 auto" }}>
                <h3 style={{ textAlign: "center" }}>2. Évolution : Taux vacants vs Volume total<br />(Lieu : {firstItem.critere?.nomDepartement})</h3>
                <Line data={lineData} options={lineOptions} />
            </div>

            {/* Graphique Doughnut */}
            <div style={{ width: "500px", margin: "0 auto" }}>
                <h3 style={{ textAlign: "center" }}>3. Part du Parc Social <br />({firstItem.critere?.nomDepartement} en {firstItem.critere?.anneePublication})</h3>
                <Doughnut
                    data={doughnutData}
                    options={{
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    label: (context) => ` ${context.label}: ${context.parsed}%`
                                }
                            }
                        }
                    }}
                />
            </div>
        </div>
    );
}
