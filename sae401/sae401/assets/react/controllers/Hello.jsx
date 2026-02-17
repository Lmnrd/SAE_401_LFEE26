import React from 'react';

export default function Hello({ name }) {
    return (
        <div style={{
            padding: '20px',
            backgroundColor: '#f0f9ff',
            border: '2px solid #0ea5e9',
            borderRadius: '12px',
            color: '#0369a1',
            fontFamily: 'sans-serif',
            maxWidth: '300px',
            margin: '20px 0'
        }}>
            <h1 style={{ margin: '0 0 10px 0', fontSize: '1.5rem' }}>Bonjour {name} !</h1>
            <p style={{ margin: 0 }}>Ceci est un composant <strong>React</strong> fonctionnel.</p>
        </div>
    );
}
