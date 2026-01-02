import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import NotificationToast from '@/components/NotificationToast.vue';

describe('NotificationToast', () => {
  let wrapper;

  beforeEach(() => {
    vi.useFakeTimers();
    wrapper = mount(NotificationToast);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('deve renderizar o componente corretamente', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('deve iniciar sem notificações', () => {
    expect(wrapper.findAll('[role="alert"]')).toHaveLength(0);
  });

  it('deve adicionar notificação quando evento é disparado', async () => {
    const notification = {
      message: 'Teste',
      description: 'Descrição teste',
      type: 'success',
    };

    window.dispatchEvent(
      new CustomEvent('show-notification', { detail: notification })
    );

    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('Teste');
    expect(wrapper.text()).toContain('Descrição teste');
  });

  it('deve mostrar ícone correto para tipo success', async () => {
    window.dispatchEvent(
      new CustomEvent('show-notification', {
        detail: { message: 'Success', type: 'success' },
      })
    );

    await wrapper.vm.$nextTick();

    const successIcon = wrapper.find('.text-green-500');
    expect(successIcon.exists()).toBe(true);
  });

  it('deve mostrar ícone correto para tipo error', async () => {
    window.dispatchEvent(
      new CustomEvent('show-notification', {
        detail: { message: 'Error', type: 'error' },
      })
    );

    await wrapper.vm.$nextTick();

    const errorIcon = wrapper.find('.text-red-500');
    expect(errorIcon.exists()).toBe(true);
  });

  it('deve mostrar ícone correto para tipo warning', async () => {
    window.dispatchEvent(
      new CustomEvent('show-notification', {
        detail: { message: 'Warning', type: 'warning' },
      })
    );

    await wrapper.vm.$nextTick();

    const warningIcon = wrapper.find('.text-yellow-500');
    expect(warningIcon.exists()).toBe(true);
  });

  it('deve mostrar ícone correto para tipo info', async () => {
    window.dispatchEvent(
      new CustomEvent('show-notification', {
        detail: { message: 'Info', type: 'info' },
      })
    );

    await wrapper.vm.$nextTick();

    const infoIcon = wrapper.find('.text-blue-500');
    expect(infoIcon.exists()).toBe(true);
  });

  it('deve aplicar classe de borda correta para tipo success', async () => {
    window.dispatchEvent(
      new CustomEvent('show-notification', {
        detail: { message: 'Success', type: 'success' },
      })
    );

    await wrapper.vm.$nextTick();

    const alert = wrapper.find('[role="alert"]');
    expect(alert.classes()).toContain('border-green-500');
  });

  it('deve aplicar classe de borda correta para tipo error', async () => {
    window.dispatchEvent(
      new CustomEvent('show-notification', {
        detail: { message: 'Error', type: 'error' },
      })
    );

    await wrapper.vm.$nextTick();

    const alert = wrapper.find('[role="alert"]');
    expect(alert.classes()).toContain('border-red-500');
  });

  it('deve remover notificação ao clicar no botão fechar', async () => {
    window.dispatchEvent(
      new CustomEvent('show-notification', {
        detail: { message: 'Test', type: 'info' },
      })
    );

    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('Test');

    const closeButton = wrapper.find('[aria-label="Fechar notificação"]');
    await closeButton.trigger('click');

    expect(wrapper.text()).not.toContain('Test');
  });

  it('deve remover notificação automaticamente após 5 segundos', async () => {
    window.dispatchEvent(
      new CustomEvent('show-notification', {
        detail: { message: 'Auto close', type: 'info' },
      })
    );

    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain('Auto close');

    // Avança o tempo em 5 segundos
    vi.advanceTimersByTime(5000);
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).not.toContain('Auto close');
  });

  it('deve respeitar duração customizada', async () => {
    window.dispatchEvent(
      new CustomEvent('show-notification', {
        detail: { message: 'Custom duration', type: 'info', duration: 3000 },
      })
    );

    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain('Custom duration');

    // Avança o tempo em 3 segundos
    vi.advanceTimersByTime(3000);
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).not.toContain('Custom duration');
  });

  it('deve permitir múltiplas notificações simultâneas', async () => {
    window.dispatchEvent(
      new CustomEvent('show-notification', {
        detail: { message: 'Notificação 1', type: 'info' },
      })
    );

    window.dispatchEvent(
      new CustomEvent('show-notification', {
        detail: { message: 'Notificação 2', type: 'success' },
      })
    );

    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('Notificação 1');
    expect(wrapper.text()).toContain('Notificação 2');
    expect(wrapper.findAll('[role="alert"]')).toHaveLength(2);
  });

  it('deve ter atributos de acessibilidade corretos', async () => {
    window.dispatchEvent(
      new CustomEvent('show-notification', {
        detail: { message: 'Teste', type: 'info' },
      })
    );

    await wrapper.vm.$nextTick();

    const container = wrapper.find('[aria-live]');
    expect(container.attributes('aria-live')).toBe('polite');
    expect(container.attributes('aria-atomic')).toBe('true');

    const alert = wrapper.find('[role="alert"]');
    expect(alert.exists()).toBe(true);
  });
});
