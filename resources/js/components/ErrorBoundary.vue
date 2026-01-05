<template>
  <div>
    <!-- Mostra conteúdo normal se não houver erro -->
    <slot v-if="!hasError"></slot>

    <!-- Mostra fallback UI quando há erro -->
    <div v-else class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-6 sm:p-8">
        <div class="text-center">
          <!-- Ícone de erro -->
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg
              class="h-6 w-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <!-- Mensagem de erro -->
          <h3 class="text-lg font-medium text-gray-900 mb-2">
            Algo deu errado
          </h3>
          <p class="text-sm text-gray-600 mb-6">
            Ocorreu um erro inesperado na aplicação.
            <span v-if="showDetails && errorInfo" class="block mt-2 text-xs font-mono text-gray-500 break-all">
              {{ errorInfo }}
            </span>
          </p>

          <!-- Ações -->
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              @click="resetError"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Tentar novamente
            </button>
            <button
              @click="reloadPage"
              class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Recarregar página
            </button>
          </div>

          <!-- Toggle para mostrar detalhes do erro -->
          <button
            v-if="errorInfo && !showDetails"
            @click="showDetails = true"
            class="mt-4 text-xs text-gray-500 hover:text-gray-700 underline focus:outline-none"
          >
            Mostrar detalhes técnicos
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onErrorCaptured } from 'vue';
import { useNotification } from '../composables/useNotification';

/**
 * Componente ErrorBoundary para capturar e tratar erros de componentes filhos
 *
 * Este componente envolve outros componentes Vue e captura erros que ocorrem
 * durante o render, lifecycle hooks ou event handlers dos componentes filhos.
 * Quando um erro é capturado, exibe uma interface alternativa amigável ao invés
 * de quebrar toda a aplicação.
 *
 * Características:
 * - Captura erros de componentes filhos com onErrorCaptured
 * - Exibe UI alternativa amigável ao usuário
 * - Opção de mostrar detalhes técnicos do erro
 * - Botão para tentar novamente (reset do erro)
 * - Botão para recarregar a página completamente
 * - Integração com sistema de notificações
 * - Logging de erros no console para debugging
 *
 * @example
 * // Envolver componentes que podem gerar erros
 * <ErrorBoundary>
 *   <TodoApp />
 * </ErrorBoundary>
 *
 * @example
 * // Usar em múltiplos níveis para granularidade
 * <ErrorBoundary>
 *   <Header />
 *   <ErrorBoundary>
 *     <MainContent />
 *   </ErrorBoundary>
 *   <Footer />
 * </ErrorBoundary>
 */
export default {
  name: 'ErrorBoundary',
  props: {
    /**
     * Callback opcional executado quando um erro é capturado
     * @param {Error} error - O erro capturado
     * @param {string} info - Informação adicional sobre onde o erro ocorreu
     */
    onError: {
      type: Function,
      default: null,
    },
  },
  setup(props) {
    const hasError = ref(false);
    const errorInfo = ref('');
    const showDetails = ref(false);
    const { error: notifyError } = useNotification();

    /**
     * Hook do Vue 3 que captura erros de componentes descendentes
     *
     * Este hook é chamado quando um erro é propagado de qualquer componente
     * descendente. Retornar false impede que o erro seja propagado ainda mais.
     */
    onErrorCaptured((err, instance, info) => {
      hasError.value = true;
      errorInfo.value = err.message || 'Erro desconhecido';

      // Log detalhado no console para debugging
      console.error('ErrorBoundary capturou um erro:', {
        error: err,
        component: instance?.$options?.name || 'Componente desconhecido',
        info: info,
        stack: err.stack,
      });

      // Notifica o usuário
      notifyError(
        'Erro na aplicação',
        'Ocorreu um erro inesperado. Tente recarregar a página.'
      );

      // Executa callback customizado se fornecido
      if (props.onError && typeof props.onError === 'function') {
        try {
          props.onError(err, info);
        } catch (callbackError) {
          console.error('Erro ao executar onError callback:', callbackError);
        }
      }

      // Retorna false para impedir propagação do erro
      return false;
    });

    /**
     * Reseta o estado de erro e tenta renderizar novamente
     */
    const resetError = () => {
      hasError.value = false;
      errorInfo.value = '';
      showDetails.value = false;
    };

    /**
     * Recarrega a página completamente
     */
    const reloadPage = () => {
      window.location.reload();
    };

    return {
      hasError,
      errorInfo,
      showDetails,
      resetError,
      reloadPage,
    };
  },
};
</script>
