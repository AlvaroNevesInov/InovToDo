<template>
  <div class="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <div class="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Nova Tarefa</h2>
        <TaskForm @task-created="handleTaskCreated" :is-loading="isCreating" />
      </div>

      <!-- Dashboard de Estatísticas -->
      <TaskStats :tasks="tasks" />

      <div class="bg-white rounded-lg shadow-lg p-4 sm:p-6">
        <TaskFilters
          :filters="filters"
          :tasks="tasks"
          @update-filters="updateFilters"
        />

        <TaskList
          :tasks="filteredTasks"
          :is-loading="isFetching"
          @task-updated="handleTaskUpdated"
          @task-deleted="handleTaskDeleted"
          @task-toggled="handleTaskToggled"
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
import { useTaskApi } from '../composables/useTaskApi';
import { useKeyboardShortcuts } from '../composables/useKeyboardShortcuts';
import NotificationToast from './NotificationToast.vue';

// Lazy loading de componentes para melhor performance
const TaskForm = defineAsyncComponent(() => import('./TaskForm.vue'));
const TaskFilters = defineAsyncComponent(() => import('./TaskFilters.vue'));
const TaskList = defineAsyncComponent(() => import('./TaskList.vue'));
const TaskStats = defineAsyncComponent(() => import('./TaskStats.vue'));

export default {
  name: 'TodoApp',
  components: {
    TaskForm,
    TaskFilters,
    TaskList,
    TaskStats,
    NotificationToast,
  },
  setup() {
    const tasks = ref([]);
    const filters = ref({
      status: 'all',
      priority: 'all',
      due_date: '',
    });

    const { success } = useNotification();

    // Usa o novo composable centralizado de API
    const {
      fetchTasks: apiFetchTasks,
      createTask,
      updateTask: apiUpdateTask,
      deleteTask: apiDeleteTask,
      toggleTask: apiToggleTask,
      isFetching,
      isCreating,
      isUpdating,
      isDeleting,
      isToggling,
    } = useTaskApi();

    /**
     * Carrega todas as tarefas da API
     */
    const loadTasks = async () => {
      const data = await apiFetchTasks();
      tasks.value = data;
    };

    /**
     * Handler para criação de nova tarefa
     */
    const handleTaskCreated = async (taskData) => {
      const newTask = await createTask(taskData);
      if (newTask) {
        tasks.value.unshift(newTask);
      }
    };

    /**
     * Handler para atualização de tarefa
     */
    const handleTaskUpdated = async (taskId, taskData) => {
      const updatedTask = await apiUpdateTask(taskId, taskData);
      if (updatedTask) {
        const index = tasks.value.findIndex(t => t.id === taskId);
        if (index !== -1) {
          tasks.value[index] = updatedTask;
        }
      }
    };

    /**
     * Handler para exclusão de tarefa
     */
    const handleTaskDeleted = async (taskId) => {
      const deleted = await apiDeleteTask(taskId);
      if (deleted) {
        tasks.value = tasks.value.filter(t => t.id !== taskId);
      }
    };

    /**
     * Handler para toggle de status de tarefa
     */
    const handleTaskToggled = async (taskId) => {
      const updatedTask = await apiToggleTask(taskId);
      if (updatedTask) {
        const index = tasks.value.findIndex(t => t.id === taskId);
        if (index !== -1) {
          tasks.value[index] = updatedTask;
        }
      }
    };

    /**
     * Atualiza os filtros de visualização
     */
    const updateFilters = (newFilters) => {
      filters.value = newFilters;
    };

    /**
     * Computed property para tarefas filtradas
     */
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
          loadTasks();
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
      loadTasks();
    });

    return {
      tasks,
      filters,
      filteredTasks,
      handleTaskCreated,
      handleTaskUpdated,
      handleTaskDeleted,
      handleTaskToggled,
      updateFilters,
      isFetching,
      isCreating,
      isUpdating,
      isDeleting,
      isToggling,
    };
  },
};
</script>
