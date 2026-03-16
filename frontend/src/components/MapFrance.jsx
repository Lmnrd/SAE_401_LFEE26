import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { geoConicConformalFrance } from "d3-composite-projections";
import { Tooltip } from "react-tooltip";
import 'react-tooltip/dist/react-tooltip.css';

import franceData from "../data/departments.json";
import "./MapFrance.css";

// The d3-composite-projections magic: positions DOM-TOM around Metropolitan France
const projection = geoConicConformalFrance()
  .scale(3200)
  .translate([450, 300]);

export default function MapFrance() {
  const [selectedDept, setSelectedDept] = useState(null);
  
  // Database data states
  const [critereData, setCritereData] = useState([]);
  const [tauxPopData, setTauxPopData] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // We fetch both endpoints in parallel
        const [resCritere, resTauxPop] = await Promise.all([
          fetch("http://localhost:8000/api/critere"),
          fetch("http://localhost:8000/api/taux-population")
        ]);

        if (!resCritere.ok || !resTauxPop.ok) {
          throw new Error("Erreur lors de la récupération des données.");
        }

        const dataCritere = await resCritere.json();
        const dataTauxPop = await resTauxPop.json();

        setCritereData(dataCritere);
        setTauxPopData(dataTauxPop);
      } catch (err) {
        console.error(err);
        setErrorMsg("Impossible de charger les données depuis l'API.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeptClick = (geo) => {
    setSelectedDept(geo);
  };

  // Find data for selected dept
  let currentCritere = null;
  // According to the DB schema, the tables don't have an explicit link. We assume indices match for now.
  // We'll try to find the Critere by checking nomDepartement.
  let currentTauxPop = null;

  if (selectedDept) {
    const geoNom = selectedDept.properties.nom; // from geojson
    
    // Find matching critere by department name (case insensitive, handle accents if needed, but standard should match)
    // A more robust way would be comparing codes if DB had the codes.
    const deptIndex = critereData.findIndex(
      (c) => c.nomDepartement && c.nomDepartement.toLowerCase() === geoNom.toLowerCase()
    );

    if (deptIndex !== -1) {
      currentCritere = critereData[deptIndex];
      // Assuming taux_population row index matches the critere row index in the simple setup.
      currentTauxPop = tauxPopData[deptIndex];
    }
  }

  return (
    <div className="map-container">
      <div className="map-view">
        <ComposableMap
          projection={projection}
          width={900}
          height={600}
          style={{ width: "100%", height: "auto" }}
        >
          <Geographies geography={franceData}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const isSelected = selectedDept && selectedDept.properties.code === geo.properties.code;
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => handleDeptClick(geo)}
                    data-tooltip-id="france-tooltip"
                    data-tooltip-content={`${geo.properties.nom} (${geo.properties.code})`}
                    style={{
                      default: {
                        fill: isSelected ? "#3498db" : "#bdc3c7",
                        stroke: "#ffffff",
                        strokeWidth: 0.5,
                        outline: "none",
                        transition: "all 250ms"
                      },
                      hover: {
                        fill: "#2980b9",
                        stroke: "#ffffff",
                        strokeWidth: 0.5,
                        outline: "none",
                        cursor: "pointer",
                        transition: "all 250ms"
                      },
                      pressed: {
                        fill: "#1f618d",
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
        <Tooltip id="france-tooltip" />
      </div>
      
      {/* Modal Popup for Map Info */}
      {selectedDept && (
        <div className="map-info-overlay" onClick={() => setSelectedDept(null)}>
          <div className="info-card" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedDept(null)} aria-label="Fermer">
              &times;
            </button>
            
            <h3>{selectedDept.properties.nom}</h3>
            <p>Code département : <strong>{selectedDept.properties.code}</strong></p>
            
            {isLoading ? (
              <p>Chargement des données...</p>
            ) : errorMsg ? (
              <p className="error-text">{errorMsg}</p>
            ) : currentCritere ? (
              <div className="db-data">
                <h4>Statistiques ({currentCritere.anneePublication})</h4>
                <ul>
                  <li><strong>Population :</strong> {currentCritere.nombreHabitants} habitants</li>
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
              <p className="no-data">Aucune donnée trouvée en base pour ce département.</p>
            )}
            
          </div>
        </div>
      )}
    </div>
  );
}
