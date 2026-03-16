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

export default function ParcSocialChart({ data }) {
  if (!data || data.length === 0) return <p>Aucune donnée à afficher pour le graphique.</p>;

  // --- LOGIQUE DE REGROUPEMENT PAR RÉGION ---
  const aggregatedData = data.reduce((acc, item) => {
    // Accès au nom de la région via la relation critere
    const region = item.critere?.nomRegion || "Région inconnue";

    if (!acc[region]) {
      acc[region] = {
        nombreLogements: 0,
        logementsDemolis: 0
      };
    }

    // Propriétés de l'entité ParcSocial
    acc[region].nombreLogements += item.nombreLogements || 0;
    acc[region].logementsDemolis += item.logementsDemolis || 0;

    return acc;
  }, {});

  const labels = Object.keys(aggregatedData);
  const nombreLogementsTotals = labels.map(region => aggregatedData[region].nombreLogements);
  const logementsDemolisTotals = labels.map(region => aggregatedData[region].logementsDemolis);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Nombre de logements (Total)",
        data: nombreLogementsTotals,
        backgroundColor: "rgba(54, 162, 235, 0.7)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        label: "Logements démolis (Total)",
        data: logementsDemolisTotals,
        backgroundColor: "rgba(255, 99, 132, 0.7)",
        borderColor: "rgba(255, 99, 132, 1)",
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
        text: "Parc Social — Logements vs Démolis",
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
