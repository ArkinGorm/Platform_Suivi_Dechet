import api from './api';

const bacServices = {
    // Récupérer tous les bacs
    getAllBacs: async () => {
        const response = await api.get('/bins');
        return response.data;
    },

    // Récupérer les bacs de l'utilisateur connecté
    getMesBacs: async () => {
        const response = await api.get('/bins/mes-bacs');
        return response.data;
    },

    // Récupérer les bacs publics
    getPublicBacs: async () => {
        const response = await api.get('/bins/publics');
        return response.data;
    },

    // Récupérer un bac par son ID
    getBacById: async (id) => {
        const response = await api.get(`/bins/${id}`);
        return response.data;
    }
};

export default bacServices;
