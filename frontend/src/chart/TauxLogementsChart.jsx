import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Enregistrement des modules Chart.js nécessaires
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function TauxLogementsChart({ data }) {
    // Préparer les labels (id de chaque entrée)
    const labels = data.map((item) => `ID ${item.id}`);

    const chartData = {
        labels,
        datasets: [
            {
                label: "Taux de logements sociaux* (en %)",
                data: data.map((item) => item.pourcTauxLogementsSociaux),
                backgroundColor: "rgba(54, 162, 235, 0.7)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
            },
            {
                label: "Taux de logements vacants* (en %)",
                data: data.map((item) => item.pourcTauxLogementsVacants),
                backgroundColor: "rgba(255, 99, 132, 0.7)",
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 1,
            },
            {
                label: "Taux de logements individuels (en %)",
                data: data.map((item) => item.pourcTauxLogementsIndividuels),
                backgroundColor: "rgba(105, 201, 27, 0.7)",
                borderColor: "rgba(60, 204, 24, 1)",
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: "Test pour Taux Logements",
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return <Bar data={chartData} options={options} />;
}
