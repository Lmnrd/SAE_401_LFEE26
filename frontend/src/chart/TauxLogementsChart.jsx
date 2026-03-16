import {
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

// Enregistrement des modules Chart.js nécessaires
ChartJS.register(
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

    // On limite à 5 éléments pour que les graphiques soient lisibles
    // Et on utilise la relation "critere" pour afficher le nom du département (clé étrangère onetoMany/ManyToOne)
    const sampleData = data.slice(0, 5);
    const labels = sampleData.map((item) => item.critere?.nomDepartement || `ID ${item.id}`);

    // ==========================================
    // 1er Graphique : Pie
    // Taux logements sociaux, vacants et individuels (basé sur le premier département comme exemple)
    // ==========================================
    const firstItem = sampleData[0];
    const pieData = {
        labels: ["Sociaux (%)", "Vacants (%)", "Individuels (%)"],
        datasets: [
            {
                label: `Taux pour ${firstItem.critere?.nomDepartement || 'département'}`,
                data: [
                    firstItem.pourcTauxLogementsSociaux,
                    firstItem.pourcTauxLogementsVacants,
                    firstItem.pourcTauxLogementsIndividuels,
                ],
                backgroundColor: [
                    "rgba(54, 162, 235, 0.7)", // Bleu
                    "rgba(255, 99, 132, 0.7)", // Rouge
                    "rgba(105, 201, 27, 0.7)", // Vert
                ],
                borderColor: ["#fff", "#fff", "#fff"],
                borderWidth: 2,
            },
        ],
    };

    // ==========================================
    // 2ème Graphique : Line
    // Taux logement vacant avec nombre de logements
    // ==========================================
    const lineData = {
        labels,
        datasets: [
            {
                label: "Taux de logements vacants (%)",
                data: sampleData.map((item) => item.pourcTauxLogementsVacants),
                borderColor: "rgba(255, 99, 132, 1)",
                backgroundColor: "rgba(255, 99, 132, 0.5)",
                yAxisID: 'y', // Axe Y de gauche pour les pourcentages
            },
            {
                label: "Nombre de logements",
                data: sampleData.map((item) => item.nombreLogements),
                borderColor: "rgba(54, 162, 235, 1)",
                backgroundColor: "rgba(54, 162, 235, 0.5)",
                yAxisID: 'y1', // Axe Y de droite pour les grands nombres
            },
        ],
    };

    const lineOptions = {
        responsive: true,
        plugins: { title: { display: true, text: "Taux vacants & Nombre de logements" } },
        scales: {
            y: { type: 'linear', display: true, position: 'left' },
            y1: { type: 'linear', display: true, position: 'right', grid: { drawOnChartArea: false } },
        },
    };

    // ==========================================
    // 3ème Graphique : Doughnut
    // Taux logement sociaux avec nombre de logements
    // ==========================================
    // Pour un Doughnut avec "2 infos", on peut faire 2 anneaux (2 datasets)
    const doughnutData = {
        labels,
        datasets: [
            {
                label: "Taux Logements Sociaux (%)",
                data: sampleData.map((item) => item.pourcTauxLogementsSociaux),
                backgroundColor: [
                    "rgba(255, 99, 132, 0.7)",
                    "rgba(54, 162, 235, 0.7)",
                    "rgba(255, 206, 86, 0.7)",
                    "rgba(75, 192, 192, 0.7)",
                    "rgba(153, 102, 255, 0.7)",
                ],
            },
            {
                label: "Nombre de logements",
                data: sampleData.map((item) => item.nombreLogements),
                backgroundColor: [
                    "rgba(255, 99, 132, 0.4)",
                    "rgba(54, 162, 235, 0.4)",
                    "rgba(255, 206, 86, 0.4)",
                    "rgba(75, 192, 192, 0.4)",
                    "rgba(153, 102, 255, 0.4)",
                ],
            },
        ],
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
            {/* Graphique Pie */}
            <div style={{ width: "400px", margin: "0 auto" }}>
                <h3 style={{ textAlign: "center" }}>1. Répartition des taux ({firstItem.critere?.nomDepartement})</h3>
                <Pie data={pieData} />
            </div>

            {/* Graphique Line */}
            <div style={{ width: "100%", margin: "0 auto" }}>
                <h3 style={{ textAlign: "center" }}>2. Taux vacants et Nombre de logements</h3>
                <Line data={lineData} options={lineOptions} />
            </div>

            {/* Graphique Doughnut */}
            <div style={{ width: "400px", margin: "0 auto" }}>
                <h3 style={{ textAlign: "center" }}>3. Sociaux & Nbr total (Anneaux concentriques)</h3>
                <Doughnut data={doughnutData} />
            </div>
        </div>
    );
}
