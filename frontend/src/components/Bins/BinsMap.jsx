import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../../services/api';

// Configuration des icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Fonction pour obtenir la couleur du marqueur selon l'état
const getMarkerColor = (etat) => {
  switch (etat) {
    case 'rouge': return '#ef4444';
    case 'orange': return '#f97316';
    case 'vert': return '#22c55e';
    default: return '#6b7280';
  }
};

// Création d'une icône personnalisée avec couleur
const createColoredIcon = (color) => {
  return L.divIcon({
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
    className: 'custom-marker',
    iconSize: [24, 24],
    popupAnchor: [0, -12]
  });
};

const BinsMap = ({ filterMode = 'all' }) => {
  const [bacs, setBacs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [center] = useState([48.8566, 2.3522]); // Paris par défaut

  useEffect(() => {
    const fetchBacs = async () => {
      try {
        const response = await api.get('/bins');
        setBacs(response.data);
      } catch (error) {
        console.error('Erreur chargement des bacs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBacs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Chargement de la carte...</p>
      </div>
    );
  }

  const displayedBacs = filterMode === 'public'
    ? bacs.filter(bac => bac.proprietaire_id === null)
    : bacs;

  return (
    <div className="h-[600px] w-full rounded-lg shadow-lg overflow-hidden">
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {displayedBacs.map((bac) => (
          <Marker
            key={bac.id}
            position={[bac.latitude, bac.longitude]}
            icon={createColoredIcon(getMarkerColor(bac.etat))}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-lg">{bac.reference}</h3>
                <p className="text-sm text-gray-600">Type: {bac.type || 'Non spécifié'}</p>
                <p className="text-sm text-gray-600">Quartier: {bac.quartier_nom || 'Inconnu'}</p>
                <p className="text-sm mt-2">
                  État:
                  <span className={`ml-1 font-semibold ${bac.etat === 'rouge' ? 'text-red-600' :
                      bac.etat === 'orange' ? 'text-orange-600' :
                        'text-green-600'
                    }`}>
                    {bac.etat}
                  </span>
                </p>
                {bac.dernier_niveau && (
                  <p className="text-sm">
                    Dernier niveau: <span className="font-medium">{bac.dernier_niveau}%</span>
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  Dernier relevé: {bac.dernier_releve ? new Date(bac.dernier_releve).toLocaleString() : 'Jamais'}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default BinsMap;