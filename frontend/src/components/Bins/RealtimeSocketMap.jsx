import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useSocket } from '../../contexts/SocketContext';
import { bacService } from '../../services/bacService';

// Configuration des icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const getMarkerColor = (etat) => {
  switch(etat) {
    case 'rouge': return '#ef4444';
    case 'orange': return '#f97316';
    case 'vert': return '#22c55e';
    default: return '#6b7280';
  }
};

const createColoredIcon = (color) => {
  return L.divIcon({
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
    className: 'custom-marker',
    iconSize: [24, 24],
    popupAnchor: [0, -12]
  });
};

const RealtimeSocketMap = ({ role }) => {
  const [bacs, setBacs] = useState([]);
  const [loading, setLoading] = useState(true);
  const socket = useSocket();
  const mapRef = useRef();

  const fetchBacs = async () => {
    try {
      let response;
      if (role === 'citoyen') {
        response = await bacService.getMesBacs();
      } else {
        response = await bacService.getAllBacs();
      }
      setBacs(response.data);
    } catch (error) {
      console.error('Erreur chargement bacs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Chargement initial
  useEffect(() => {
    fetchBacs();
  }, [role]);

  // Écoute des événements temps réel
  useEffect(() => {
    if (!socket) return;

    socket.on('nouvelle-donnee-capteur', (data) => {
      console.log('📡 Nouvelle donnée reçue via WebSocket:', data);
      
      // Mettre à jour la liste des bacs
      setBacs(prevBacs =>
        prevBacs.map(bac =>
          bac.id === data.bac_id
            ? { ...bac, dernier_niveau: data.niveau }
            : bac
        )
      );
    });

    return () => {
      socket.off('nouvelle-donnee-capteur');
    };
  }, [socket]);

  if (loading) {
    return <div className="text-center py-10">Chargement de la carte...</div>;
  }

  return (
    <div className="relative">
      <div className="absolute top-4 right-4 z-10 bg-green-600 text-white px-3 py-1 rounded shadow text-sm flex items-center">
        <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse mr-2"></span>
        Temps réel activé
      </div>

      <MapContainer
        center={[14.7167, -17.4677]}
        zoom={12}
        style={{ height: '600px', width: '100%', borderRadius: '0.5rem' }}
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {bacs.map((bac) => (
          <Marker
            key={bac.id}
            position={[bac.latitude, bac.longitude]}
            icon={createColoredIcon(getMarkerColor(bac.etat))}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold">{bac.reference}</h3>
                <p>État : {bac.etat || 'Inconnu'}</p>
                {bac.dernier_niveau && (
                  <p>Niveau : {bac.dernier_niveau}%</p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  {bac.dernier_releve 
                    ? new Date(bac.dernier_releve).toLocaleString()
                    : 'Aucun relevé'}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default RealtimeSocketMap;