<template>
  <div class="mb-6 pb-6 border-b border-gray-200">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-semibold text-gray-700 flex items-center gap-2">
        <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filtros
      </h2>
      <button
        v-if="hasActiveFilters"
        @click="clearFilters"
        class="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
        Limpar
      </button>
    </div>

    <!-- Estado Filter -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">Estado</label>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="status in statusOptions"
          :key="status.value"
          @click="selectStatus(status.value)"
          :class="[
            'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
            localFilters.status === status.value
              ? 'bg-blue-600 text-white shadow-md scale-105'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
          ]"
        >
          <span class="flex items-center gap-2">
            <component :is="status.icon" class="w-4 h-4" />
            {{ status.label }}
            <span
              v-if="status.count !== undefined"
              :class="[
                'ml-1 px-2 py-0.5 rounded-full text-xs font-semibold',
                localFilters.status === status.value
                  ? 'bg-blue-700'
                  : 'bg-gray-200 text-gray-700'
              ]"
            >
              {{ status.count }}
            </span>
          </span>
        </button>
      </div>
    </div>

    <!-- Prioridade Filter -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">Prioridade</label>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="priority in priorityOptions"
          :key="priority.value"
          @click="selectPriority(priority.value)"
          :class="[
            'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2',
            localFilters.priority === priority.value
              ? priority.activeClass
              : priority.inactiveClass
          ]"
        >
          <component :is="priority.icon" class="w-4 h-4" />
          {{ priority.label }}
          <span
            v-if="priority.count !== undefined"
            :class="[
              'ml-1 px-2 py-0.5 rounded-full text-xs font-semibold',
              localFilters.priority === priority.value
                ? 'bg-opacity-30 bg-white'
                : 'bg-gray-200 text-gray-700'
            ]"
          >
            {{ priority.count }}
          </span>
        </button>
      </div>
    </div>

    <!-- Data Filter -->
    <div>
      <label for="filter-date" class="block text-sm font-medium text-gray-700 mb-2">
        Data de Vencimento
      </label>
      <div class="relative">
        <input
          id="filter-date"
          v-model="localFilters.due_date"
          @change="emitFilters"
          type="date"
          class="w-full sm:w-auto px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow hover:shadow-md"
        />
        <svg
          class="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, h } from 'vue';

export default {
  name: 'TaskFilters',
  props: {
    filters: {
      type: Object,
      required: true,
    },
    tasks: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['update-filters'],
  setup(props, { emit }) {
    const localFilters = ref({ ...props.filters });

    // Ícones como componentes inline
    const AllIcon = () => h('svg', {
      class: 'w-4 h-4',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24',
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
      })
    ]);

    const PendingIcon = () => h('svg', {
      class: 'w-4 h-4',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24',
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
      })
    ]);

    const CompletedIcon = () => h('svg', {
      class: 'w-4 h-4',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24',
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
      })
    ]);

    // Contadores
    const totalTasks = computed(() => props.tasks.length);
    const pendingCount = computed(() => props.tasks.filter(t => !t.is_completed).length);
    const completedCount = computed(() => props.tasks.filter(t => t.is_completed).length);
    const highCount = computed(() => props.tasks.filter(t => t.priority === 'high').length);
    const mediumCount = computed(() => props.tasks.filter(t => t.priority === 'medium').length);
    const lowCount = computed(() => props.tasks.filter(t => t.priority === 'low').length);

    const statusOptions = computed(() => [
      { value: 'all', label: 'Todas', icon: AllIcon, count: totalTasks.value },
      { value: 'pending', label: 'Pendentes', icon: PendingIcon, count: pendingCount.value },
      { value: 'completed', label: 'Concluídas', icon: CompletedIcon, count: completedCount.value },
    ]);

    const priorityOptions = computed(() => [
      {
        value: 'all',
        label: 'Todas',
        icon: AllIcon,
        count: totalTasks.value,
        activeClass: 'bg-gray-600 text-white shadow-md scale-105',
        inactiveClass: 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105',
      },
      {
        value: 'high',
        label: 'Alta',
        icon: () => h('svg', {
          class: 'w-4 h-4',
          fill: 'currentColor',
          viewBox: '0 0 20 20',
        }, [
          h('path', {
            'fill-rule': 'evenodd',
            d: 'M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z',
            'clip-rule': 'evenodd'
          })
        ]),
        count: highCount.value,
        activeClass: 'bg-red-600 text-white shadow-md scale-105',
        inactiveClass: 'bg-red-50 text-red-700 hover:bg-red-100 hover:scale-105',
      },
      {
        value: 'medium',
        label: 'Média',
        icon: () => h('svg', {
          class: 'w-4 h-4',
          fill: 'currentColor',
          viewBox: '0 0 20 20',
        }, [
          h('path', {
            'fill-rule': 'evenodd',
            d: 'M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z',
            'clip-rule': 'evenodd'
          })
        ]),
        count: mediumCount.value,
        activeClass: 'bg-yellow-600 text-white shadow-md scale-105',
        inactiveClass: 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100 hover:scale-105',
      },
      {
        value: 'low',
        label: 'Baixa',
        icon: () => h('svg', {
          class: 'w-4 h-4',
          fill: 'currentColor',
          viewBox: '0 0 20 20',
        }, [
          h('path', {
            'fill-rule': 'evenodd',
            d: 'M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z',
            'clip-rule': 'evenodd'
          })
        ]),
        count: lowCount.value,
        activeClass: 'bg-green-600 text-white shadow-md scale-105',
        inactiveClass: 'bg-green-50 text-green-700 hover:bg-green-100 hover:scale-105',
      },
    ]);

    const hasActiveFilters = computed(() => {
      return (
        localFilters.value.status !== 'all' ||
        localFilters.value.priority !== 'all' ||
        localFilters.value.due_date !== ''
      );
    });

    const selectStatus = (status) => {
      localFilters.value.status = status;
      emitFilters();
    };

    const selectPriority = (priority) => {
      localFilters.value.priority = priority;
      emitFilters();
    };

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
      statusOptions,
      priorityOptions,
      hasActiveFilters,
      selectStatus,
      selectPriority,
      emitFilters,
      clearFilters,
    };
  },
};
</script>
