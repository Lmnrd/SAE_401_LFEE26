import { useEffect, useState } from "react";

function App() {

  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/test")
      .then(res => res.json())
      .then(data => setData(data));
  }, []);

  return (
    <div>
      <h1>Connexion React + Symfony</h1>
      {data && <p>{data.message}</p>}
    </div>
  );
}

export default App;