import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

// Enregistrement des modules Chart.js nécessaires
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default function ParcSocialChart({ data }) {
  // Vérification si les données sont disponibles, sinon afficher un message
  if (!data || data.length === 0) return <p>Aucune donnée à afficher pour le graphique.</p>;

  // Récupération du premier élément pour référence
  const firstItem = data[0];

  // Utilisation de reduce pour agréger les données par région
  const aggregatedData = data.reduce((acc, item) => {
    // Accès au nom de la région via la relation critere
    const region = item.critere?.nomRegion || "Région inconnue";

    // Initialisation de l'objet pour la région si elle n'existe pas encore
    if (!acc[region]) {
      acc[region] = {
        nombreLogements: 0,
        logementsDemolis: 0,
        logementsLocation: 0,
        ventesPersonnesPhysiques: 0
      };
    }

    // Accumulation des valeurs pour chaque propriété de l'entité
    acc[region].nombreLogements += item.nombreLogements || 0;
    acc[region].logementsDemolis += item.logementsDemolis || 0;
    acc[region].logementsLocation += item.logementsLocation || 0;
    acc[region].ventesPersonnesPhysiques += item.ventesPersonnesPhysiques || 0;

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

  // Calcul des totaux pour le graphique en doughnut (location et ventes)
  const totalLocation = Object.values(aggregatedData).reduce((sum, r) => sum + r.logementsLocation, 0);
  const totalVentes = Object.values(aggregatedData).reduce((sum, r) => sum + r.ventesPersonnesPhysiques, 0);

  // Configuration des données pour le graphique en doughnut
  const doughnutData = {
    labels: ["Logements mis en location", "Ventes à des personnes physiques"],
    datasets: [
      {
        data: [totalLocation, totalVentes],
        backgroundColor: [
          "rgba(75, 192, 192, 0.7)",
          "rgba(255, 159, 64, 0.7)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 159, 64, 1)",
        ],
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

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Location vs Ventes (Total)",
      },
    },
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
      <div style={{ flex: "1 1 500px", minWidth: "300px" }}>
        <Bar data={chartData} options={options} />
      </div>
      <div style={{ width: "400px", margin: "0 auto" }}>
        <Doughnut data={doughnutData} options={doughnutOptions} />
      </div>
    </div>
  );
}



