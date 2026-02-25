/**
 * Algorithme simple d'optimisation de tournée
 * Implémente une version basique du "voyageur de commerce"
 */

class RouteOptimizer {
  // Calculer la distance entre deux points (formule de Haversine)
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Rayon de la Terre en km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  toRad(degrees) {
    return degrees * Math.PI / 180;
  }

  // Optimiser une tournée avec l'algorithme du "plus proche voisin"
  optimizeNearestNeighbor(points, startIndex = 0) {
    const n = points.length;
    if (n === 0) return [];
    if (n === 1) return [points[0]];

    const visited = new Array(n).fill(false);
    const tour = [];
    
    // Commencer par le point de départ (dépôt)
    let currentIndex = startIndex;
    tour.push(points[currentIndex]);
    visited[currentIndex] = true;

    // Tant qu'il reste des points à visiter
    for (let i = 1; i < n; i++) {
      let nearestIndex = -1;
      let minDistance = Infinity;

      // Chercher le point non visité le plus proche
      for (let j = 0; j < n; j++) {
        if (!visited[j]) {
          const dist = this.calculateDistance(
            points[currentIndex].latitude,
            points[currentIndex].longitude,
            points[j].latitude,
            points[j].longitude
          );
          
          // Prioriser les bacs rouges (optionnel)
          if (points[j].priority === 'rouge') {
            dist = dist * 0.8; // Réduit la distance pour favoriser les rouges
          }
          
          if (dist < minDistance) {
            minDistance = dist;
            nearestIndex = j;
          }
        }
      }

      if (nearestIndex !== -1) {
        tour.push(points[nearestIndex]);
        visited[nearestIndex] = true;
        currentIndex = nearestIndex;
      }
    }

    // Retourner au dépôt (optionnel)
    // tour.push(points[startIndex]);

    return tour;
  }

  // Optimiser avec prise en compte des priorités
  optimizeWithPriority(points, depot) {
    // Séparer les bacs par priorité
    const rouges = points.filter(p => p.etat === 'rouge');
    const oranges = points.filter(p => p.etat === 'orange');
    const verts = points.filter(p => p.etat === 'vert');

    // Construire la tournée : d'abord les rouges, puis oranges, puis verts
    let tour = [depot];
    
    // Optimiser chaque groupe séparément
    if (rouges.length > 0) {
      const rougeTour = this.optimizeNearestNeighbor(rouges, 0);
      tour = tour.concat(rougeTour);
    }
    
    if (oranges.length > 0) {
      const orangeTour = this.optimizeNearestNeighbor(oranges, 0);
      tour = tour.concat(orangeTour);
    }
    
    if (verts.length > 0) {
      const vertTour = this.optimizeNearestNeighbor(verts, 0);
      tour = tour.concat(vertTour);
    }

    return tour;
  }

  // Calculer les métriques de la tournée
  calculateMetrics(tour) {
    let totalDistance = 0;
    let totalDuration = 0;
    const speed = 30; // km/h en ville

    for (let i = 0; i < tour.length - 1; i++) {
      const dist = this.calculateDistance(
        tour[i].latitude,
        tour[i].longitude,
        tour[i+1].latitude,
        tour[i+1].longitude
      );
      totalDistance += dist;
    }

    totalDuration = (totalDistance / speed) * 60; // en minutes

    return {
      distance_km: parseFloat(totalDistance.toFixed(2)),
      duree_minutes: Math.round(totalDuration),
      nombre_bacs: tour.length - 1 // exclure le dépôt
    };
  }
}

module.exports = new RouteOptimizer();