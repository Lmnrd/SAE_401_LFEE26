import { useState } from "react";
import Sidebar from "./pages/sidebar";
import MapFrance from "./components/MapFrance";
import ParcSocialPage from "./pages/ParcSocialPage";
import TauxLogementsPage from "./pages/TauxLogements";
import LogementsPage from "./pages/Logement";

function App() {
  const [page, setPage] = useState("main");

  const renderPage = () => {
    switch (page) {
      case "parc-social":
        return <ParcSocialPage />;
      case "taux-logements":
        return <TauxLogementsPage />;
      case "logements":
        return <LogementsPage />;
      default:
        return <MapFrance />;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Sidebar setPage={setPage} />

      <div style={{ flex: 1, padding: "0" }}>
        {renderPage()}
      </div>
    </div>
  );
}


export default App;