<template>
  <div
    class="relative overflow-hidden rounded-lg p-4 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1"
    :class="[
      task.is_completed ? 'bg-gray-50' : priorityBackgroundClass,
      priorityBorderClass,
      'border-l-4'
    ]"
  >
    <div v-if="!isEditing" class="flex items-start space-x-4">
      <button
        @click="toggleComplete"
        class="flex-shrink-0 mt-1"
        :aria-label="task.is_completed ? 'Marcar tarefa como não concluída' : 'Marcar tarefa como concluída'"
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
            aria-hidden="true"
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
            :class="task.is_completed ? 'line-through text-gray-600' : 'text-gray-800'"
          >
            {{ task.title }}
          </h3>

          <button
            v-if="task.description"
            @click="showDetails = !showDetails"
            class="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 flex-shrink-0"
            :aria-expanded="showDetails"
            aria-label="Alternar detalhes da tarefa"
          >
            <span class="hidden sm:inline">{{ showDetails ? 'Ocultar detalhes' : 'Ver detalhes' }}</span>
            <svg
              class="w-4 h-4 transition-transform duration-200"
              :class="{ 'rotate-180': showDetails }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
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
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
          aria-label="Editar tarefa"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
          aria-label="Excluir tarefa"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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

    <form v-else @submit.prevent="saveEdit" class="space-y-4" novalidate>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Título *</label>
        <input
          v-model="editValues.title"
          @blur="touchEditField('title')"
          type="text"
          aria-required="true"
          :aria-invalid="shouldShowEditError('title')"
          :aria-describedby="shouldShowEditError('title') ? 'edit-title-error' : undefined"
          :class="[
            'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition',
            shouldShowEditError('title') ? 'border-red-500' : 'border-gray-300'
          ]"
        />
        <p
          v-if="shouldShowEditError('title')"
          id="edit-title-error"
          class="mt-1 text-sm text-red-600"
          role="alert"
        >
          {{ editErrors.title }}
        </p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
        <textarea
          v-model="editValues.description"
          @blur="touchEditField('description')"
          rows="2"
          :aria-invalid="shouldShowEditError('description')"
          :aria-describedby="shouldShowEditError('description') ? 'edit-description-error' : undefined"
          :class="[
            'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition',
            shouldShowEditError('description') ? 'border-red-500' : 'border-gray-300'
          ]"
        ></textarea>
        <p
          v-if="shouldShowEditError('description')"
          id="edit-description-error"
          class="mt-1 text-sm text-red-600"
          role="alert"
        >
          {{ editErrors.description }}
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Data de Vencimento</label>
          <input
            v-model="editValues.due_date"
            @blur="touchEditField('due_date')"
            type="date"
            :aria-invalid="shouldShowEditError('due_date')"
            :aria-describedby="shouldShowEditError('due_date') ? 'edit-due_date-error' : undefined"
            :class="[
              'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition',
              shouldShowEditError('due_date') ? 'border-red-500' : 'border-gray-300'
            ]"
          />
          <p
            v-if="shouldShowEditError('due_date')"
            id="edit-due_date-error"
            class="mt-1 text-sm text-red-600"
            role="alert"
          >
            {{ editErrors.due_date }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Prioridade *</label>
          <select
            v-model="editValues.priority"
            @blur="touchEditField('priority')"
            aria-required="true"
            :aria-invalid="shouldShowEditError('priority')"
            :aria-describedby="shouldShowEditError('priority') ? 'edit-priority-error' : undefined"
            :class="[
              'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition',
              shouldShowEditError('priority') ? 'border-red-500' : 'border-gray-300'
            ]"
          >
            <option value="low">Baixa</option>
            <option value="medium">Média</option>
            <option value="high">Alta</option>
          </select>
          <p
            v-if="shouldShowEditError('priority')"
            id="edit-priority-error"
            class="mt-1 text-sm text-red-600"
            role="alert"
          >
            {{ editErrors.priority }}
          </p>
        </div>
      </div>

      <div class="flex space-x-2">
        <button
          type="submit"
          :disabled="!isEditValid"
          class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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

    <!-- Success Animation -->
    <SuccessAnimation v-model="showSuccessAnimation" />

    <!-- Confirmation Modal -->
    <ConfirmationModal
      v-model="showDeleteModal"
      title="Excluir Tarefa"
      message="Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita."
      confirm-text="Excluir"
      cancel-text="Cancelar"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import ConfirmationModal from './ConfirmationModal.vue';
import SuccessAnimation from './SuccessAnimation.vue';
import { useFormValidation, taskValidationRules } from '../composables/useFormValidation';

export default {
  name: 'TaskItem',
  components: {
    ConfirmationModal,
    SuccessAnimation,
  },
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
    const showSuccessAnimation = ref(false);

    // Watch para mostrar animação quando tarefa é completada
    watch(() => props.task.is_completed, (newVal, oldVal) => {
      // Só mostra animação se mudou de não completa para completa
      if (newVal === true && oldVal === false) {
        showSuccessAnimation.value = true;
      }
    });

    // Validação para o formulário de edição
    const {
      values: editValues,
      errors: editErrors,
      isValid: isEditValid,
      validate: validateEdit,
      touchField: touchEditField,
      shouldShowError: shouldShowEditError,
      setValues: setEditValues,
      resetValidation: resetEditValidation,
    } = useFormValidation(
      {
        title: '',
        description: '',
        due_date: '',
        priority: 'medium',
      },
      taskValidationRules
    );

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

    const priorityBorderClass = computed(() => {
      const borders = {
        high: 'border-red-500',
        medium: 'border-yellow-500',
        low: 'border-green-500',
      };
      return borders[props.task.priority] || borders.medium;
    });

    const priorityBackgroundClass = computed(() => {
      const backgrounds = {
        high: 'bg-gradient-to-r from-red-50 via-white to-white',
        medium: 'bg-gradient-to-r from-yellow-50 via-white to-white',
        low: 'bg-gradient-to-r from-green-50 via-white to-white',
      };
      return backgrounds[props.task.priority] || backgrounds.medium;
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
      // Define os valores do formulário de edição com os valores da tarefa
      setEditValues({
        title: props.task.title,
        description: props.task.description || '',
        due_date: props.task.due_date || '',
        priority: props.task.priority,
      });
      resetEditValidation();
      isEditing.value = true;
    };

    const cancelEditing = () => {
      isEditing.value = false;
      resetEditValidation();
    };

    const saveEdit = () => {
      // Valida antes de salvar
      if (!validateEdit()) {
        return;
      }

      emit('task-updated', props.task.id, { ...editValues });
      isEditing.value = false;
    };

    const showDeleteModal = ref(false);

    const deleteTask = () => {
      showDeleteModal.value = true;
    };

    const confirmDelete = () => {
      emit('task-deleted', props.task.id);
      showDeleteModal.value = false;
    };

    const cancelDelete = () => {
      showDeleteModal.value = false;
    };

    return {
      isEditing,
      showDetails,
      showSuccessAnimation,
      editValues,
      editErrors,
      isEditValid,
      touchEditField,
      shouldShowEditError,
      priorityClasses,
      priorityText,
      priorityBorderClass,
      priorityBackgroundClass,
      isOverdue,
      formatDate,
      toggleComplete,
      startEditing,
      cancelEditing,
      saveEdit,
      deleteTask,
      showDeleteModal,
      confirmDelete,
      cancelDelete,
    };
  },
};
</script>
