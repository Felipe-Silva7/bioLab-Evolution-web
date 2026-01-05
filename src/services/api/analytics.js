// Serviço de analytics simples (opcional)
export const analytics = {
  trackEvent(eventName, properties = {}) {
    if (process.env.REACT_APP_ENABLE_ANALYTICS === 'true') {
      console.log(`[Analytics] ${eventName}:`, properties);
      
      // Aqui você pode integrar com Google Analytics, Mixpanel, etc.
      // Exemplo: window.gtag('event', eventName, properties);
    }
  },

  trackExperimentStart(experimentId, userId) {
    this.trackEvent('experiment_started', {
      experiment_id: experimentId,
      user_id: userId,
      timestamp: new Date().toISOString()
    });
  },

  trackExperimentComplete(experimentId, success, score, userId) {
    this.trackEvent('experiment_completed', {
      experiment_id: experimentId,
      success: success,
      score: score,
      user_id: userId,
      timestamp: new Date().toISOString()
    });
  },

  trackPurchase(itemId, cost, userId) {
    this.trackEvent('purchase_made', {
      item_id: itemId,
      cost: cost,
      user_id: userId,
      timestamp: new Date().toISOString()
    });
  },

  trackLevelUp(level, userId) {
    this.trackEvent('level_up', {
      new_level: level,
      user_id: userId,
      timestamp: new Date().toISOString()
    });
  }
};

export default analytics;