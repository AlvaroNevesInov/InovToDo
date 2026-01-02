import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import TaskForm from '@/components/TaskForm.vue';

describe('TaskForm', () => {
  it('deve renderizar o formulário corretamente', () => {
    const wrapper = mount(TaskForm);

    expect(wrapper.find('#title').exists()).toBe(true);
    expect(wrapper.find('#description').exists()).toBe(true);
    expect(wrapper.find('#due_date').exists()).toBe(true);
    expect(wrapper.find('#priority').exists()).toBe(true);
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true);
  });

  it('deve inicializar o formulário com valores padrão', () => {
    const wrapper = mount(TaskForm);

    expect(wrapper.find('#title').element.value).toBe('');
    expect(wrapper.find('#description').element.value).toBe('');
    expect(wrapper.find('#due_date').element.value).toBe('');
    expect(wrapper.find('#priority').element.value).toBe('medium');
  });

  it('deve atualizar os valores do formulário ao digitar', async () => {
    const wrapper = mount(TaskForm);

    await wrapper.find('#title').setValue('Nova Tarefa');
    await wrapper.find('#description').setValue('Descrição da tarefa');
    await wrapper.find('#priority').setValue('high');

    expect(wrapper.find('#title').element.value).toBe('Nova Tarefa');
    expect(wrapper.find('#description').element.value).toBe('Descrição da tarefa');
    expect(wrapper.find('#priority').element.value).toBe('high');
  });

  it('deve emitir evento task-created ao submeter o formulário', async () => {
    const wrapper = mount(TaskForm);

    await wrapper.find('#title').setValue('Teste');
    await wrapper.find('#description').setValue('Descrição');
    await wrapper.find('#priority').setValue('low');
    await wrapper.find('#due_date').setValue('2026-01-15');

    await wrapper.find('form').trigger('submit.prevent');

    expect(wrapper.emitted('task-created')).toBeTruthy();
    expect(wrapper.emitted('task-created')?.[0]).toEqual([
      {
        title: 'Teste',
        description: 'Descrição',
        priority: 'low',
        due_date: '2026-01-15',
      },
    ]);
  });

  it('deve limpar o formulário após submissão', async () => {
    const wrapper = mount(TaskForm);

    await wrapper.find('#title').setValue('Teste');
    await wrapper.find('#description').setValue('Descrição');
    await wrapper.find('#priority').setValue('high');

    await wrapper.find('form').trigger('submit.prevent');

    expect(wrapper.find('#title').element.value).toBe('');
    expect(wrapper.find('#description').element.value).toBe('');
    expect(wrapper.find('#priority').element.value).toBe('medium');
    expect(wrapper.find('#due_date').element.value).toBe('');
  });

  it('deve ter campos obrigatórios com atributo required', () => {
    const wrapper = mount(TaskForm);

    expect(wrapper.find('#title').attributes('required')).toBeDefined();
    expect(wrapper.find('#priority').attributes('required')).toBeDefined();
  });

  it('deve ter campos obrigatórios com aria-required', () => {
    const wrapper = mount(TaskForm);

    expect(wrapper.find('#title').attributes('aria-required')).toBe('true');
    expect(wrapper.find('#priority').attributes('aria-required')).toBe('true');
  });

  it('deve ter as opções corretas de prioridade', () => {
    const wrapper = mount(TaskForm);
    const options = wrapper.find('#priority').findAll('option');

    expect(options).toHaveLength(3);
    expect(options[0].element.value).toBe('low');
    expect(options[1].element.value).toBe('medium');
    expect(options[2].element.value).toBe('high');
  });

  it('deve ter labels corretas para acessibilidade', () => {
    const wrapper = mount(TaskForm);

    const titleLabel = wrapper.find('label[for="title"]');
    const descLabel = wrapper.find('label[for="description"]');
    const dateLabel = wrapper.find('label[for="due_date"]');
    const priorityLabel = wrapper.find('label[for="priority"]');

    expect(titleLabel.exists()).toBe(true);
    expect(descLabel.exists()).toBe(true);
    expect(dateLabel.exists()).toBe(true);
    expect(priorityLabel.exists()).toBe(true);
  });
});
