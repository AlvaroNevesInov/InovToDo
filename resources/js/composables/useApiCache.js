/**
 * Composable para cache de API com localStorage
 */
export function useApiCache() {
  const CACHE_PREFIX = 'inovtodo_cache_';
  const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutos

  /**
   * Define um item no cache
   */
  const setCache = (key, data, ttl = DEFAULT_TTL) => {
    const cacheData = {
      data,
      timestamp: Date.now(),
      ttl,
    };

    try {
      localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Erro ao salvar cache:', error);
    }
  };

  /**
   * Obtém um item do cache
   */
  const getCache = (key) => {
    try {
      const cached = localStorage.getItem(CACHE_PREFIX + key);
      if (!cached) return null;

      const cacheData = JSON.parse(cached);
      const age = Date.now() - cacheData.timestamp;

      // Verifica se o cache expirou
      if (age > cacheData.ttl) {
        removeCache(key);
        return null;
      }

      return cacheData.data;
    } catch (error) {
      console.warn('Erro ao ler cache:', error);
      return null;
    }
  };

  /**
   * Remove um item do cache
   */
  const removeCache = (key) => {
    try {
      localStorage.removeItem(CACHE_PREFIX + key);
    } catch (error) {
      console.warn('Erro ao remover cache:', error);
    }
  };

  /**
   * Limpa todo o cache
   */
  const clearCache = () => {
    try {
      Object.keys(localStorage)
        .filter(key => key.startsWith(CACHE_PREFIX))
        .forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.warn('Erro ao limpar cache:', error);
    }
  };

  /**
   * Fetch com cache
   */
  const fetchWithCache = async (key, fetchFn, ttl = DEFAULT_TTL) => {
    // Tenta obter do cache primeiro
    const cached = getCache(key);
    if (cached) {
      return cached;
    }

    // Se não está em cache, faz o fetch
    const data = await fetchFn();
    setCache(key, data, ttl);
    return data;
  };

  return {
    setCache,
    getCache,
    removeCache,
    clearCache,
    fetchWithCache,
  };
}
