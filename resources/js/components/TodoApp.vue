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
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import TaskForm from './TaskForm.vue';
import TaskFilters from './TaskFilters.vue';
import TaskList from './TaskList.vue';

export default {
  name: 'TodoApp',
  components: {
    TaskForm,
    TaskFilters,
    TaskList,
  },
  setup() {
    const tasks = ref([]);
    const filters = ref({
      status: 'all',
      priority: 'all',
      due_date: '',
    });

    const fetchTasks = async () => {
      try {
        const response = await fetch('/tasks', {
          headers: {
            'Accept': 'application/json',
          },
        });
        const data = await response.json();
        tasks.value = data;
      } catch (error) {
        console.error('Error fetching tasks:', error);
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
        const newTask = await response.json();
        tasks.value.unshift(newTask);
      } catch (error) {
        console.error('Error creating task:', error);
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
        const updatedTask = await response.json();
        const index = tasks.value.findIndex(t => t.id === taskId);
        if (index !== -1) {
          tasks.value[index] = updatedTask;
        }
      } catch (error) {
        console.error('Error updating task:', error);
      }
    };

    const deleteTask = async (taskId) => {
      try {
        await fetch(`/tasks/${taskId}`, {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
          },
        });
        tasks.value = tasks.value.filter(t => t.id !== taskId);
      } catch (error) {
        console.error('Error deleting task:', error);
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
        const updatedTask = await response.json();
        const index = tasks.value.findIndex(t => t.id === taskId);
        if (index !== -1) {
          tasks.value[index] = updatedTask;
        }
      } catch (error) {
        console.error('Error toggling task:', error);
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
