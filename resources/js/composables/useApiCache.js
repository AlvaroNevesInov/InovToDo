/**
 * Composable para cache de API com localStorage
 *
 * Fornece um sistema de cache para requisições de API usando localStorage do navegador.
 * Cada item de cache tem um TTL (Time To Live) configurável e expira automaticamente.
 *
 * Características:
 * - Armazenamento em localStorage com prefixo único
 * - TTL padrão de 5 minutos
 * - Invalidação automática de cache expirado
 * - Tratamento de erros robusto
 * - Suporte a TTL customizado por item
 *
 * @returns {Object} Objeto com métodos de gerenciamento de cache
 * @returns {Function} setCache - Armazena dados no cache
 * @returns {Function} getCache - Recupera dados do cache
 * @returns {Function} removeCache - Remove um item específico
 * @returns {Function} clearCache - Limpa todo o cache da aplicação
 * @returns {Function} fetchWithCache - Faz fetch com cache automático
 *
 * @example
 * // Uso básico
 * const { setCache, getCache, fetchWithCache } = useApiCache();
 *
 * // Armazenar dados
 * setCache('tasks', tasksData);
 *
 * // Recuperar dados
 * const tasks = getCache('tasks');
 *
 * // Fetch com cache automático
 * const data = await fetchWithCache('tasks', async () => {
 *   const response = await fetch('/api/tasks');
 *   return response.json();
 * });
 */
export function useApiCache() {
  /** @constant {string} Prefixo único para chaves do cache */
  const CACHE_PREFIX = 'inovtodo_cache_';

  /** @constant {number} TTL padrão em milissegundos (5 minutos) */
  const DEFAULT_TTL = 5 * 60 * 1000;

  /**
   * Armazena um item no cache com TTL
   *
   * O item é armazenado no localStorage com timestamp e TTL.
   * Se o localStorage estiver cheio ou indisponível, o erro é capturado silenciosamente.
   *
   * @param {string} key - Chave única para o item
   * @param {*} data - Dados a serem armazenados (serão serializados em JSON)
   * @param {number} [ttl=300000] - Tempo de vida em milissegundos (padrão: 5 minutos)
   *
   * @example
   * setCache('tasks', { items: [] }, 10 * 60 * 1000); // 10 minutos
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
   * Recupera um item do cache
   *
   * Verifica se o item existe e se ainda não expirou.
   * Se o item expirou, é automaticamente removido e retorna null.
   *
   * @param {string} key - Chave do item a recuperar
   * @returns {*|null} Os dados armazenados ou null se não existir/expirou
   *
   * @example
   * const tasks = getCache('tasks');
   * if (tasks) {
   *   console.log('Dados do cache:', tasks);
   * } else {
   *   console.log('Cache expirado ou não existe');
   * }
   */
  const getCache = (key) => {
    try {
      const cached = localStorage.getItem(CACHE_PREFIX + key);
      if (!cached) return null;

      const cacheData = JSON.parse(cached);
      const age = Date.now() - cacheData.timestamp;

      // Verifica se o cache expirou baseado no TTL
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
   * Remove um item específico do cache
   *
   * @param {string} key - Chave do item a remover
   *
   * @example
   * removeCache('tasks'); // Remove apenas o cache de tasks
   */
  const removeCache = (key) => {
    try {
      localStorage.removeItem(CACHE_PREFIX + key);
    } catch (error) {
      console.warn('Erro ao remover cache:', error);
    }
  };

  /**
   * Limpa todo o cache da aplicação
   *
   * Remove apenas os itens que pertencem a esta aplicação (com o prefixo correto).
   * Outros dados do localStorage de outras aplicações são preservados.
   *
   * @example
   * clearCache(); // Remove todo o cache do InovToDo
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
   * Faz fetch com cache automático
   *
   * Primeiro tenta obter dados do cache. Se não existir ou expirou,
   * executa a função de fetch, armazena o resultado e retorna.
   *
   * Esta é a forma mais conveniente de usar o sistema de cache.
   *
   * @param {string} key - Chave única para este fetch
   * @param {Function} fetchFn - Função async que retorna os dados
   * @param {number} [ttl=300000] - TTL customizado em milissegundos
   * @returns {Promise<*>} Os dados (do cache ou do fetch)
   *
   * @example
   * // Fetch com cache automático
   * const tasks = await fetchWithCache('tasks', async () => {
   *   const response = await fetch('/api/tasks');
   *   return response.json();
   * });
   *
   * // Com TTL customizado (10 minutos)
   * const data = await fetchWithCache('expensive-query', fetchFn, 10 * 60 * 1000);
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
