import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import TaskItem from '@/components/TaskItem.vue';

// Mock ConfirmationModal
vi.mock('@/components/ConfirmationModal.vue', () => ({
  default: {
    name: 'ConfirmationModal',
    template: '<div></div>',
  },
}));

describe('TaskItem', () => {
  const mockTask = {
    id: 1,
    title: 'Tarefa de Teste',
    description: 'Descrição da tarefa',
    priority: 'medium',
    due_date: '2026-01-15',
    is_completed: false,
  };

  it('deve renderizar a tarefa corretamente', () => {
    const wrapper = mount(TaskItem, {
      props: { task: mockTask },
    });

    expect(wrapper.text()).toContain('Tarefa de Teste');
  });

  it('deve mostrar checkbox marcado quando tarefa está completa', () => {
    const completedTask = { ...mockTask, is_completed: true };
    const wrapper = mount(TaskItem, {
      props: { task: completedTask },
    });

    const checkbox = wrapper.find('[aria-label*="Marcar tarefa como não concluída"]');
    expect(checkbox.exists()).toBe(true);
  });

  it('deve aplicar classe de riscado quando tarefa está completa', () => {
    const completedTask = { ...mockTask, is_completed: true };
    const wrapper = mount(TaskItem, {
      props: { task: completedTask },
    });

    const title = wrapper.find('h3');
    expect(title.classes()).toContain('line-through');
  });

  it('deve emitir evento task-toggled ao clicar no checkbox', async () => {
    const wrapper = mount(TaskItem, {
      props: { task: mockTask },
    });

    const toggleButton = wrapper.find('[aria-label*="Marcar tarefa como concluída"]');
    await toggleButton.trigger('click');

    expect(wrapper.emitted('task-toggled')).toBeTruthy();
    expect(wrapper.emitted('task-toggled')?.[0]).toEqual([1]);
  });

  it('deve mostrar classe de prioridade correta', () => {
    const highPriorityTask = { ...mockTask, priority: 'high' };
    const wrapper = mount(TaskItem, {
      props: { task: highPriorityTask },
    });

    const priorityBadge = wrapper.find('.bg-red-100');
    expect(priorityBadge.exists()).toBe(true);
  });

  it('deve formatar data corretamente', () => {
    const wrapper = mount(TaskItem, {
      props: { task: mockTask },
    });

    expect(wrapper.text()).toContain('janeiro');
  });

  it('deve mostrar "Atrasada" para tarefas vencidas', () => {
    const overdueTask = { ...mockTask, due_date: '2020-01-01' };
    const wrapper = mount(TaskItem, {
      props: { task: overdueTask },
    });

    expect(wrapper.text()).toContain('Atrasada');
  });

  it('não deve mostrar "Atrasada" para tarefas completas vencidas', () => {
    const completedOverdueTask = {
      ...mockTask,
      due_date: '2020-01-01',
      is_completed: true,
    };
    const wrapper = mount(TaskItem, {
      props: { task: completedOverdueTask },
    });

    expect(wrapper.text()).not.toContain('Atrasada');
  });

  it('deve alternar exibição de detalhes', async () => {
    const wrapper = mount(TaskItem, {
      props: { task: mockTask },
    });

    expect(wrapper.text()).not.toContain('Descrição da tarefa');

    const detailsButton = wrapper.find('[aria-label="Alternar detalhes da tarefa"]');
    await detailsButton.trigger('click');

    expect(wrapper.text()).toContain('Descrição da tarefa');
  });

  it('deve entrar no modo de edição ao clicar no botão editar', async () => {
    const wrapper = mount(TaskItem, {
      props: { task: mockTask },
    });

    const editButton = wrapper.find('[aria-label="Editar tarefa"]');
    await editButton.trigger('click');

    expect(wrapper.find('form').exists()).toBe(true);
    expect(wrapper.find('input[type="text"]').element.value).toBe('Tarefa de Teste');
  });

  it('deve cancelar edição ao clicar em cancelar', async () => {
    const wrapper = mount(TaskItem, {
      props: { task: mockTask },
    });

    const editButton = wrapper.find('[aria-label="Editar tarefa"]');
    await editButton.trigger('click');

    expect(wrapper.find('form').exists()).toBe(true);

    const cancelButton = wrapper.find('button[type="button"]');
    await cancelButton.trigger('click');

    expect(wrapper.find('form').exists()).toBe(false);
  });

  it('deve emitir task-updated ao salvar edição', async () => {
    const wrapper = mount(TaskItem, {
      props: { task: mockTask },
    });

    const editButton = wrapper.find('[aria-label="Editar tarefa"]');
    await editButton.trigger('click');

    const titleInput = wrapper.find('input[type="text"]');
    await titleInput.setValue('Título Atualizado');

    const form = wrapper.find('form');
    await form.trigger('submit.prevent');

    expect(wrapper.emitted('task-updated')).toBeTruthy();
    expect(wrapper.emitted('task-updated')?.[0][0]).toBe(1);
    expect(wrapper.emitted('task-updated')?.[0][1]).toMatchObject({
      title: 'Título Atualizado',
    });
  });

  it('deve mostrar modal de confirmação ao clicar em deletar', async () => {
    const wrapper = mount(TaskItem, {
      props: { task: mockTask },
    });

    const deleteButton = wrapper.find('[aria-label="Excluir tarefa"]');
    await deleteButton.trigger('click');

    // Verifica que o modal foi aberto (através da prop v-model)
    expect(wrapper.vm.showDeleteModal).toBe(true);
  });

  it('deve ter prioridade "Baixa" quando priority é low', () => {
    const lowPriorityTask = { ...mockTask, priority: 'low' };
    const wrapper = mount(TaskItem, {
      props: { task: lowPriorityTask },
    });

    expect(wrapper.text()).toContain('Baixa');
    expect(wrapper.find('.bg-green-100').exists()).toBe(true);
  });

  it('deve ter prioridade "Alta" quando priority é high', () => {
    const highPriorityTask = { ...mockTask, priority: 'high' };
    const wrapper = mount(TaskItem, {
      props: { task: highPriorityTask },
    });

    expect(wrapper.text()).toContain('Alta');
    expect(wrapper.find('.bg-red-100').exists()).toBe(true);
  });
});
