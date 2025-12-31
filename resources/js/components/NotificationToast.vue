<template>
  <div
    aria-live="polite"
    aria-atomic="true"
    class="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none"
  >
    <transition-group
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-x-full"
      enter-to-class="opacity-100 translate-x-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-x-0"
      leave-to-class="opacity-0 translate-x-full"
    >
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="pointer-events-auto max-w-sm w-full bg-white rounded-lg shadow-lg border-l-4 p-4"
        :class="borderColorClass(notification.type)"
        role="alert"
      >
        <div class="flex items-start gap-3">
          <div class="flex-shrink-0">
            <svg
              v-if="notification.type === 'success'"
              class="w-6 h-6 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg
              v-else-if="notification.type === 'error'"
              class="w-6 h-6 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg
              v-else-if="notification.type === 'warning'"
              class="w-6 h-6 text-yellow-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <svg
              v-else
              class="w-6 h-6 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="flex-1">
            <p class="text-sm font-semibold text-gray-900">
              {{ notification.message }}
            </p>
            <p v-if="notification.description" class="text-xs text-gray-600 mt-1">
              {{ notification.description }}
            </p>
          </div>
          <button
            @click="removeNotification(notification.id)"
            class="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Fechar notificação"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';

export default {
  name: 'NotificationToast',
  setup() {
    const notifications = ref([]);

    const borderColorClass = (type) => {
      const classes = {
        success: 'border-green-500',
        error: 'border-red-500',
        warning: 'border-yellow-500',
        info: 'border-blue-500',
      };
      return classes[type] || classes.info;
    };

    const addNotification = (notification) => {
      const id = Date.now() + Math.random();
      notifications.value.push({ id, ...notification });

      // Auto-remove após 5 segundos
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration || 5000);
    };

    const removeNotification = (id) => {
      notifications.value = notifications.value.filter(n => n.id !== id);
    };

    const handleNotification = (event) => {
      addNotification(event.detail);
    };

    onMounted(() => {
      window.addEventListener('show-notification', handleNotification);
    });

    onUnmounted(() => {
      window.removeEventListener('show-notification', handleNotification);
    });

    return {
      notifications,
      borderColorClass,
      removeNotification,
    };
  },
};
</script>
