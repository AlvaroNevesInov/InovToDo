<template>
  <div class="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <div class="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Nova Tarefa</h2>
        <TaskForm @task-created="addTask" />
      </div>

      <div class="bg-white rounded-lg shadow-lg p-4 sm:p-6">
        <TaskFilters
          :filters="filters"
          @update-filters="updateFilters"
        />

        <TaskList
          :tasks="filteredTasks"
          @task-updated="updateTask"
          @task-deleted="deleteTask"
          @task-toggled="toggleTask"
        />
      </div>
    </div>

    <!-- Sistema de Notificações -->
    <NotificationToast />
  </div>
</template>

<script>
import { ref, computed, onMounted, defineAsyncComponent } from 'vue';
import { useNotification } from '../composables/useNotification';
import { useApiCache } from '../composables/useApiCache';
import { useKeyboardShortcuts } from '../composables/useKeyboardShortcuts';
import NotificationToast from './NotificationToast.vue';

// Lazy loading de componentes para melhor performance
const TaskForm = defineAsyncComponent(() => import('./TaskForm.vue'));
const TaskFilters = defineAsyncComponent(() => import('./TaskFilters.vue'));
const TaskList = defineAsyncComponent(() => import('./TaskList.vue'));

export default {
  name: 'TodoApp',
  components: {
    TaskForm,
    TaskFilters,
    TaskList,
    NotificationToast,
  },
  setup() {
    const tasks = ref([]);
    const filters = ref({
      status: 'all',
      priority: 'all',
      due_date: '',
    });

    const { success, error } = useNotification();
    const { fetchWithCache, removeCache } = useApiCache();

    const fetchTasks = async () => {
      try {
        const data = await fetchWithCache('tasks', async () => {
          const response = await fetch('/tasks', {
            headers: {
              'Accept': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error('Erro ao carregar tarefas');
          }

          const result = await response.json();
          // Suporte para paginação - pegar só os data
          return result.data || result;
        });

        tasks.value = data;
      } catch (err) {
        error('Erro ao carregar tarefas', err.message);
        console.error('Error fetching tasks:', err);
      }
    };

    const addTask = async (taskData) => {
      try {
        const response = await fetch('/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
          },
          body: JSON.stringify(taskData),
        });

        if (!response.ok) {
          throw new Error('Erro ao criar tarefa');
        }

        const newTask = await response.json();
        tasks.value.unshift(newTask);

        // Invalida cache e mostra notificação de sucesso
        removeCache('tasks');
        success('Tarefa criada com sucesso!');
      } catch (err) {
        error('Erro ao criar tarefa', err.message);
        console.error('Error creating task:', err);
      }
    };

    const updateTask = async (taskId, taskData) => {
      try {
        const response = await fetch(`/tasks/${taskId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
          },
          body: JSON.stringify(taskData),
        });

        if (!response.ok) {
          throw new Error('Erro ao atualizar tarefa');
        }

        const updatedTask = await response.json();
        const index = tasks.value.findIndex(t => t.id === taskId);
        if (index !== -1) {
          tasks.value[index] = updatedTask;
        }

        removeCache('tasks');
        success('Tarefa atualizada com sucesso!');
      } catch (err) {
        error('Erro ao atualizar tarefa', err.message);
        console.error('Error updating task:', err);
      }
    };

    const deleteTask = async (taskId) => {
      try {
        const response = await fetch(`/tasks/${taskId}`, {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
          },
        });

        if (!response.ok) {
          throw new Error('Erro ao excluir tarefa');
        }

        tasks.value = tasks.value.filter(t => t.id !== taskId);
        removeCache('tasks');
        success('Tarefa excluída com sucesso!');
      } catch (err) {
        error('Erro ao excluir tarefa', err.message);
        console.error('Error deleting task:', err);
      }
    };

    const toggleTask = async (taskId) => {
      try {
        const response = await fetch(`/tasks/${taskId}/toggle`, {
          method: 'PATCH',
          headers: {
            'Accept': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
          },
        });

        if (!response.ok) {
          throw new Error('Erro ao marcar tarefa');
        }

        const updatedTask = await response.json();
        const index = tasks.value.findIndex(t => t.id === taskId);
        if (index !== -1) {
          tasks.value[index] = updatedTask;
        }

        removeCache('tasks');
      } catch (err) {
        error('Erro ao marcar tarefa', err.message);
        console.error('Error toggling task:', err);
      }
    };

    const updateFilters = (newFilters) => {
      filters.value = newFilters;
    };

    const filteredTasks = computed(() => {
      let filtered = [...tasks.value];

      if (filters.value.status !== 'all') {
        filtered = filtered.filter(task => {
          if (filters.value.status === 'completed') {
            return task.is_completed;
          } else if (filters.value.status === 'pending') {
            return !task.is_completed;
          }
          return true;
        });
      }

      if (filters.value.priority !== 'all') {
        filtered = filtered.filter(task => task.priority === filters.value.priority);
      }

      if (filters.value.due_date) {
        filtered = filtered.filter(task => task.due_date === filters.value.due_date);
      }

      return filtered;
    });

    // Atalhos de teclado
    useKeyboardShortcuts([
      {
        key: 'r',
        ctrl: true,
        handler: () => {
          fetchTasks();
          success('Lista de tarefas atualizada!');
        },
      },
      {
        key: 'f',
        ctrl: true,
        handler: () => {
          // Focar no primeiro input do formulário
          const firstInput = document.querySelector('#title');
          if (firstInput) {
            firstInput.focus();
          }
        },
      },
    ]);

    onMounted(() => {
      fetchTasks();
    });

    return {
      tasks,
      filters,
      filteredTasks,
      addTask,
      updateTask,
      deleteTask,
      toggleTask,
      updateFilters,
    };
  },
};
</script>
