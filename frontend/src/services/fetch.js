const BASE_URL = "http://localhost:8000/api";
export async function fetchData(endpoint) {
    try {
        const response = await fetch(`${BASE_URL}/${endpoint}`);

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        return await response.json();

    } catch (error) {
        console.error("Erreur API :", error);
        throw error;
    }
}
export const getLogements = () => fetchData("logements");
export const getTauxLogement = () => fetchData("taux-logement");
export const getParcSocial = () => fetchData("parc-social");