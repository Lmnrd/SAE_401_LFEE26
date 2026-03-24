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
    if (!data || data.length === 0) return <p>Aucune donnée disponible.</p>;

    const sampleData = data.slice(0, 25);


    const getDepartementName = (id) => {
        const code = String(id).padStart(2, "0");

        const dep = departments.features.find(
            d => d.properties.code === code
        );

        return dep ? dep.properties.nom : `ID ${id}`;
    };

    const labels = sampleData.map(item => getDepartementName(item.id));

    
    const areaData = {
        labels: labels,
        datasets: [
            {
                label: "Résidences principales",
                data: sampleData.map(item => Number(item.nombreResidencesPrincipales) || 0),
                fill: true,
                backgroundColor: 'rgba(108, 32, 155, 0.5)', // ancien : "#4B7A7180"
                borderColor: "#6c209bff", // ancien : "#4B7A71"
                tension: 0.4,
            },
            {
                label: "Résidences secondaires",
                data: sampleData.map(item => Number(item.nombreResidenceSecondaire) || 0),
                fill: true,
                backgroundColor: 'rgba(171, 57, 232, 0.5)', // ancien : "#A4CEC680"
                borderColor: "#ab39e8ff", // ancien : "#A4CEC6"
                tension: 0.4,
            },
        ],
    };

    const areaOptions = {
        responsive: true,
        plugins: {
            legend: { position: "top" },
        },
    };


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

    const pieData = {
        labels: ["Principales", "Secondaires", "Vacants"],
        datasets: [
            {
                data: [totalPrincipales, totalSecondaires, totalVacants],
                backgroundColor: ['#6c209bff', '#ab39e8ff', '#d48cf8ff'], // ancien : ["#4B7A7180", "#6cb5a880", "#aee8dd80"]
            },
        ],
    };

    const pieOptions = {
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const value = context.raw;
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${value} (${percentage}%)`;
                    },
                },
            },
        },
    };

  
    const topData = [...data]
        .sort((a, b) => (b.nombreLogements || 0) - (a.nombreLogements || 0))
        .slice(0, 10);

    const barData = {
        labels: topData.map(item => getDepartementName(item.id)),
        datasets: [
            {
                label: "Top 10 - Nombre de logements",
                data: topData.map(item => Number(item.nombreLogements) || 0),
                backgroundColor: "#6c209bff", // ancien : "#4B7A7180"
            },
        ],
    };

    const barOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
        },
    };

   
    return (
        <div style={{ width: "100%" }}>
            <h3 style={{ textAlign: "center" }}>Logements</h3>
            <Line data={areaData} options={areaOptions} />

            <h3 style={{ textAlign: "center", marginTop: "2rem" }}>
                Répartition des types de logements
            </h3>
            <Pie data={pieData} options={pieOptions} />

            <h3 style={{ textAlign: "center", marginTop: "2rem" }}>
                Top 10 départements (logements)
            </h3>
            <Bar data={barData} options={barOptions} />
        </div>
    );
}