<template>
  <div class="text-center py-12 px-4">
    <!-- Ilustração SVG animada -->
    <div class="mb-6 flex justify-center">
      <svg
        class="w-48 h-48 text-gray-300 animate-float"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <!-- Clipboard -->
        <g class="animate-pulse-slow">
          <rect x="50" y="30" width="100" height="140" rx="8" fill="currentColor" opacity="0.2"/>
          <rect x="55" y="35" width="90" height="130" rx="6" fill="white" stroke="currentColor" stroke-width="2"/>

          <!-- Clip -->
          <rect x="80" y="25" width="40" height="15" rx="3" fill="currentColor" opacity="0.3"/>
          <rect x="85" y="20" width="30" height="10" rx="2" fill="currentColor" opacity="0.4"/>
        </g>

        <!-- Empty checkboxes -->
        <g opacity="0.5">
          <rect x="70" y="60" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.5" fill="none"/>
          <rect x="70" y="85" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.5" fill="none"/>
          <rect x="70" y="110" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.5" fill="none"/>

          <!-- Lines representing text -->
          <line x1="90" y1="66" x2="130" y2="66" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <line x1="90" y1="91" x2="120" y2="91" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <line x1="90" y1="116" x2="125" y2="116" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </g>

        <!-- Floating plus icon -->
        <g class="animate-bounce-slow">
          <circle cx="150" cy="50" r="15" fill="#3b82f6" opacity="0.9"/>
          <line x1="150" y1="43" x2="150" y2="57" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="143" y1="50" x2="157" y2="50" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
        </g>
      </svg>
    </div>

    <!-- Mensagem principal -->
    <h3 class="text-xl font-semibold text-gray-700 mb-2">
      {{ title }}
    </h3>

    <!-- Descrição -->
    <p class="text-gray-500 mb-6 max-w-sm mx-auto">
      {{ description }}
    </p>

    <!-- Call to action (opcional) -->
    <slot name="action"></slot>
  </div>
</template>

<script>
export default {
  name: 'EmptyState',
  props: {
    title: {
      type: String,
      default: 'Nenhuma tarefa encontrada',
    },
    description: {
      type: String,
      default: 'Comece criando sua primeira tarefa usando o formulário acima.',
    },
  },
};
</script>

<style scoped>
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes pulse-slow {
  0%, 100% {
    opacity: 0.2;
  }
  50% {
    opacity: 0.3;
  }
}

@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-pulse-slow {
  animation: pulse-slow 2s ease-in-out infinite;
}

.animate-bounce-slow {
  animation: bounce-slow 2s ease-in-out infinite;
}
</style>
