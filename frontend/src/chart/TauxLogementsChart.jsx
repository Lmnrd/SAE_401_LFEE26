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
    //changement pour tout afficher

    // 1er Graphique : Pie ()
    const pieData = {
        labels: ["Logements Sociaux (%)", "Logements Vacants (%)", "Logements Individuels (%)"],
        //choix des labels pour le graphique, avec les textes à afficher dans la légende et les cotes du graphique
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
                data: series.map((item) => Number(item?.pourcTauxLogementsVacants ?? 0)),
                //premiere ligne correspond au taux de logements vacants, avec la valeur après la virgule, ??0 pour éviter les valeurs nulles ou indéfinies
                fill: false, //sert à ne pas remplir la zone sous la courbe, pour une meilleure lisibilité
                borderColor: '#A4CEC6',
                backgroundColor: '#A4CEC6',
                tension: 0.1,
                yAxisID: 'y'
            },
            {
                label: "Nombre total de logements",
                data: series.map((item) => Number(item?.nombreLogements ?? 0)),
                //deuxieme ligne correspond au nombre total de logements, avec la valeur après la virgule, ??0 pour éviter les valeurs nulles ou indéfinies
                fill: false,
                borderColor: '#4B7A71',
                backgroundColor: '#4B7A71',
                tension: 0.1, // tension pour lisser la courbe, 0 pour une courbe droite entre les points, plus la valeur est élevée plus la courbe est lisse
                yAxisID: 'y1'
                //permet d'associer cette courbe à l'axe y1, pour avoir des échelles différentes pour les deux courbes, et éviter que la courbe du nombre total 
                //de logements écrase celle du taux de logements vacants si les valeurs sont très différentes
                //ici, on affiche à droite le nombre de logements alors qu'à gauche s'affiche les pourcentages de logements VACANTS
            }
        ]
    };

    // paramètres avancés pour le graphique en courbes 
    const lineOptions = {
        responsive: true, // Permet au graphique de s'ajuster automatiquement à la taille de l'écran
        plugins: { // ajout des fonctionnalités
            tooltip: { // configuration de la bulle d'information qui apparaît au survol des deux lignes
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || ''; //récupère le nom de la courbe
                        if (label) {
                            label += ': '; // ajoute un séparateur pour un meilleur affichage
                        }
                        //personnalisation de l'affichage selon la courbe survolée
                        if (context.datasetIndex === 0) {
                            // pour le taux : 2 décimales et on ajoute le symbole % pour la clarté et ne pas se perdre dans les deux types de valeur
                            label += context.parsed.y.toFixed(2) + ' %';
                        } else {
                            // pour le nombre total : on formate le nombre pour la clarté aussi
                            label += context.parsed.y.toLocaleString();
                        }
                        return label;
                    }
                }
            }
        },
        scales: { //configuration des axex
            y: { //axe vertical de gauche (utilisé pour les pourcentages)
                type: 'linear',
                display: true,
                position: 'left',
                title: {
                    display: true,
                    text: 'Taux (%)', //on précise que ce sont les taux car il y a deux types de valeurs
                    color: '#A4CEC6'
                },
                ticks: {
                    //ajoute l'unité % aux graduations pour la clarté
                    callback: (value) => value + ' %'
                }
            },
            y1: { //axe vertical de droite (utilisé pour les grands nombres de logements)
                type: 'linear',
                display: true,
                position: 'right',
                title: {
                    display: true,
                    text: 'Nombre de logements', //on précise que ce sont les nombres de logements car il y a toujours deux types de valeurs
                    color: '#4B7A71'
                },
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
                (100 - firstItem.pourcTauxLogementsSociaux).toFixed(2) //pour remplir le graphique
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

            {/* conteneur pour le premier graphique camembert centré */}
            <div style={{ width: "500px", margin: "0 auto" }}>
                <h3 style={{ textAlign: "center" }}>1. Répartition des taux ({firstItem.critere?.nomDepartement}) en {firstItem.critere?.anneePublication}</h3>
                <Pie
                    data={pieData}
                    options={{
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    // personnalisation de l'affichage au survol
                                    // affiche "Nom de la catégorie: Valeur%"
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
