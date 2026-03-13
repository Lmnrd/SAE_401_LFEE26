import React, { useEffect, useRef } from 'react';
export default function MonGraphique() {
    const canvasRef = useRef(null);
    useEffect(() => {
        // On récupère l'objet Chart depuis la fenêtre globale (le CDN)
        const ctx = canvasRef.current.getContext('2d');

        const myChart = new window.Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar'],
                datasets: [{
                    label: 'Ventes',
                    data: [12, 19, 3],
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            }
        });
        // Nettoyage pour éviter les bugs au rechargement
        return () => myChart.destroy();
    }, []);
    return <canvas ref={canvasRef} />;
}