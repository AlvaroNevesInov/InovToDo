<template>
  <ErrorBoundary>
    <TodoApp />
  </ErrorBoundary>
</template>

<script>
import ErrorBoundary from './ErrorBoundary.vue';
import TodoApp from './TodoApp.vue';

export default {
  name: 'App',
  components: {
    ErrorBoundary,
    TodoApp,
  },
};
</script>
