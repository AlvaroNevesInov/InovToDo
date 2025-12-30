<template>
  <div class="mb-6 border-b border-gray-200 pb-4">
    <h2 class="text-xl font-semibold text-gray-700 mb-4">Filtros</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label for="filter-status" class="block text-sm font-medium text-gray-700 mb-1">
          Estado
        </label>
        <select
          id="filter-status"
          v-model="localFilters.status"
          @change="emitFilters"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Todas</option>
          <option value="pending">Pendentes</option>
          <option value="completed">Concluídas</option>
        </select>
      </div>

      <div>
        <label for="filter-priority" class="block text-sm font-medium text-gray-700 mb-1">
          Prioridade
        </label>
        <select
          id="filter-priority"
          v-model="localFilters.priority"
          @change="emitFilters"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Todas</option>
          <option value="high">Alta</option>
          <option value="medium">Média</option>
          <option value="low">Baixa</option>
        </select>
      </div>

      <div>
        <label for="filter-date" class="block text-sm font-medium text-gray-700 mb-1">
          Data de Vencimento
        </label>
        <input
          id="filter-date"
          v-model="localFilters.due_date"
          @change="emitFilters"
          type="date"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>

    <button
      v-if="hasActiveFilters"
      @click="clearFilters"
      class="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium"
    >
      Limpar Filtros
    </button>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';

export default {
  name: 'TaskFilters',
  props: {
    filters: {
      type: Object,
      required: true,
    },
  },
  emits: ['update-filters'],
  setup(props, { emit }) {
    const localFilters = ref({ ...props.filters });

    const hasActiveFilters = computed(() => {
      return (
        localFilters.value.status !== 'all' ||
        localFilters.value.priority !== 'all' ||
        localFilters.value.due_date !== ''
      );
    });

    const emitFilters = () => {
      emit('update-filters', { ...localFilters.value });
    };

    const clearFilters = () => {
      localFilters.value = {
        status: 'all',
        priority: 'all',
        due_date: '',
      };
      emitFilters();
    };

    watch(() => props.filters, (newFilters) => {
      localFilters.value = { ...newFilters };
    }, { deep: true });

    return {
      localFilters,
      hasActiveFilters,
      emitFilters,
      clearFilters,
    };
  },
};
</script>
