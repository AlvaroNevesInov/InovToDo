import { onMounted, onUnmounted } from 'vue';

/**
 * Composable para atalhos de teclado
 */
export function useKeyboardShortcuts(shortcuts) {
  const handleKeyDown = (event) => {
    const key = event.key.toLowerCase();
    const ctrl = event.ctrlKey || event.metaKey; // Suporta Cmd no Mac
    const alt = event.altKey;
    const shift = event.shiftKey;

    // Não ativar atalhos se estiver em input/textarea
    const activeElement = document.activeElement;
    if (
      activeElement.tagName === 'INPUT' ||
      activeElement.tagName === 'TEXTAREA' ||
      activeElement.isContentEditable
    ) {
      return;
    }

    shortcuts.forEach(shortcut => {
      const matchesKey = shortcut.key.toLowerCase() === key;
      const matchesCtrl = shortcut.ctrl === ctrl;
      const matchesAlt = (shortcut.alt || false) === alt;
      const matchesShift = (shortcut.shift || false) === shift;

      if (matchesKey && matchesCtrl && matchesAlt && matchesShift) {
        event.preventDefault();
        shortcut.handler();
      }
    });
  };

  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown);
  });

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown);
  });

  return {
    // Função helper para mostrar atalhos
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
