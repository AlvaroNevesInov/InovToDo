import './bootstrap';
import { createApp } from 'vue';

// Importar componentes Vue
import TodoApp from './components/TodoApp.vue';

const app = createApp({});

// Registrar componentes
app.component('todo-app', TodoApp);

app.mount('#app');
