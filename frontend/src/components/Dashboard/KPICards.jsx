import React from 'react';

const KPICards = ({ data, role }) => {
  if (!data) return null;

  // Définir les cartes selon le rôle
  const getCards = () => {
    // Extraction sécurisée des données
    const totalBacs = data?.bacs?.total || 0;
    const mesSignalements = data?.mesSignalements || 0;
    const bacsRouges = data?.bacs?.rouges || 0;
    const signalementsAttente = data?.signalements?.en_attente || 0;
    const tauxMoyen = data?.bacs?.taux_remplissage_moyen || 0;

    const commonCards = [
      {
        title: 'Total bacs',
        value: totalBacs,
        icon: '🗑️',
        color: 'bg-blue-500'
      }
    ];

    if (role === 'citoyen') {
      return [
        ...commonCards,
        {
          title: 'Mes signalements',
          value: mesSignalements,
          icon: '📝',
          color: 'bg-yellow-500'
        }
      ];
    }

    // Municipalité et admin
    return [
      ...commonCards,
      {
        title: 'Bacs rouges',
        value: bacsRouges,
        icon: '🔴',
        color: 'bg-red-500'
      },
      {
        title: 'Signalements',
        value: signalementsAttente,
        icon: '⚠️',
        color: 'bg-orange-500'
      },
      {
        title: 'Taux moyen',
        value: `${tauxMoyen}%`,
        icon: '📊',
        color: 'bg-green-500'
      }
    ];
  };

  const cards = getCards();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-full ${card.color} flex items-center justify-center text-white text-2xl`}>
              {card.icon}
            </div>
            <span className="text-3xl font-bold">{card.value}</span>
          </div>
          <h3 className="text-gray-600 font-medium">{card.title}</h3>
        </div>
      ))}
    </div>
  );
};

export default KPICards;