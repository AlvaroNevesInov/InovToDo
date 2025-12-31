<template>
  <transition
    enter-active-class="transition-opacity duration-200 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-150 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 overflow-y-auto"
      @click.self="handleCancel"
    >
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

      <!-- Modal Container -->
      <div class="flex min-h-full items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
          @click.stop
        >
          <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left flex-1">
                <h3 id="modal-title" class="text-lg font-semibold leading-6 text-gray-900">
                  {{ title }}
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    {{ message }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-2">
            <button
              ref="confirmButton"
              type="button"
              @click="handleConfirm"
              class="inline-flex w-full justify-center rounded-lg bg-red-600 px-4 py-2 text-base font-semibold text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200 sm:w-auto"
            >
              {{ confirmText }}
            </button>
            <button
              type="button"
              @click="handleCancel"
              class="mt-3 inline-flex w-full justify-center rounded-lg bg-white px-4 py-2 text-base font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 sm:mt-0 sm:w-auto"
            >
              {{ cancelText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { ref, watch, nextTick } from 'vue';

export default {
  name: 'ConfirmationModal',
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: 'Confirmar ação',
    },
    message: {
      type: String,
      default: 'Tem certeza que deseja realizar esta ação?',
    },
    confirmText: {
      type: String,
      default: 'Confirmar',
    },
    cancelText: {
      type: String,
      default: 'Cancelar',
    },
  },
  emits: ['update:modelValue', 'confirm', 'cancel'],
  setup(props, { emit }) {
    const isOpen = ref(props.modelValue);
    const confirmButton = ref(null);

    watch(() => props.modelValue, (newValue) => {
      isOpen.value = newValue;
      if (newValue) {
        // Focus no botão de confirmar quando o modal abre
        nextTick(() => {
          confirmButton.value?.focus();
        });
        // Prevenir scroll do body
        document.body.style.overflow = 'hidden';
      } else {
        // Restaurar scroll do body
        document.body.style.overflow = '';
      }
    });

    const handleConfirm = () => {
      emit('confirm');
      emit('update:modelValue', false);
    };

    const handleCancel = () => {
      emit('cancel');
      emit('update:modelValue', false);
    };

    // Keyboard navigation
    const handleKeydown = (event) => {
      if (event.key === 'Escape' && isOpen.value) {
        handleCancel();
      }
    };

    // Add event listener on mount
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeydown);
    }

    return {
      isOpen,
      confirmButton,
      handleConfirm,
      handleCancel,
    };
  },
};
</script>
