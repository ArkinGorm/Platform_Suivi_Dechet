import React, { useState, useEffect } from 'react';

const images = [
  {
    url: 'https://images.unsplash.com/photo-1528323273322-d81458248d40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    title: 'Gestion intelligente',
    description: 'Optimisez la collecte des déchets'
  },
  {
    url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    title: 'Capteurs connectés',
    description: 'Suivez le remplissage en temps réel'
  },
  {
    url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    title: 'Ville plus propre',
    description: 'Réduisez votre impact environnemental'
  }
];

const AuthCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-full w-full bg-green-800 rounded-l-2xl overflow-hidden hidden lg:block">
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
        >
          <img
            src={img.url}
            alt={img.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-12 left-8 text-white">
            <h3 className="text-3xl font-bold mb-2">{img.title}</h3>
            <p className="text-lg text-gray-200">{img.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AuthCarousel;