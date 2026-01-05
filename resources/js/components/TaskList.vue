<template>
  <div>
    <h2 class="text-xl font-semibold text-gray-700 mb-4">
      Tarefas ({{ tasks.length }})
    </h2>

    <!-- Estado de Loading -->
    <div v-if="isLoading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="animate-pulse">
        <div class="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
          <div class="flex items-start gap-4">
            <div class="h-5 w-5 bg-gray-300 rounded"></div>
            <div class="flex-1 space-y-3">
              <div class="h-4 bg-gray-300 rounded w-3/4"></div>
              <div class="h-3 bg-gray-200 rounded w-1/2"></div>
              <div class="flex gap-2">
                <div class="h-6 w-16 bg-gray-200 rounded-full"></div>
                <div class="h-6 w-16 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Lista Vazia -->
    <EmptyState
      v-else-if="tasks.length === 0"
      title="Nenhuma tarefa encontrada"
      description="Comece criando sua primeira tarefa usando o formulário acima. Organize suas tarefas por prioridade e data de vencimento!"
    />

    <!-- Lista de Tarefas -->
    <TransitionGroup
      v-else
      name="task-list"
      tag="div"
      class="space-y-4"
    >
      <TaskItem
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        @task-updated="handleTaskUpdated"
        @task-deleted="handleTaskDeleted"
        @task-toggled="handleTaskToggled"
      />
    </TransitionGroup>
  </div>
</template>

<style scoped>
/* Animações de entrada/saída de tarefas */
.task-list-enter-active {
  animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.task-list-leave-active {
  transition: all 0.3s ease;
}

.task-list-leave-to {
  opacity: 0;
  transform: translateX(30px) scale(0.8);
}

.task-list-move {
  transition: transform 0.5s ease;
}

@keyframes bounce-in {
  0% {
    transform: scale(0) translateX(-30px);
    opacity: 0;
  }
  50% {
    transform: scale(1.05) translateX(0);
  }
  70% {
    transform: scale(0.95);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>

<script>
import TaskItem from './TaskItem.vue';
import EmptyState from './EmptyState.vue';

export default {
  name: 'TaskList',
  components: {
    TaskItem,
    EmptyState,
  },
  props: {
    tasks: {
      type: Array,
      required: true,
    },
    isLoading: {
      type: Boolean,
      default: false,
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
