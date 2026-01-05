<template>
  <div class="relative bg-gradient-to-br from-blue-50/90 to-indigo-50/90 backdrop-blur-sm rounded-lg shadow-lg p-6 mb-6 overflow-hidden">
    <!-- Decorative background pattern -->
    <div class="absolute inset-0 opacity-5">
      <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="2" fill="currentColor" class="text-blue-600"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)"/>
      </svg>
    </div>

    <!-- Content (with relative positioning for z-index) -->
    <!-- Header -->
    <div class="relative flex items-center justify-between mb-6 z-10">
      <h2 class="text-2xl font-bold text-gray-800">Dashboard</h2>
      <div class="flex items-center space-x-2">
        <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </div>
    </div>

    <!-- Cards de Estatísticas -->
    <div class="relative grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 z-10">
      <!-- Total -->
      <div class="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm hover:shadow-md hover:bg-white/90 transition-all duration-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Total</p>
            <p class="text-3xl font-bold text-gray-800">{{ totalTasks }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Pendentes -->
      <div class="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm hover:shadow-md hover:bg-white/90 transition-all duration-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Pendentes</p>
            <p class="text-3xl font-bold text-orange-600">{{ pendingTasks }}</p>
          </div>
          <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Completas -->
      <div class="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm hover:shadow-md hover:bg-white/90 transition-all duration-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Completas</p>
            <p class="text-3xl font-bold text-green-600">{{ completedTasks }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Barra de Progresso -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-medium text-gray-700">Progresso Geral</span>
        <span class="text-sm font-semibold text-blue-600">{{ progressPercentage }}%</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          class="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
          :style="{ width: progressPercentage + '%' }"
        ></div>
      </div>
    </div>

    <!-- Estatísticas por Prioridade -->
    <div class="grid grid-cols-3 gap-3">
      <!-- Alta -->
      <div class="bg-white/80 backdrop-blur-sm rounded-lg p-3 text-center hover:bg-white/90 transition-all duration-200">
        <div class="inline-flex items-center justify-center w-8 h-8 bg-red-100 rounded-full mb-2">
          <svg class="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
          </svg>
        </div>
        <p class="text-2xl font-bold text-gray-800">{{ highPriorityCount }}</p>
        <p class="text-xs text-gray-600">Alta</p>
      </div>

      <!-- Média -->
      <div class="bg-white/80 backdrop-blur-sm rounded-lg p-3 text-center hover:bg-white/90 transition-all duration-200">
        <div class="inline-flex items-center justify-center w-8 h-8 bg-yellow-100 rounded-full mb-2">
          <svg class="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
          </svg>
        </div>
        <p class="text-2xl font-bold text-gray-800">{{ mediumPriorityCount }}</p>
        <p class="text-xs text-gray-600">Média</p>
      </div>

      <!-- Baixa -->
      <div class="bg-white/80 backdrop-blur-sm rounded-lg p-3 text-center hover:bg-white/90 transition-all duration-200">
        <div class="inline-flex items-center justify-center w-8 h-8 bg-green-100 rounded-full mb-2">
          <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </div>
        <p class="text-2xl font-bold text-gray-800">{{ lowPriorityCount }}</p>
        <p class="text-xs text-gray-600">Baixa</p>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  name: 'TaskStats',
  props: {
    tasks: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  setup(props) {
    const totalTasks = computed(() => props.tasks.length);

    const completedTasks = computed(() =>
      props.tasks.filter(task => task.is_completed).length
    );

    const pendingTasks = computed(() =>
      props.tasks.filter(task => !task.is_completed).length
    );

    const progressPercentage = computed(() => {
      if (totalTasks.value === 0) return 0;
      return Math.round((completedTasks.value / totalTasks.value) * 100);
    });

    const highPriorityCount = computed(() =>
      props.tasks.filter(task => task.priority === 'high').length
    );

    const mediumPriorityCount = computed(() =>
      props.tasks.filter(task => task.priority === 'medium').length
    );

    const lowPriorityCount = computed(() =>
      props.tasks.filter(task => task.priority === 'low').length
    );

    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      progressPercentage,
      highPriorityCount,
      mediumPriorityCount,
      lowPriorityCount,
    };
  },
};
</script>
