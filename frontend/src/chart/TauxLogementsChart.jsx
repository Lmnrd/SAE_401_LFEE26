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

    const sampleData = data.slice(0, 25); //limite les éléments, avec la valeur après la virgule
    const labels = sampleData.map((item) => item.critere?.nomDepartement || `ID ${item.id}`);
    //utilisation la relation critere pour afficher le nom du département grâce à la clé étrangere et le oneToMany ou Many


    // 1er Graphique : Pie
    const firstItem = sampleData[0];
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
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
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
                data: sampleData.map((item) => item.pourcTauxLogementsVacants),
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
                yAxisID: 'y'
            },
            {
                label: "Nombre de logements",
                data: sampleData.map((item) => item.nombreLogements),
                fill: false,
                borderColor: 'rgb(255, 99, 132)',
                tension: 0.1,
                yAxisID: 'y1'
            }
        ]
    };

    const lineOptions = {
        responsive: true,
        scales: {
            y: { type: 'linear', display: true, position: 'left' },
            y1: { type: 'linear', display: true, position: 'right', grid: { drawOnChartArea: false } },
        },
    };


    // 3ème Graphique : Doughnut
    const doughnutData = {
        labels: ["Logements Sociaux (%)", "Logements totaux (%)"],
        datasets: [{
            label: `Proportion pour ${firstItem.critere?.nomDepartement || 'département'}`,
            data: [
                firstItem.pourcTauxLogementsSociaux,
                100 - firstItem.pourcTauxLogementsSociaux
            ],
            backgroundColor: [
                'rgb(54, 162, 235)',
                'rgb(220, 220, 220)'
            ],
            hoverOffset: 4
        }]
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
                <h3 style={{ textAlign: "center" }}>2. Taux de logements vacants & Nombre de logements</h3>
                <Line data={lineData} options={lineOptions} />
            </div>

            {/* Graphique Doughnut */}
            <div style={{ width: "400px", margin: "0 auto" }}>
                <h3 style={{ textAlign: "center" }}>3. Proportion de Logements Sociaux ({firstItem.critere?.nomDepartement})</h3>
                <Doughnut data={doughnutData} />
            </div>
        </div>
    );
}
