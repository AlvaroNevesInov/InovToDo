<template>
  <div
    class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
    :class="{ 'bg-gray-50': task.is_completed }"
  >
    <div v-if="!isEditing" class="flex items-start space-x-4">
      <button
        @click="toggleComplete"
        class="flex-shrink-0 mt-1"
      >
        <div
          class="w-6 h-6 rounded-full border-2 flex items-center justify-center"
          :class="task.is_completed ? 'bg-green-500 border-green-500' : 'border-gray-300'"
        >
          <svg
            v-if="task.is_completed"
            class="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </button>

      <div class="flex-grow">
        <div class="flex items-center justify-between">
          <h3
            class="text-lg font-semibold"
            :class="task.is_completed ? 'line-through text-gray-500' : 'text-gray-800'"
          >
            {{ task.title }}
          </h3>

          <button
            v-if="task.description"
            @click="showDetails = !showDetails"
            class="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 flex-shrink-0"
          >
            <span class="hidden sm:inline">{{ showDetails ? 'Ocultar detalhes' : 'Ver detalhes' }}</span>
            <svg
              class="w-4 h-4 transition-transform duration-200"
              :class="{ 'rotate-180': showDetails }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>

        <transition
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="opacity-0 max-h-0"
          enter-to-class="opacity-100 max-h-96"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 max-h-96"
          leave-to-class="opacity-0 max-h-0"
        >
          <p
            v-if="task.description && showDetails"
            class="text-gray-600 mt-2 overflow-hidden"
            :class="{ 'line-through': task.is_completed }"
          >
            {{ task.description }}
          </p>
        </transition>

        <div class="flex flex-wrap items-center gap-3 mt-3">
          <span
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            :class="priorityClasses"
          >
            {{ priorityText }}
          </span>

          <span v-if="task.due_date" class="text-sm text-gray-600 flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {{ formatDate(task.due_date) }}
          </span>

          <span v-if="isOverdue" class="text-xs text-red-600 font-medium">
            Atrasada
          </span>
        </div>
      </div>

      <div class="flex-shrink-0 flex space-x-2">
        <button
          @click="startEditing"
          class="text-blue-600 hover:text-blue-800 p-1"
          title="Editar"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </button>

        <button
          @click="deleteTask"
          class="text-red-600 hover:text-red-800 p-1"
          title="Excluir"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>

    <form v-else @submit.prevent="saveEdit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Título</label>
        <input
          v-model="editForm.title"
          type="text"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
        <textarea
          v-model="editForm.description"
          rows="2"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        ></textarea>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Data de Vencimento</label>
          <input
            v-model="editForm.due_date"
            type="date"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
          <select
            v-model="editForm.priority"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="low">Baixa</option>
            <option value="medium">Média</option>
            <option value="high">Alta</option>
          </select>
        </div>
      </div>

      <div class="flex space-x-2">
        <button
          type="submit"
          class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
        >
          Salvar
        </button>
        <button
          type="button"
          @click="cancelEditing"
          class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-lg transition duration-200"
        >
          Cancelar
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  name: 'TaskItem',
  props: {
    task: {
      type: Object,
      required: true,
    },
  },
  emits: ['task-updated', 'task-deleted', 'task-toggled'],
  setup(props, { emit }) {
    const isEditing = ref(false);
    const showDetails = ref(false);
    const editForm = ref({});

    const priorityClasses = computed(() => {
      const classes = {
        high: 'bg-red-100 text-red-800',
        medium: 'bg-yellow-100 text-yellow-800',
        low: 'bg-green-100 text-green-800',
      };
      return classes[props.task.priority] || classes.medium;
    });

    const priorityText = computed(() => {
      const texts = {
        high: 'Alta',
        medium: 'Média',
        low: 'Baixa',
      };
      return texts[props.task.priority] || 'Média';
    });

    const isOverdue = computed(() => {
      if (!props.task.due_date || props.task.is_completed) return false;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dueDate = new Date(props.task.due_date);
      return dueDate < today;
    });

    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-PT', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    };

    const toggleComplete = () => {
      emit('task-toggled', props.task.id);
    };

    const startEditing = () => {
      editForm.value = {
        title: props.task.title,
        description: props.task.description || '',
        due_date: props.task.due_date || '',
        priority: props.task.priority,
      };
      isEditing.value = true;
    };

    const cancelEditing = () => {
      isEditing.value = false;
      editForm.value = {};
    };

    const saveEdit = () => {
      emit('task-updated', props.task.id, editForm.value);
      isEditing.value = false;
    };

    const deleteTask = () => {
      if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
        emit('task-deleted', props.task.id);
      }
    };

    return {
      isEditing,
      showDetails,
      editForm,
      priorityClasses,
      priorityText,
      isOverdue,
      formatDate,
      toggleComplete,
      startEditing,
      cancelEditing,
      saveEdit,
      deleteTask,
    };
  },
};
</script>
