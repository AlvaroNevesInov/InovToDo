import { onMounted, onUnmounted } from 'vue';

/**
 * Composable para gerenciamento de atalhos de teclado
 *
 * Permite registrar atalhos de teclado globais com suporte a modificadores
 * (Ctrl, Alt, Shift). Os atalhos não são ativados quando o foco está em
 * campos de input, textarea ou elementos editáveis.
 *
 * Características:
 * - Suporte a Ctrl/Cmd (Mac)
 * - Suporte a Alt e Shift
 * - Prevenção de conflitos com campos de input
 * - Cleanup automático ao desmontar componente
 * - Função helper para exibir atalhos
 *
 * @param {Array<Object>} shortcuts - Array de objetos de configuração de atalhos
 * @param {string} shortcuts[].key - Tecla do atalho (ex: 'r', 'f', 'Escape')
 * @param {boolean} [shortcuts[].ctrl=false] - Requer Ctrl/Cmd pressionado
 * @param {boolean} [shortcuts[].alt=false] - Requer Alt pressionado
 * @param {boolean} [shortcuts[].shift=false] - Requer Shift pressionado
 * @param {Function} shortcuts[].handler - Função a executar quando atalho ativado
 *
 * @returns {Object} Objeto com funções helper
 * @returns {Function} getShortcutDisplay - Formata atalho para exibição
 *
 * @example
 * // Uso básico
 * useKeyboardShortcuts([
 *   {
 *     key: 'r',
 *     ctrl: true,
 *     handler: () => {
 *       console.log('Ctrl+R pressionado!');
 *       reloadData();
 *     }
 *   },
 *   {
 *     key: 'f',
 *     ctrl: true,
 *     handler: () => {
 *       document.querySelector('#search').focus();
 *     }
 *   }
 * ]);
 *
 * @example
 * // Com Shift e Alt
 * useKeyboardShortcuts([
 *   {
 *     key: 'n',
 *     ctrl: true,
 *     shift: true,
 *     handler: () => createNewItem()
 *   }
 * ]);
 *
 * @example
 * // Exibir atalho formatado
 * const { getShortcutDisplay } = useKeyboardShortcuts(shortcuts);
 * const display = getShortcutDisplay({ key: 'r', ctrl: true }); // "Ctrl+R"
 */
export function useKeyboardShortcuts(shortcuts) {
  /**
   * Handler de eventos de teclado
   *
   * Captura eventos keydown e verifica se correspondem a algum
   * atalho registrado. Ignora eventos quando o foco está em campos
   * de entrada de texto.
   *
   * @param {KeyboardEvent} event - Evento de teclado
   * @private
   */
  const handleKeyDown = (event) => {
    const key = event.key.toLowerCase();
    const ctrl = event.ctrlKey || event.metaKey; // Suporta Cmd no Mac
    const alt = event.altKey;
    const shift = event.shiftKey;

    // Não ativar atalhos se estiver em input/textarea
    // Isso previne conflitos com digitação normal do usuário
    const activeElement = document.activeElement;
    if (
      activeElement.tagName === 'INPUT' ||
      activeElement.tagName === 'TEXTAREA' ||
      activeElement.isContentEditable
    ) {
      return;
    }

    // Verifica cada atalho registrado
    shortcuts.forEach(shortcut => {
      const matchesKey = shortcut.key.toLowerCase() === key;
      const matchesCtrl = shortcut.ctrl === ctrl;
      const matchesAlt = (shortcut.alt || false) === alt;
      const matchesShift = (shortcut.shift || false) === shift;

      // Se todos os modificadores correspondem, executa o handler
      if (matchesKey && matchesCtrl && matchesAlt && matchesShift) {
        event.preventDefault(); // Previne ação padrão do navegador
        shortcut.handler();
      }
    });
  };

  // Registra o listener quando componente é montado
  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown);
  });

  // Remove o listener quando componente é desmontado
  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown);
  });

  return {
    /**
     * Formata um atalho para exibição amigável
     *
     * Converte um objeto de atalho em string formatada para exibir
     * ao usuário (ex: "Ctrl+Shift+R").
     *
     * @param {Object} shortcut - Objeto de configuração do atalho
     * @param {string} shortcut.key - Tecla
     * @param {boolean} [shortcut.ctrl] - Usa Ctrl
     * @param {boolean} [shortcut.alt] - Usa Alt
     * @param {boolean} [shortcut.shift] - Usa Shift
     * @returns {string} Atalho formatado (ex: "Ctrl+R", "Ctrl+Shift+F")
     *
     * @example
     * getShortcutDisplay({ key: 'r', ctrl: true }); // "Ctrl+R"
     * getShortcutDisplay({ key: 'f', ctrl: true, shift: true }); // "Ctrl+Shift+F"
     */
    getShortcutDisplay: (shortcut) => {
      const parts = [];
      if (shortcut.ctrl) parts.push('Ctrl');
      if (shortcut.alt) parts.push('Alt');
      if (shortcut.shift) parts.push('Shift');
      parts.push(shortcut.key.toUpperCase());
      return parts.join('+');
    },
  };
}
