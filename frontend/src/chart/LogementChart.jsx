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
    if (!data || data.length === 0) {
        return <p>Aucune donnée disponible.</p>;
    }

    const sampleData = data.slice(0, 25);

    const getDepartementName = (id) => {
        const code = String(id).padStart(2, "0");

        const dep = departments.features.find(
            (d) => d.properties.code === code
        );

        return dep ? dep.properties.nom : `ID ${id}`;
    };

    const labels = sampleData.map((item) => getDepartementName(item.id));

    const areaData = {
        labels,
        datasets: [
            {
                label: "Résidences principales",
                data: sampleData.map(
                    (item) => Number(item.nombreResidencesPrincipales) || 0
                ),
                fill: true,
                backgroundColor: "#00ff0d40",
                borderColor: "#00ff0d80",
                tension: 0.4,
            },
            {
                label: "Résidences secondaires",
                data: sampleData.map(
                    (item) => Number(item.nombreResidenceSecondaire) || 0
                ),
                fill: true,
                backgroundColor: "#00a2ff40",
                borderColor: "#00a2ff80",
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
            },
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
                backgroundColor: ["#00a2ff80", "#00ff0d80", "#8400ff80"],
            },
        ],
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
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
        labels: topData.map((item) => getDepartementName(item.id)),
        datasets: [
            {
                label: "Top 10 - Nombre de logements",
                data: topData.map((item) => Number(item.nombreLogements) || 0),
                backgroundColor: "#00a2ff80",
            },
        ],
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
        },
    };

    return (
        <div style={{ width: "100%", maxWidth: "900px", margin: "0 auto" }}>
            <h3 style={{ textAlign: "center", fontSize: "1.1rem" }}>
                Logements
            </h3>

            <div style={{ height: "280px", marginBottom: "2rem" }}>
                <Line data={areaData} options={areaOptions} />
            </div>

            <h3
                style={{
                    textAlign: "center",
                    marginTop: "1rem",
                    fontSize: "1.1rem",
                }}
            >
                Répartition des types de logements
            </h3>

            <div
                style={{
                    height: "260px",
                    width: "260px",
                    margin: "0 auto 2rem auto",
                }}
            >
                <Pie data={pieData} options={pieOptions} />
            </div>

            <h3
                style={{
                    textAlign: "center",
                    marginTop: "1rem",
                    fontSize: "1.1rem",
                }}
            >
                Top 10 départements (logements)
            </h3>

            <div style={{ height: "300px" }}>
                <Bar data={barData} options={barOptions} />
            </div>
        </div>
    );
}