import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useApiCache } from '@/composables/useApiCache';

describe('useApiCache', () => {
  beforeEach(() => {
    // Limpa localStorage antes de cada teste
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('setCache e getCache', () => {
    it('deve armazenar e recuperar dados do cache', () => {
      const { setCache, getCache } = useApiCache();
      const testData = { id: 1, name: 'Test' };

      setCache('test-key', testData);
      const cached = getCache('test-key');

      expect(cached).toEqual(testData);
    });

    it('deve retornar null para chave inexistente', () => {
      const { getCache } = useApiCache();

      const cached = getCache('non-existent-key');

      expect(cached).toBeNull();
    });

    it('deve armazenar dados com TTL customizado', () => {
      const { setCache, getCache } = useApiCache();
      const testData = { id: 1, name: 'Test' };
      const customTTL = 10000; // 10 segundos

      setCache('test-key', testData, customTTL);
      const cached = getCache('test-key');

      expect(cached).toEqual(testData);
    });

    it('deve retornar null quando cache expirou', () => {
      const { setCache, getCache } = useApiCache();
      const testData = { id: 1, name: 'Test' };
      const shortTTL = -1; // TTL negativo para expirar imediatamente

      setCache('test-key', testData, shortTTL);
      const cached = getCache('test-key');

      expect(cached).toBeNull();
    });
  });

  describe('removeCache', () => {
    it('deve remover item do cache', () => {
      const { setCache, getCache, removeCache } = useApiCache();
      const testData = { id: 1, name: 'Test' };

      setCache('test-key', testData);
      expect(getCache('test-key')).toEqual(testData);

      removeCache('test-key');
      expect(getCache('test-key')).toBeNull();
    });
  });

  describe('clearCache', () => {
    it('deve limpar todo o cache', () => {
      const { setCache, getCache, clearCache } = useApiCache();

      setCache('key1', { data: 1 });
      setCache('key2', { data: 2 });
      setCache('key3', { data: 3 });

      expect(getCache('key1')).toBeTruthy();
      expect(getCache('key2')).toBeTruthy();
      expect(getCache('key3')).toBeTruthy();

      clearCache();

      expect(getCache('key1')).toBeNull();
      expect(getCache('key2')).toBeNull();
      expect(getCache('key3')).toBeNull();
    });

    it('não deve remover itens que não são do cache da aplicação', () => {
      const { clearCache } = useApiCache();

      // Adiciona item sem o prefixo do cache
      localStorage.setItem('other-key', 'other-value');

      clearCache();

      expect(localStorage.getItem('other-key')).toBe('other-value');
    });
  });

  describe('fetchWithCache', () => {
    it('deve fazer fetch e armazenar em cache', async () => {
      const { fetchWithCache, getCache } = useApiCache();
      const mockData = { id: 1, name: 'Test' };
      const fetchFn = vi.fn().mockResolvedValue(mockData);

      const result = await fetchWithCache('test-key', fetchFn);

      expect(result).toEqual(mockData);
      expect(fetchFn).toHaveBeenCalledTimes(1);
      expect(getCache('test-key')).toEqual(mockData);
    });

    it('deve retornar dados do cache sem fazer novo fetch', async () => {
      const { fetchWithCache, setCache } = useApiCache();
      const cachedData = { id: 1, name: 'Cached' };
      const newData = { id: 2, name: 'New' };
      const fetchFn = vi.fn().mockResolvedValue(newData);

      // Pré-popula o cache
      setCache('test-key', cachedData);

      const result = await fetchWithCache('test-key', fetchFn);

      expect(result).toEqual(cachedData);
      expect(fetchFn).not.toHaveBeenCalled();
    });

    it('deve fazer novo fetch quando cache expirou', async () => {
      const { fetchWithCache, setCache } = useApiCache();
      const oldData = { id: 1, name: 'Old' };
      const newData = { id: 2, name: 'New' };
      const fetchFn = vi.fn().mockResolvedValue(newData);

      // Armazena com TTL expirado
      setCache('test-key', oldData, -1);

      const result = await fetchWithCache('test-key', fetchFn);

      expect(result).toEqual(newData);
      expect(fetchFn).toHaveBeenCalledTimes(1);
    });

    it('deve usar TTL customizado', async () => {
      const { fetchWithCache, getCache } = useApiCache();
      const mockData = { id: 1, name: 'Test' };
      const fetchFn = vi.fn().mockResolvedValue(mockData);
      const customTTL = 60000; // 1 minuto

      await fetchWithCache('test-key', fetchFn, customTTL);

      expect(getCache('test-key')).toEqual(mockData);
    });
  });

});
