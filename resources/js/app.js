import { createApp } from 'vue';

import TodoApp from './components/TodoApp.vue';

import './bootstrap'; // Movido para depois do Vue

createApp(TodoApp).mount('#app');
