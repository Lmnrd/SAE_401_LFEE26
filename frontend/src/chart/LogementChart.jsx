import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from "chart.js";

import { Line } from "react-chartjs-2";
import departments from "../data/departments.json";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
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
    const dep = departments.features.find(
        d => Number(d.properties.code) === Number(id)
    );

    return dep ? dep.properties.nom : `ID ${id}`;
};
   

    // ✅ Labels corrigés
    const labels = sampleData.map(item => getDepartementName(item.id));

    const areaData = {
        labels: labels,
        datasets: [
            // {
            //     label: "Nombre de logements",
            //     data: sampleData.map(item => Number(item.nombreLogements) || 0),
            //     fill: true,
            //     backgroundColor: "rgba(75, 192, 192, 0.2)",
            //     borderColor: "rgb(75, 192, 192)",
            //     tension: 0.4,
            //     yAxisID: "y",
            // },
            {
                label: "Résidences principales",
                data: sampleData.map(item => Number(item.nombreResidencesPrincipales) || 0),
                fill: true,
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                borderColor: "rgb(255, 99, 132)",
                tension: 0.4,
                yAxisID: "y1",
            },
            {
                label: "Résidences secondaires",
                data: sampleData.map(item => Number(item.nombreResidenceSecondaire) || 0),
                fill: true,
                backgroundColor: "rgba(0, 128, 0, 0.2)",
                borderColor: "rgb(0, 128, 0)",
                tension: 0.4,
                yAxisID: "y1",
            },
        ],
    };

    const areaOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
        },
        scales: {
            y: {
                type: "linear",
                display: true,
                position: "left",
            },
            y1: {
                type: "linear",
                display: true,
                position: "right",
                grid: {
                    drawOnChartArea: false,
                },
            },
        },
    };

    return (
        <div style={{ width: "100%" }}>
            <h3 style={{ textAlign: "center" }}>Logements</h3>
            <Line data={areaData} options={areaOptions} />
        </div>
    );
}