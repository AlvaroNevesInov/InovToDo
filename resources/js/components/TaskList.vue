<template>
  <div>
    <h2 class="text-xl font-semibold text-gray-700 mb-4">
      Tarefas ({{ tasks.length }})
    </h2>

    <div v-if="tasks.length === 0" class="text-center py-12">
      <p class="text-gray-500 text-lg">Nenhuma tarefa encontrada</p>
    </div>

    <div v-else class="space-y-4">
      <TaskItem
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        @task-updated="handleTaskUpdated"
        @task-deleted="handleTaskDeleted"
        @task-toggled="handleTaskToggled"
      />
    </div>
  </div>
</template>

<script>
import TaskItem from './TaskItem.vue';

export default {
  name: 'TaskList',
  components: {
    TaskItem,
  },
  props: {
    tasks: {
      type: Array,
      required: true,
    },
  },
  emits: ['task-updated', 'task-deleted', 'task-toggled'],
  setup(props, { emit }) {
    const handleTaskUpdated = (taskId, taskData) => {
      emit('task-updated', taskId, taskData);
    };

    const handleTaskDeleted = (taskId) => {
      emit('task-deleted', taskId);
    };

    const handleTaskToggled = (taskId) => {
      emit('task-toggled', taskId);
    };

    return {
      handleTaskUpdated,
      handleTaskDeleted,
      handleTaskToggled,
    };
  },
};
</script>
