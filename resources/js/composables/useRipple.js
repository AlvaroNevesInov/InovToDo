import { onMounted, onUnmounted } from 'vue';

/**
 * Composable para adicionar efeito ripple aos botões
 *
 * Cria uma animação de onda (ripple) quando o usuário clica em um elemento.
 *
 * @param {Ref<HTMLElement>} elementRef - Referência ao elemento que terá o efeito
 *
 * @example
 * const buttonRef = ref(null);
 * useRipple(buttonRef);
 */
export function useRipple(elementRef) {
  const createRipple = (event) => {
    const element = elementRef.value;
    if (!element) return;

    // Remove ripples anteriores
    const existingRipple = element.querySelector('.ripple');
    if (existingRipple) {
      existingRipple.remove();
    }

    // Cria o elemento ripple
    const ripple = document.createElement('span');
    ripple.className = 'ripple';

    // Calcula posição e tamanho
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    element.appendChild(ripple);

    // Remove após a animação
    setTimeout(() => ripple.remove(), 600);
  };

  onMounted(() => {
    if (elementRef.value) {
      // Garante que o elemento tem position relative
      const computedStyle = window.getComputedStyle(elementRef.value);
      if (computedStyle.position === 'static') {
        elementRef.value.style.position = 'relative';
      }
      elementRef.value.style.overflow = 'hidden';
      elementRef.value.addEventListener('click', createRipple);
    }
  });

  onUnmounted(() => {
    if (elementRef.value) {
      elementRef.value.removeEventListener('click', createRipple);
    }
  });
}
