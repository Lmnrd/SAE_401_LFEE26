import React, { useState, useEffect } from "react";
// Composants fournis par react-simple-maps pour dessiner une carte SVG à partir d'un GeoJSON
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
// Projection géographique spéciale qui recentre la France et positionne les DOM-TOM
import { geoConicConformalFrance } from "d3-composite-projections";
// Composant d'info-bulle utilisé au survol des départements
import { Tooltip } from "react-tooltip";
import 'react-tooltip/dist/react-tooltip.css';

// Données GeoJSON de tous les départements français (codes + noms + formes)
import franceData from "../data/departments.json";
// Styles spécifiques de la carte (position, couleurs, overlay, etc.)
import "./MapFrance.css";

// Définition de la projection utilisée pour afficher la France :
// - .scale() gère le niveau de zoom
// - .translate() déplace la carte dans le SVG (coordonnées x, y)
const projection = geoConicConformalFrance()
  .scale(3200)
  .translate([450, 300]);

export default function MapFrance() {
  // Département actuellement sélectionné (cliqué) sur la carte
  const [selectedDept, setSelectedDept] = useState(null);

  // États qui contiendront les données récupérées dans la base via l'API Symfony
  const [critereData, setCritereData] = useState([]);      // Données de l'entité Critere (population, année, etc.)
  const [tauxPopData, setTauxPopData] = useState([]);      // Données de l'entité TauxPopulation (densité, % jeunes, etc.)

  // États pour gérer l'affichage de chargement et d'erreur
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  // useEffect se lance au montage du composant :
  // il appelle l'API Symfony une seule fois pour charger les données nécessaires à la carte.
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // On lance les 2 requêtes HTTP en parallèle :
        // - /api/critere : infos globales par département
        // - /api/taux-population : indicateurs de population par département
        const [resCritere, resTauxPop] = await Promise.all([
          fetch("http://localhost:8000/api/critere"),
          fetch("http://localhost:8000/api/taux-population")
        ]);

        // Si une des deux réponses n'est pas "OK" (code HTTP 200–299), on lève une erreur
        if (!resCritere.ok || !resTauxPop.ok) {
          throw new Error("Erreur lors de la récupération des données.");
        }

        // Conversion des réponses en JSON pour obtenir des tableaux d'objets JavaScript
        const dataCritere = await resCritere.json();
        const dataTauxPop = await resTauxPop.json();

        // On stocke les données dans les états pour pouvoir les réutiliser partout dans le composant
        setCritereData(dataCritere);
        setTauxPopData(dataTauxPop);
      } catch (err) {
        // En cas d'erreur réseau ou serveur, on log dans la console et on affiche un message utilisateur
        console.error(err);
        setErrorMsg("Impossible de charger les données depuis l'API.");
      } finally {
        // Qu'il y ait une erreur ou non, on arrête l'affichage du "chargement"
        setIsLoading(false);
      }
    };

    // Appel de la fonction asynchrone définie juste au-dessus
    fetchData();
  }, []); // [] = ce useEffect ne se relance pas quand le composant se re-render, seulement au montage

  // Gère le clic sur un département de la carte :
  // on mémorise dans selectedDept le département cliqué (sa géométrie + propriétés)
  const handleDeptClick = (geo) => {
    setSelectedDept(geo);
  };

  // Préparation des données à afficher pour le département actuellement sélectionné
  let currentCritere = null;
  // currentTauxPop contiendra les indicateurs de population du même département
  let currentTauxPop = null;

  if (selectedDept) {
    // Nom du département récupéré depuis le GeoJSON (ex: "Isère", "Paris"…)
    const geoNom = selectedDept.properties.nom;

    // On cherche dans le tableau critereData l'entrée dont le nom de département
    // correspond au nom issu du GeoJSON. On met tout en minuscule pour éviter
    // les problèmes de casse (Paris vs PARIS).
    // Remarque : on suppose ici que les chaînes correspondent exactement
    // (même orthographe, mêmes accents).
    const deptIndex = critereData.findIndex(
      (c) => c.nomDepartement && c.nomDepartement.toLowerCase() === geoNom.toLowerCase()
    );

    if (deptIndex !== -1) {
      // Si on trouve une correspondance, on récupère l'objet de Critere correspondant
      currentCritere = critereData[deptIndex];
      // Hypothèse de travail : l'ordre de tauxPopData est le même que celui de critereData,
      // donc on peut utiliser le même index pour trouver les taux de population.
      currentTauxPop = tauxPopData[deptIndex];
    }
  }

  return (

    <div className="map-container">
      <h2>Cartographie Nationale (Carte de France)</h2>
      {/* Partie gauche : affichage de la carte de France */}
      <div className="map-view">
        <ComposableMap
          // Projection définie plus haut (conique conforme pour la France)
          projection={projection}
          width={900}
          height={600}
          style={{ width: "100%", height: "auto" }} // Rend la carte responsive
        >
          {/* Geographies lit le GeoJSON (franceData) et fournit la liste des géométries (= départements) */}
          <Geographies geography={franceData}>
            {({ geographies }) =>
              geographies.map((geo) => {
                // On vérifie si le département de la boucle est le même que celui sélectionné
                const isSelected = selectedDept && selectedDept.properties.code === geo.properties.code;
                return (
                  <Geography
                    key={geo.rsmKey}                 // clé unique pour React
                    geography={geo}                  // données de forme du département
                    onClick={() => handleDeptClick(geo)} // au clic, on ouvre la fiche du département
                    // Attributs utilisés par react-tooltip pour afficher le nom + code au survol
                    data-tooltip-id="france-tooltip"
                    data-tooltip-content={`${geo.properties.nom} (${geo.properties.code})`}
                    // Styles de la carte selon l'état du département (normal, survolé, cliqué)
                    style={{
                      default: {
                        // Couleur de base de chaque département et quand on ferme le département
                        fill: isSelected ? "#6c209bff" : "#d48cf8ff", // ancien : isSelected ? "#4B7A71" : "#A4CEC6"
                        stroke: "#ffffff",
                        strokeWidth: 0.5,
                        outline: "none",
                        transition: "all 250ms"
                      },
                      hover: {
                        // Couleur quand la souris est au-dessus
                        fill: "#ab39e8ff", // ancien : "#4B7A71"
                        stroke: "#ffffff",
                        strokeWidth: 0.5,
                        outline: "none",
                        cursor: "pointer",
                        transition: "all 250ms"
                      },
                      pressed: {
                        // Couleur quand on clique
                        fill: "#6c209bff", // ancien : "#7DA9A1"
                        stroke: "#ffffff",
                        strokeWidth: 0.5,
                        outline: "none"
                      }
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
        {/* Composant d'info-bulle global, lié aux data-tooltip-* définis sur Geography */}
        <Tooltip id="france-tooltip" />
      </div>

      {/* Partie droite : "popup" (overlay) qui affiche les infos du département sélectionné */}
      {selectedDept && (
        // Fond semi-transparent qui recouvre la page ; un clic dessus ferme la popup
        <div className="map-info-overlay" onClick={() => setSelectedDept(null)}>
          {/* Carte d'information ; on stoppe la propagation du clic pour ne pas fermer en cliquant à l'intérieur */}
          <div className="info-card" onClick={(e) => e.stopPropagation()}>
            {/* Bouton de fermeture de la popup */}
            <button className="close-btn" onClick={() => setSelectedDept(null)} aria-label="Fermer">
              &times;
            </button>

            {/* Titre : nom et code du département (issus du GeoJSON) */}
            <h3>{selectedDept.properties.nom}</h3>
            <p>Code département : <strong>{selectedDept.properties.code}</strong></p>

            {/* Affichage conditionnel en fonction de l'état du chargement et des données */}
            {isLoading ? (
              // Si les données sont en cours de chargement
              <p>Chargement des données...</p>
            ) : errorMsg ? (
              // Si une erreur est survenue lors du fetch
              <p className="error-text">{errorMsg}</p>
            ) : currentCritere ? (
              // Si on a trouvé des données pour ce département
              <div className="db-data">
                <h4>Statistiques ({currentCritere.anneePublication})</h4>
                <ul>
                  {/* Nombre d'habitants récupéré depuis l'entité Critere */}
                  <li><strong>Population :</strong> {currentCritere.nombreHabitants} habitants</li>
                  {/* Si on a aussi des taux de population associés, on affiche les indicateurs détaillés */}
                  {currentTauxPop && (
                    <>
                      <li><strong>Densité :</strong> {currentTauxPop.densitePopulationAuKmCarre} / km²</li>
                      <li><strong>Moins de 20 ans :</strong> {currentTauxPop.pourcPopulationMoins20Ans}%</li>
                      <li><strong>60 ans et plus :</strong> {currentTauxPop.pourcPopulation60AnsEtPlus}%</li>
                      <li><strong>Variation sur 10 ans :</strong> {currentTauxPop.pourcVariationPopulationSur10Ans}%</li>
                    </>
                  )}
                </ul>
              </div>
            ) : (
              // Cas où aucun enregistrement de la base ne correspond au département cliqué
              <p className="no-data">Aucune donnée trouvée en base pour ce département.</p>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
