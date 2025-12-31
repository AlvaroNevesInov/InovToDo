<template>
  <div class="mb-6">
    <h2 class="text-xl font-semibold text-gray-700 mb-4">Criar Nova Tarefa</h2>
    <form @submit.prevent="submitTask" class="space-y-4">
      <div>
        <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
          Título *
        </label>
        <input
          id="title"
          v-model="form.title"
          type="text"
          required
          aria-required="true"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Digite o título da tarefa"
        />
      </div>

      <div>
        <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
          Descrição
        </label>
        <textarea
          id="description"
          v-model="form.description"
          rows="3"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Digite uma descrição (opcional)"
        ></textarea>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="due_date" class="block text-sm font-medium text-gray-700 mb-1">
            Data de Vencimento
          </label>
          <input
            id="due_date"
            v-model="form.due_date"
            type="date"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label for="priority" class="block text-sm font-medium text-gray-700 mb-1">
            Prioridade *
          </label>
          <select
            id="priority"
            v-model="form.priority"
            required
            aria-required="true"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="low">Baixa</option>
            <option value="medium">Média</option>
            <option value="high">Alta</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
      >
        Criar Tarefa
      </button>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'TaskForm',
  emits: ['task-created'],
  setup(props, { emit }) {
    const form = ref({
      title: '',
      description: '',
      due_date: '',
      priority: 'medium',
    });

    const submitTask = () => {
      emit('task-created', { ...form.value });

      form.value = {
        title: '',
        description: '',
        due_date: '',
        priority: 'medium',
      };
    };

    return {
      form,
      submitTask,
    };
  },
};
</script>
