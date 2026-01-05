<template>
  <div class="mb-6">
    <h2 class="text-xl font-semibold text-gray-700 mb-4">Criar Nova Tarefa</h2>
    <form @submit.prevent="submitTask" class="space-y-4" novalidate>
      <!-- Campo Título -->
      <div>
        <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
          Título *
        </label>
        <input
          id="title"
          v-model="values.title"
          @blur="touchField('title')"
          type="text"
          aria-required="true"
          :aria-invalid="shouldShowError('title')"
          :aria-describedby="shouldShowError('title') ? 'title-error' : undefined"
          :class="[
            'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition',
            shouldShowError('title') ? 'border-red-500' : 'border-gray-300'
          ]"
          placeholder="Digite o título da tarefa"
        />
        <p
          v-if="shouldShowError('title')"
          id="title-error"
          class="mt-1 text-sm text-red-600"
          role="alert"
        >
          {{ errors.title }}
        </p>
      </div>

      <!-- Campo Descrição -->
      <div>
        <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
          Descrição
        </label>
        <textarea
          id="description"
          v-model="values.description"
          @blur="touchField('description')"
          rows="3"
          :aria-invalid="shouldShowError('description')"
          :aria-describedby="shouldShowError('description') ? 'description-error' : undefined"
          :class="[
            'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition',
            shouldShowError('description') ? 'border-red-500' : 'border-gray-300'
          ]"
          placeholder="Digite uma descrição (opcional)"
        ></textarea>
        <p
          v-if="shouldShowError('description')"
          id="description-error"
          class="mt-1 text-sm text-red-600"
          role="alert"
        >
          {{ errors.description }}
        </p>
      </div>

      <!-- Campos Data e Prioridade -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="due_date" class="block text-sm font-medium text-gray-700 mb-1">
            Data de Vencimento
          </label>
          <input
            id="due_date"
            v-model="values.due_date"
            @blur="touchField('due_date')"
            type="date"
            :aria-invalid="shouldShowError('due_date')"
            :aria-describedby="shouldShowError('due_date') ? 'due_date-error' : undefined"
            :class="[
              'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition',
              shouldShowError('due_date') ? 'border-red-500' : 'border-gray-300'
            ]"
          />
          <p
            v-if="shouldShowError('due_date')"
            id="due_date-error"
            class="mt-1 text-sm text-red-600"
            role="alert"
          >
            {{ errors.due_date }}
          </p>
        </div>

        <div>
          <label for="priority" class="block text-sm font-medium text-gray-700 mb-1">
            Prioridade *
          </label>
          <select
            id="priority"
            v-model="values.priority"
            @blur="touchField('priority')"
            aria-required="true"
            :aria-invalid="shouldShowError('priority')"
            :aria-describedby="shouldShowError('priority') ? 'priority-error' : undefined"
            :class="[
              'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition',
              shouldShowError('priority') ? 'border-red-500' : 'border-gray-300'
            ]"
          >
            <option value="low">Baixa</option>
            <option value="medium">Média</option>
            <option value="high">Alta</option>
          </select>
          <p
            v-if="shouldShowError('priority')"
            id="priority-error"
            class="mt-1 text-sm text-red-600"
            role="alert"
          >
            {{ errors.priority }}
          </p>
        </div>
      </div>

      <!-- Botão de Submit -->
      <button
        ref="submitButton"
        type="submit"
        :disabled="isLoading || !isValid"
        :class="[
          'relative w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center overflow-hidden',
          hasValidationError ? 'animate-shake' : ''
        ]"
      >
        <svg
          v-if="isLoading"
          class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>{{ isLoading ? 'Criando...' : 'Criar Tarefa' }}</span>
      </button>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useFormValidation, taskValidationRules } from '../composables/useFormValidation';
import { useRipple } from '../composables/useRipple';

export default {
  name: 'TaskForm',
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['task-created'],
  setup(props, { emit }) {
    const submitButton = ref(null);
    const hasValidationError = ref(false);

    // Adiciona ripple effect ao botão
    useRipple(submitButton);

    // Usa o composable de validação
    const {
      values,
      errors,
      isValid,
      validate,
      touchField,
      shouldShowError,
      resetForm,
    } = useFormValidation(
      {
        title: '',
        description: '',
        due_date: '',
        priority: 'medium',
      },
      taskValidationRules
    );

    const submitTask = () => {
      if (props.isLoading) return;

      // Valida todo o formulário antes de submeter
      if (!validate()) {
        // Ativa shake animation
        hasValidationError.value = true;
        setTimeout(() => {
          hasValidationError.value = false;
        }, 500);
        return;
      }

      // Emite o evento com os valores validados
      emit('task-created', { ...values });

      // Reseta o formulário após sucesso
      resetForm();
    };

    return {
      submitButton,
      hasValidationError,
      values,
      errors,
      isValid,
      touchField,
      shouldShowError,
      submitTask,
    };
  },
};
</script>
