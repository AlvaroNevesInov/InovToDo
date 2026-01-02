/**
 * Composable para sistema de notificações toast
 *
 * Fornece métodos para exibir notificações visuais do tipo toast na aplicação.
 * As notificações são exibidas no canto superior direito da tela e desaparecem
 * automaticamente após um período configurável.
 *
 * @returns {Object} Objeto com métodos de notificação
 * @returns {Function} notify - Método genérico para disparar notificações
 * @returns {Function} success - Atalho para notificações de sucesso (verde)
 * @returns {Function} error - Atalho para notificações de erro (vermelho)
 * @returns {Function} warning - Atalho para notificações de aviso (amarelo)
 * @returns {Function} info - Atalho para notificações informativas (azul)
 *
 * @example
 * // Uso básico
 * const { success, error, warning, info } = useNotification();
 *
 * // Notificação de sucesso
 * success('Tarefa criada!', 'A tarefa foi adicionada com sucesso');
 *
 * // Notificação de erro
 * error('Erro ao salvar', 'Verifique os dados e tente novamente');
 *
 * // Notificação customizada
 * const { notify } = useNotification();
 * notify({
 *   message: 'Processando...',
 *   type: 'info',
 *   duration: 3000
 * });
 */
export function useNotification() {
  /**
   * Dispara uma notificação customizada
   *
   * Emite um evento customizado 'show-notification' que é capturado
   * pelo componente NotificationToast para exibir a notificação.
   *
   * @param {Object} options - Opções da notificação
   * @param {string} options.message - Mensagem principal (obrigatório)
   * @param {string} [options.description] - Descrição adicional/detalhe
   * @param {'success'|'error'|'warning'|'info'} [options.type='info'] - Tipo da notificação
   * @param {number} [options.duration=5000] - Duração em milissegundos antes de desaparecer
   *
   * @example
   * notify({
   *   message: 'Operação concluída',
   *   description: 'Todos os itens foram processados',
   *   type: 'success',
   *   duration: 3000
   * });
   */
  const notify = ({ message, description, type = 'info', duration = 5000 }) => {
    window.dispatchEvent(
      new CustomEvent('show-notification', {
        detail: { message, description, type, duration },
      })
    );
  };

  return {
    notify,

    /**
     * Exibe notificação de sucesso (verde)
     * @param {string} message - Mensagem principal
     * @param {string} [description] - Descrição adicional
     */
    success: (message, description) => notify({ message, description, type: 'success' }),

    /**
     * Exibe notificação de erro (vermelho)
     * @param {string} message - Mensagem principal
     * @param {string} [description] - Descrição adicional
     */
    error: (message, description) => notify({ message, description, type: 'error' }),

    /**
     * Exibe notificação de aviso (amarelo)
     * @param {string} message - Mensagem principal
     * @param {string} [description] - Descrição adicional
     */
    warning: (message, description) => notify({ message, description, type: 'warning' }),

    /**
     * Exibe notificação informativa (azul)
     * @param {string} message - Mensagem principal
     * @param {string} [description] - Descrição adicional
     */
    info: (message, description) => notify({ message, description, type: 'info' }),
  };
}
