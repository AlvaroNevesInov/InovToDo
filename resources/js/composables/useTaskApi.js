import { ref } from 'vue';
import { useNotification } from './useNotification';
import { useApiCache } from './useApiCache';

/**
 * Composable para gerenciamento centralizado de operações de API de tarefas
 *
 * Fornece métodos para todas as operações CRUD de tarefas com:
 * - Tratamento de erros consistente
 * - Estados de loading
 * - Integração com sistema de notificações
 * - Gerenciamento automático de cache
 * - Headers HTTP centralizados (CSRF, Content-Type, Accept)
 *
 * Características:
 * - Estados de loading individuais para cada operação
 * - Notificações automáticas de sucesso/erro
 * - Invalidação automática de cache
 * - Tratamento robusto de erros de rede
 * - Suporte a validação de resposta HTTP
 *
 * @returns {Object} Objeto com métodos e estados de API
 * @returns {Ref<boolean>} isLoading - Estado global de loading
 * @returns {Ref<boolean>} isFetching - Loading ao buscar tarefas
 * @returns {Ref<boolean>} isCreating - Loading ao criar tarefa
 * @returns {Ref<boolean>} isUpdating - Loading ao atualizar tarefa
 * @returns {Ref<boolean>} isDeleting - Loading ao deletar tarefa
 * @returns {Ref<boolean>} isToggling - Loading ao alternar status
 * @returns {Function} fetchTasks - Busca todas as tarefas
 * @returns {Function} createTask - Cria nova tarefa
 * @returns {Function} updateTask - Atualiza tarefa existente
 * @returns {Function} deleteTask - Deleta tarefa
 * @returns {Function} toggleTask - Alterna status de conclusão
 *
 * @example
 * // Uso básico
 * const { fetchTasks, createTask, isLoading, isFetching } = useTaskApi();
 *
 * // Buscar tarefas
 * const tasks = await fetchTasks();
 * if (isFetching.value) console.log('Carregando...');
 *
 * // Criar tarefa
 * const newTask = await createTask({
 *   title: 'Nova tarefa',
 *   description: 'Descrição',
 *   priority: 'high'
 * });
 *
 * // Atualizar tarefa
 * await updateTask(taskId, { title: 'Título atualizado' });
 *
 * // Deletar tarefa
 * await deleteTask(taskId);
 *
 * // Alternar status
 * await toggleTask(taskId);
 */
