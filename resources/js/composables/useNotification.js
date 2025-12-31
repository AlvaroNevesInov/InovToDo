/**
 * Composable para sistema de notificações
 */
export function useNotification() {
  const notify = ({ message, description, type = 'info', duration = 5000 }) => {
    window.dispatchEvent(
      new CustomEvent('show-notification', {
        detail: { message, description, type, duration },
      })
    );
  };

  return {
    notify,
    success: (message, description) => notify({ message, description, type: 'success' }),
    error: (message, description) => notify({ message, description, type: 'error' }),
    warning: (message, description) => notify({ message, description, type: 'warning' }),
    info: (message, description) => notify({ message, description, type: 'info' }),
  };
}
