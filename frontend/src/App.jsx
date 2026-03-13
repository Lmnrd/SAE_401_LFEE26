import TestAff from "./TestAff";

function App() {
  return (
    <div className="app-main">
      <header style={{ padding: '2rem 0', borderBottom: '1px solid var(--border)' }}>
        <h1>SAE 401 - Dashboard</h1>
      </header>
      <main>
        <TestAff />
      </main>
      <footer style={{ padding: '2rem', marginTop: 'auto', opacity: 0.6, fontSize: '0.8rem' }}>
        <p>&copy; 2026 - SAE 401 LFEE26 - React + Symfony API</p>
      </footer>
    </div>
  );
}

export default App;