export function useTaskApi() {
  // Estados de loading
  const isFetching = ref(false);
  const isCreating = ref(false);
  const isUpdating = ref(false);
  const isDeleting = ref(false);
  const isToggling = ref(false);

  // Estado global de loading (qualquer operação em andamento)
  const isLoading = ref(false);

  const { success, error } = useNotification();
  const { fetchWithCache, removeCache } = useApiCache();

  /**
   * Obtém o token CSRF do meta tag da página
   *
   * @returns {string} Token CSRF
   * @throws {Error} Se o token não for encontrado
   */
  const getCsrfToken = () => {
    const token = document.querySelector('meta[name="csrf-token"]')?.content;
    if (!token) {
      throw new Error('CSRF token não encontrado');
    }
    return token;
  };

  /**
   * Método auxiliar para fazer requisições HTTP com tratamento de erros
   *
   * @param {string} url - URL da requisição
   * @param {Object} options - Opções do fetch (method, headers, body, etc)
   * @returns {Promise<any>} Resposta parseada como JSON
   * @throws {Error} Se a requisição falhar
   */
  const apiRequest = async (url, options = {}) => {
    const defaultHeaders = {
      'Accept': 'application/json',
    };

    // Adiciona CSRF token para métodos que modificam dados
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(options.method?.toUpperCase())) {
      defaultHeaders['X-CSRF-TOKEN'] = getCsrfToken();
    }

    // Adiciona Content-Type para requisições com body
    if (options.body && typeof options.body === 'string') {
      defaultHeaders['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      // Tenta extrair mensagem de erro do backend
      let errorMessage = 'Erro na requisição';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // Se não conseguir parsear, usa mensagem genérica baseada no status
        errorMessage = `Erro ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  };

  /**
   * Busca todas as tarefas da API
   *
   * Utiliza cache com TTL de 5 minutos para melhorar performance.
   * Em caso de erro, exibe notificação e retorna array vazio.
   *
   * @returns {Promise<Array>} Lista de tarefas
   *
   * @example
   * const tasks = await fetchTasks();
   * console.log(`${tasks.length} tarefas carregadas`);
   */
  const fetchTasks = async () => {
    isFetching.value = true;
    isLoading.value = true;

    try {
      const data = await fetchWithCache('tasks', async () => {
        const result = await apiRequest('/tasks');
        // Suporte para paginação - pegar só os data se existir
        return result.data || result;
      });

      return data;
    } catch (err) {
      error('Erro ao carregar tarefas', err.message);
      console.error('Error fetching tasks:', err);
      return [];
    } finally {
      isFetching.value = false;
      isLoading.value = false;
    }
  };

  /**
   * Cria uma nova tarefa
   *
   * @param {Object} taskData - Dados da tarefa
   * @param {string} taskData.title - Título da tarefa (obrigatório)
   * @param {string} [taskData.description] - Descrição detalhada
   * @param {string} [taskData.priority='medium'] - Prioridade (low, medium, high)
   * @param {string} [taskData.due_date] - Data de vencimento (formato: YYYY-MM-DD)
   * @returns {Promise<Object|null>} Tarefa criada ou null em caso de erro
   *
   * @example
   * const task = await createTask({
   *   title: 'Implementar feature X',
   *   description: 'Adicionar funcionalidade Y',
   *   priority: 'high',
   *   due_date: '2026-01-10'
   * });
   */
  const createTask = async (taskData) => {
    isCreating.value = true;
    isLoading.value = true;

    try {
      const newTask = await apiRequest('/tasks', {
        method: 'POST',
        body: JSON.stringify(taskData),
      });

      // Invalida cache e mostra notificação de sucesso
      removeCache('tasks');
      success('Tarefa criada com sucesso!');

      return newTask;
    } catch (err) {
      error('Erro ao criar tarefa', err.message);
      console.error('Error creating task:', err);
      return null;
    } finally {
      isCreating.value = false;
      isLoading.value = false;
    }
  };

  /**
   * Atualiza uma tarefa existente
   *
   * @param {number} taskId - ID da tarefa a atualizar
   * @param {Object} taskData - Dados atualizados da tarefa
   * @returns {Promise<Object|null>} Tarefa atualizada ou null em caso de erro
   *
   * @example
   * const updated = await updateTask(42, {
   *   title: 'Título atualizado',
   *   priority: 'low'
   * });
   */
  const updateTask = async (taskId, taskData) => {
    isUpdating.value = true;
    isLoading.value = true;

    try {
      const updatedTask = await apiRequest(`/tasks/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify(taskData),
      });

      removeCache('tasks');
      success('Tarefa atualizada com sucesso!');

      return updatedTask;
    } catch (err) {
      error('Erro ao atualizar tarefa', err.message);
      console.error('Error updating task:', err);
      return null;
    } finally {
      isUpdating.value = false;
      isLoading.value = false;
    }
  };

  /**
   * Deleta uma tarefa
   *
   * @param {number} taskId - ID da tarefa a deletar
   * @returns {Promise<boolean>} true se deletado com sucesso, false caso contrário
   *
   * @example
   * const deleted = await deleteTask(42);
   * if (deleted) console.log('Tarefa removida');
   */
  const deleteTask = async (taskId) => {
    isDeleting.value = true;
    isLoading.value = true;

    try {
      await apiRequest(`/tasks/${taskId}`, {
        method: 'DELETE',
      });

      removeCache('tasks');
      success('Tarefa excluída com sucesso!');

      return true;
    } catch (err) {
      error('Erro ao excluir tarefa', err.message);
      console.error('Error deleting task:', err);
      return false;
    } finally {
      isDeleting.value = false;
      isLoading.value = false;
    }
  };

  /**
   * Alterna o status de conclusão de uma tarefa
   *
   * @param {number} taskId - ID da tarefa
   * @returns {Promise<Object|null>} Tarefa atualizada ou null em caso de erro
   *
   * @example
   * const task = await toggleTask(42);
   * console.log(`Tarefa ${task.is_completed ? 'concluída' : 'pendente'}`);
   */
  const toggleTask = async (taskId) => {
    isToggling.value = true;
    isLoading.value = true;

    try {
      const updatedTask = await apiRequest(`/tasks/${taskId}/toggle`, {
        method: 'PATCH',
      });

      removeCache('tasks');
      // Não mostra notificação no toggle para não poluir a UI

      return updatedTask;
    } catch (err) {
      error('Erro ao marcar tarefa', err.message);
      console.error('Error toggling task:', err);
      return null;
    } finally {
      isToggling.value = false;
      isLoading.value = false;
    }
  };

  return {
    // Estados de loading
    isLoading,
    isFetching,
    isCreating,
    isUpdating,
    isDeleting,
    isToggling,

    // Métodos de API
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTask,
  };
}
