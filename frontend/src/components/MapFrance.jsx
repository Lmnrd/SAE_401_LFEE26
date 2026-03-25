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
import "../css_pages/tauxLogements.css";

// Définition de la projection utilisée pour afficher la France :
// - .scale() gère le niveau de zoom
// - .translate() déplace la carte dans le SVG (coordonnées x, y)
const MAP_WIDTH = 560;
const MAP_HEIGHT = 520;

// On centre la projection en fonction de la taille réelle de la carte.
// (Avant: translate calé sur 900x600, d'où le décalage visuel.)
const projection = geoConicConformalFrance()
  .scale(3200)
  .translate([MAP_WIDTH / 2, MAP_HEIGHT / 2]);

export default function MapFrance() {
  // Département actuellement sélectionné (cliqué) sur la carte
  const [selectedDept, setSelectedDept] = useState(null);

  // États qui contiendront les données récupérées dans la base via l'API Symfony
  const [critereData, setCritereData] = useState([]);      // Données de l'entité Critere (population, année, etc.)
  const [tauxPopData, setTauxPopData] = useState([]);      // Données de l'entité TauxPopulation (densité, % jeunes, etc.)

  // États pour gérer l'affichage de chargement et d'erreur
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  // Format d'affichage : 2 décimales (virgule/point selon les données)
  const format2 = (value) => {
    if (value === null || value === undefined || value === "") return "";
    const n =
      typeof value === "string"
        ? Number(value.replace(",", "."))
        : Number(value);
    if (!Number.isFinite(n)) return "";
    return n.toFixed(2);
  };

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
    <div className="taux-page-wrapper map-page-wrapper">
      <h1 className="taux-page-title">Carte de France</h1>

      <div className="map-layout">
        <div className="map-left">
          {/* Partie gauche : affichage de la carte de France */}
          <div className="map-view map-map-view">
            <div className="map-canvas">
              <ComposableMap
                // Projection définie plus haut (conique conforme pour la France)
                projection={projection}
                width={MAP_WIDTH}
                height={MAP_HEIGHT}
                style={{ width: "100%", height: "auto" }} // Rend la carte responsive
              >
                {/* Geographies lit le GeoJSON (franceData) et fournit la liste des géométries (= départements) */}
                <Geographies geography={franceData}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      // On vérifie si le département de la boucle est le même que celui sélectionné
                      const isSelected =
                        selectedDept && selectedDept.properties.code === geo.properties.code;
                      return (
                        <Geography
                          key={geo.rsmKey} // clé unique pour React
                          geography={geo} // données de forme du département
                          onClick={() => handleDeptClick(geo)} // au clic, on ouvre la fiche du département
                          // Attributs utilisés par react-tooltip pour afficher le nom + code au survol
                          data-tooltip-id="france-tooltip"
                          data-tooltip-content={`${geo.properties.nom} (${geo.properties.code})`}
                          // Styles de la carte selon l'état du département (normal, survolé, cliqué)
                          style={{
                            default: {
                              // Objectif: départements plus foncés au repos
                              fill: isSelected ? "#3f0b64ff" : "#6c209bff",
                              stroke: "#ffffff",
                              strokeWidth: 0.5,
                              outline: "none",
                              transition: "all 250ms",
                            },
                            hover: {
                              // Objectif: survol plus clair (inverse de l'actuel)
                              fill: "#d48cf8ff",
                              stroke: "#ffffff",
                              strokeWidth: 0.5,
                              outline: "none",
                              cursor: "pointer",
                              transition: "all 250ms",
                            },
                            pressed: {
                              // Couleur quand on clique
                              fill: "#ab39e8ff",
                              stroke: "#ffffff",
                              strokeWidth: 0.5,
                              outline: "none",
                            },
                          }}
                        />
                      );
                    })
                  }
                </Geographies>
              </ComposableMap>
            </div>
            {/* Composant d'info-bulle global, lié aux data-tooltip-* définis sur Geography */}
            <Tooltip id="france-tooltip" />
          </div>
        </div>

        <div className="map-right">
          {/* Partie droite : box de détails */}
          <div className="info-card map-side-card">
            {selectedDept && (
              <button
                className="close-btn"
                onClick={() => setSelectedDept(null)}
                aria-label="Fermer"
              >
                &times;
              </button>
            )}

            {isLoading ? (
              <p className="popup-status">Chargement des données...</p>
            ) : errorMsg ? (
              <p className="error-text popup-status">{errorMsg}</p>
            ) : selectedDept ? (
              <>
                <h3>{selectedDept.properties.nom}</h3>
                <p className="popup-code">
                  <span className="db-label">Code département :</span>
                  <span className="db-value">{selectedDept.properties.code}</span>
                </p>

                {currentCritere ? (
                  <div className="db-data">
                    <h4 className="stats-title">Statistiques ({currentCritere.anneePublication})</h4>
                    <ul>
                      <li>
                        <span className="db-label">Population :</span>
                        <span className="db-value">
                          <strong>{currentCritere.nombreHabitants}</strong>{" "}
                          <span className="db-unit">habitants</span>
                        </span>
                      </li>

                      {currentTauxPop && (
                        <>
                          <li>
                            <span className="db-label">Densité :</span>
                            <span className="db-value">
                              <strong>{format2(currentTauxPop.densitePopulationAuKmCarre)}</strong>{" "}
                              <span className="db-unit">/ km²</span>
                            </span>
                          </li>
                          <li>
                            <span className="db-label">Moins de 20 ans :</span>
                            <span className="db-value">
                              <strong>{format2(currentTauxPop.pourcPopulationMoins20Ans)}</strong>
                              <span className="percent">%</span>
                            </span>
                          </li>
                          <li>
                            <span className="db-label">60 ans et plus :</span>
                            <span className="db-value">
                              <strong>{format2(currentTauxPop.pourcPopulation60AnsEtPlus)}</strong>
                              <span className="percent">%</span>
                            </span>
                          </li>
                          <li>
                            <span className="db-label">Variation sur 10 ans :</span>
                            <span className="db-value">
                              <strong>{format2(currentTauxPop.pourcVariationPopulationSur10Ans)}</strong>
                              <span className="percent">%</span>
                            </span>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                ) : (
                  <p className="no-data popup-status">
                    Aucune donnée trouvée en base pour ce département.
                  </p>
                )}
              </>
            ) : (
              <p className="no-data popup-status">
                Cliquez sur un département pour afficher les informations.
              </p>
            )}
          </div>

          <div className="map-side-card map-about-card">
            <h3 className="map-about-title">Habitat France</h3>
            <p className="map-about-text">
              Bienvenue sur notre site de cartographie de la France. Ici vous pouvez explorer les
              informations liés à chacun des départements grâce à la cartographie interactive.
              Pour celà, il suffit de cliquer sur un département pour afficher les statistiques 
              et comparer les tendances.<br />
              <br />
              Si vous souhaitez avoir accès à plus d'informations, vous pouvez consulter les autres
              pages de notre site. Par exemple, vous pouvez consulter le parc social de chaque département
              ou les chiffres d'habitat de chaque département.<br />
              <br />
              Nous espérons que vous apprécierez votre visite sur notre site.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
