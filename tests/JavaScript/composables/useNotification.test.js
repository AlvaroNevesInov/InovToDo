import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useNotification } from '@/composables/useNotification';

describe('useNotification', () => {
  let eventListener;

  beforeEach(() => {
    // Mock window.dispatchEvent
    vi.spyOn(window, 'dispatchEvent');
    eventListener = null;
  });

  it('deve exportar as funções corretas', () => {
    const { notify, success, error, warning, info } = useNotification();

    expect(notify).toBeTypeOf('function');
    expect(success).toBeTypeOf('function');
    expect(error).toBeTypeOf('function');
    expect(warning).toBeTypeOf('function');
    expect(info).toBeTypeOf('function');
  });

  it('deve disparar evento customizado ao chamar notify', () => {
    const { notify } = useNotification();
    const message = 'Test notification';
    const description = 'Test description';

    notify({ message, description, type: 'info' });

    expect(window.dispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'show-notification',
        detail: expect.objectContaining({
          message,
          description,
          type: 'info',
        }),
      })
    );
  });

  it('deve usar tipo padrão "info" quando não especificado', () => {
    const { notify } = useNotification();
    const message = 'Default type test';

    notify({ message });

    expect(window.dispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: expect.objectContaining({
          type: 'info',
        }),
      })
    );
  });

  it('deve usar duração padrão de 5000ms quando não especificado', () => {
    const { notify } = useNotification();
    const message = 'Default duration test';

    notify({ message });

    expect(window.dispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: expect.objectContaining({
          duration: 5000,
        }),
      })
    );
  });

  it('deve chamar notify com tipo "success"', () => {
    const { success } = useNotification();
    const message = 'Success message';
    const description = 'Success description';

    success(message, description);

    expect(window.dispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: expect.objectContaining({
          message,
          description,
          type: 'success',
        }),
      })
    );
  });

  it('deve chamar notify com tipo "error"', () => {
    const { error } = useNotification();
    const message = 'Error message';
    const description = 'Error description';

    error(message, description);

    expect(window.dispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: expect.objectContaining({
          message,
          description,
          type: 'error',
        }),
      })
    );
  });

  it('deve chamar notify com tipo "warning"', () => {
    const { warning } = useNotification();
    const message = 'Warning message';

    warning(message);

    expect(window.dispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: expect.objectContaining({
          message,
          type: 'warning',
        }),
      })
    );
  });

  it('deve chamar notify com tipo "info"', () => {
    const { info } = useNotification();
    const message = 'Info message';

    info(message);

    expect(window.dispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: expect.objectContaining({
          message,
          type: 'info',
        }),
      })
    );
  });
});
