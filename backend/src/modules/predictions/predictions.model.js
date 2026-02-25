/**
 * Modèles de prédiction simples pour l'évolution du remplissage
 */

class PredictionModel {
  // 1. Moyenne mobile (simple)
  movingAverage(data, windowSize = 3) {
    if (data.length < windowSize) {
      return data.length > 0 
        ? data.reduce((a, b) => a + b, 0) / data.length 
        : 0;
    }

    const recent = data.slice(-windowSize);
    return recent.reduce((a, b) => a + b, 0) / windowSize;
  }

  // 2. Régression linéaire simple
  linearRegression(data) {
    const n = data.length;
    if (n < 2) return { slope: 0, intercept: data[0] || 0 };

    // Préparer les données (x = index, y = valeur)
    const x = Array.from({ length: n }, (_, i) => i);
    const y = data;

    // Calculer les moyennes
    const meanX = x.reduce((a, b) => a + b, 0) / n;
    const meanY = y.reduce((a, b) => a + b, 0) / n;

    // Calculer la pente (slope)
    let numerator = 0;
    let denominator = 0;
    for (let i = 0; i < n; i++) {
      numerator += (x[i] - meanX) * (y[i] - meanY);
      denominator += (x[i] - meanX) ** 2;
    }

    const slope = denominator === 0 ? 0 : numerator / denominator;
    const intercept = meanY - slope * meanX;

    return { slope, intercept };
  }

  // 3. Prédire la prochaine valeur par régression
  predictNext(data) {
    if (data.length === 0) return 0;
    if (data.length === 1) return data[0];

    const { slope, intercept } = this.linearRegression(data);
    const nextIndex = data.length;
    
    let prediction = intercept + slope * nextIndex;
    
    // Limiter entre 0 et 100
    prediction = Math.max(0, Math.min(100, prediction));
    
    return Math.round(prediction * 10) / 10; // Arrondi à 1 décimale
  }

  // 4. Prédire avec prise en compte de la saisonnalité (heure, jour)
  predictWithSeasonality(data, timestamps, targetHour = null) {
    if (data.length === 0) return 0;

    // Si on a une heure cible, filtrer les données de cette heure
    if (targetHour !== null && timestamps.length > 0) {
      const hourlyData = [];
      for (let i = 0; i < timestamps.length; i++) {
        const hour = new Date(timestamps[i]).getHours();
        if (hour === targetHour) {
          hourlyData.push(data[i]);
        }
      }
      
      if (hourlyData.length > 0) {
        return this.movingAverage(hourlyData, 3);
      }
    }

    // Sinon, utiliser la moyenne mobile
    return this.movingAverage(data, 5);
  }

  // 5. Calculer l'intervalle de confiance
  confidenceInterval(data, prediction) {
    if (data.length < 2) {
      return { min: 0, max: 100 };
    }

    // Calculer l'écart-type
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    const squaredDiffs = data.map(v => Math.pow(v - mean, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / data.length;
    const stdDev = Math.sqrt(variance);

    // Intervalle de confiance à 95%
    const margin = stdDev * 1.96;
    
    return {
      min: Math.max(0, Math.min(100, prediction - margin)),
      max: Math.max(0, Math.min(100, prediction + margin))
    };
  }
}

module.exports = new PredictionModel();