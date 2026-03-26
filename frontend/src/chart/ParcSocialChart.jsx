import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Filler, Title, Tooltip, Legend } from "chart.js";
import { Chart, Doughnut } from "react-chartjs-2";
import "../css_pages/parcSocial.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend
);

export default function ParcSocialChart({ data }) {
  if (!data || data.length === 0) return <p>Aucune donnée à afficher pour le graphique.</p>;

  const firstItem = data[0];

  // Agrégation par région
  const aggregatedData = data.reduce((acc, item) => {
    const region = item.critere?.nomRegion || "Région inconnue";

    if (!acc[region]) {
      acc[region] = {
        nombreLogements: 0,
        logementsDemolis: 0,
        logementsLocation: 0,
        ventesPersonnesPhysiques: 0
      };
    }

    acc[region].nombreLogements += item.nombreLogements || 0;
    acc[region].logementsDemolis += item.logementsDemolis || 0;
    acc[region].logementsLocation += item.logementsLocation || 0;
    acc[region].ventesPersonnesPhysiques += item.ventesPersonnesPhysiques || 0;

    return acc;
  }, {});

  const labels = Object.keys(aggregatedData);
  const nombreLogementsTotals = labels.map(region => aggregatedData[region].nombreLogements);
  const logementsDemolisTotals = labels.map(region => aggregatedData[region].logementsDemolis);

  // Totaux globaux
  const totalLogements = nombreLogementsTotals.reduce((a, b) => a + b, 0);
  const totalDemolis = logementsDemolisTotals.reduce((a, b) => a + b, 0);
  const totalLocation = Object.values(aggregatedData).reduce((sum, r) => sum + r.logementsLocation, 0);
  const totalVentes = Object.values(aggregatedData).reduce((sum, r) => sum + r.ventesPersonnesPhysiques, 0);

  // Pourcentages
  const pourcDemolis = totalLogements > 0 ? ((totalDemolis / totalLogements) * 100).toFixed(2) : 0;
  const totalLocationVentes = totalLocation + totalVentes;
  const pourcLocation = totalLocationVentes > 0 ? ((totalLocation / totalLocationVentes) * 100).toFixed(1) : 0;
  const pourcVentes = totalLocationVentes > 0 ? ((totalVentes / totalLocationVentes) * 100).toFixed(1) : 0;

  // Top 3 régions par nombre de logements
  const sortedRegions = [...labels].sort((a, b) => aggregatedData[b].nombreLogements - aggregatedData[a].nombreLogements);

  // --- Graphique Principal : Combo Bar + Line (Double Échelle) ---
  const comboChartData = {
    labels,
    datasets: [
      {
        type: 'bar', // Bar for static count
        label: "Nombre de logements (Échelle Gauche)",
        data: nombreLogementsTotals,
        backgroundColor: "rgba(108, 32, 155, 0.4)", // Deeper purple for bars
        borderColor: "#6c209bff",
        borderWidth: 1,
        borderRadius: 4,
        yAxisID: 'y',
        order: 2,
      },
      {
        type: 'line', // Line for activity/flow
        label: "Logements démolis (Échelle Droite)",
        data: logementsDemolisTotals,
        backgroundColor: "rgba(171, 57, 232, 0.2)",
        borderColor: "#ab39e8ff",
        borderWidth: 3,
        fill: false,
        pointRadius: 4,
        pointHoverRadius: 6,
        yAxisID: 'y1',
        tension: 0.4,
        order: 1,
      },
    ],
  };

  const comboChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top",
        labels: { usePointStyle: true, padding: 15 }
      },
      tooltip: {
        backgroundColor: '#1e293b',
        padding: 12,
        cornerRadius: 8,
      }
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Total Logements',
          color: '#6c209bff',
          font: { weight: 'bold' }
        },
        beginAtZero: true,
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Démolitions',
          color: '#ab39e8ff',
          font: { weight: 'bold' }
        },
        grid: {
          drawOnChartArea: false,
        },
        beginAtZero: true,
      },
    },
  };

  // --- 2ème Graphique : Doughnut ---
  const doughnutData = {
    labels: ["Logements mis en location", "Ventes à des personnes physiques"],
    datasets: [
      {
        data: [totalLocation, totalVentes],
        backgroundColor: ["#6c209bff", "#ab39e8ff"],
        borderColor: '#ffffff',
        borderWidth: 2,
        hoverOffset: 12,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: function (context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const value = context.raw;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${value.toLocaleString()} (${percentage}%)`;
          },
        },
      },
    },
  };


  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

      {/* 1er Graphique : Logements vs Démolis par région */}
      <div className="parc-card">
        <h2>Parc Social — Logements vs Démolis par Région</h2>

        <div className="parc-card-content">
          {/* Colonne gauche : Graphique */}
          <div className="parc-chart-col" style={{ height: "450px" }}>
            <Chart data={comboChartData} options={comboChartOptions} />
          </div>

          {/* Colonne droite : Informations */}
          <div className="parc-info-col">
            <div>
              <p className="parc-section-label">Vue d'ensemble</p>
              <p className="parc-section-title">
                Parc social : <span className="highlight" style={{ color: "#6c209bff" }}>logements</span> et <span className="highlight" style={{ color: "#ab39e8ff" }}>démolitions</span>
              </p>
              <p className="parc-description">
                Ce graphique compare le nombre total de logements sociaux (échelle de gauche) et le nombre de logements démolis (échelle de droite) par région. Il permet de visualiser l'effort de renouvellement malgré les différences d'échelle.
              </p>
            </div>

            {/* Statistiques clés */}
            <div className="parc-stats-grid">
              <div className="parc-stat-item">
                <div className="parc-stat-header">
                  <div className="parc-stat-dot purple"></div>
                  <span className="parc-stat-label">LOGEMENTS</span>
                </div>
                <span className="parc-stat-value">{totalLogements.toLocaleString()}</span>
              </div>
              <div className="parc-stat-item">
                <div className="parc-stat-header">
                  <div className="parc-stat-dot violet"></div>
                  <span className="parc-stat-label">DÉMOLIS</span>
                </div>
                <span className="parc-stat-value">{totalDemolis.toLocaleString()}</span>
              </div>
              <div className="parc-stat-item">
                <div className="parc-stat-header">
                  <div className="parc-stat-dot lavender"></div>
                  <span className="parc-stat-label">TAUX DÉMOLITION</span>
                </div>
                <span className="parc-stat-value">{pourcDemolis}%</span>
              </div>
            </div>

            {/* Top 3 régions */}
            {sortedRegions.length >= 3 && (
              <div className="parc-stats-grid">
                <div className="parc-stat-item">
                  <div className="parc-stat-header">
                    <div className="parc-stat-dot purple"></div>
                    <span className="parc-stat-label">1ère Région</span>
                  </div>
                  <span className="parc-stat-value" style={{ fontSize: "0.95rem" }}>{sortedRegions[0]}</span>
                  <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                    {aggregatedData[sortedRegions[0]].nombreLogements.toLocaleString()} logements
                  </span>
                </div>
                <div className="parc-stat-item">
                  <div className="parc-stat-header">
                    <div className="parc-stat-dot violet"></div>
                    <span className="parc-stat-label">2ème Région</span>
                  </div>
                  <span className="parc-stat-value" style={{ fontSize: "0.95rem" }}>{sortedRegions[1]}</span>
                  <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                    {aggregatedData[sortedRegions[1]].nombreLogements.toLocaleString()} logements
                  </span>
                </div>
                <div className="parc-stat-item">
                  <div className="parc-stat-header">
                    <div className="parc-stat-dot lavender"></div>
                    <span className="parc-stat-label">3ème Région</span>
                  </div>
                  <span className="parc-stat-value" style={{ fontSize: "0.95rem" }}>{sortedRegions[2]}</span>
                  <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                    {aggregatedData[sortedRegions[2]].nombreLogements.toLocaleString()} logements
                  </span>
                </div>
              </div>
            )}

            <div className="parc-info-box">
              <h4>Renouvellement urbain :</h4>
              <p>
                Les démolitions dans le parc social s'inscrivent dans une politique de renouvellement urbain. Un taux de démolition élevé peut refléter des opérations de restructuration des quartiers prioritaires.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* === 2ème Graphique : Location vs Ventes (Doughnut) === */}
      <div className="parc-card">
        <h2>Location vs Ventes à des personnes physiques</h2>

        <div className="parc-card-content">
          {/* Colonne gauche : Graphique */}
          <div className="parc-doughnut-container">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>

          {/* Colonne droite : Informations */}
          <div className="parc-info-col">
            <div>
              <p className="parc-section-label">Affectation du Parc</p>
              <p className="parc-section-title">
                Répartition <span className="highlight">location</span> vs <span className="highlight">ventes</span>
              </p>
              <p className="parc-description">
                Ce diagramme illustre la répartition entre les logements sociaux mis en location et ceux vendus à des personnes physiques. Cette ventilation est un indicateur clé de la politique de gestion du patrimoine social.
              </p>
            </div>

            {/* Statistiques */}
            <div className="parc-stats-grid">
              <div className="parc-stat-item">
                <div className="parc-stat-header">
                  <div className="parc-stat-dot purple"></div>
                  <span className="parc-stat-label">LOCATION</span>
                </div>
                <span className="parc-stat-value">{totalLocation.toLocaleString()}</span>
                <span style={{ fontSize: "0.8rem", color: "#64748b" }}>{pourcLocation}% du total</span>
              </div>
              <div className="parc-stat-item">
                <div className="parc-stat-header">
                  <div className="parc-stat-dot violet"></div>
                  <span className="parc-stat-label">VENTES</span>
                </div>
                <span className="parc-stat-value">{totalVentes.toLocaleString()}</span>
                <span style={{ fontSize: "0.8rem", color: "#64748b" }}>{pourcVentes}% du total</span>
              </div>
            </div>

            <div className="parc-key-points">
              <h4>Points clés :</h4>
              <ul>
                <li>La mise en location reste la vocation première du parc social, garantissant l'accès au logement pour les ménages modestes.</li>
                <li>Les ventes à des personnes physiques permettent l'accession sociale à la propriété et le renouvellement du parc.</li>
                <li>L'équilibre entre location et vente reflète la stratégie patrimoniale des bailleurs sociaux.</li>
              </ul>
            </div>

            {firstItem?.critere && (
              <div className="parc-territory-info">
                <div>
                  <strong>Année :</strong> {firstItem.critere.anneePublication}<br />
                  <strong>Régions couvertes :</strong> {labels.length}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
