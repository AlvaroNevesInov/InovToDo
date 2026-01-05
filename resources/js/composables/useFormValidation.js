import { ref, reactive, computed } from 'vue';

/**
 * Composable para validação de formulários
 *
 * Fornece um sistema de validação flexível e reativo para formulários Vue.
 * Suporta validação síncrona, mensagens de erro customizadas e validação
 * em tempo real (blur, input).
 *
 * Características:
 * - Validação reativa com feedback instantâneo
 * - Regras de validação customizáveis
 * - Suporte a múltiplas regras por campo
 * - Mensagens de erro descritivas
 * - Estado de validade do formulário completo
 * - Métodos de reset e validação manual
 *
 * @param {Object} initialValues - Valores iniciais do formulário
 * @param {Object} validationRules - Regras de validação por campo
 * @returns {Object} Objeto com valores, erros e métodos de validação
 *
 * @example
 * const { values, errors, validate, isValid, resetValidation } = useFormValidation(
 *   { title: '', email: '' },
 *   {
 *     title: [
 *       { rule: 'required', message: 'Título é obrigatório' },
 *       { rule: 'minLength', value: 3, message: 'Mínimo 3 caracteres' }
 *     ],
 *     email: [
 *       { rule: 'required', message: 'Email é obrigatório' },
 *       { rule: 'email', message: 'Email inválido' }
 *     ]
 *   }
 * );
 */
export function useFormValidation(initialValues = {}, validationRules = {}) {
  // Estado reativo dos valores do formulário
  const values = reactive({ ...initialValues });

  // Estado dos erros de validação
  const errors = reactive(
    Object.keys(initialValues).reduce((acc, key) => {
      acc[key] = '';
      return acc;
    }, {})
  );

  // Rastreia quais campos foram "tocados" (touched)
  const touched = reactive(
    Object.keys(initialValues).reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {})
  );

  /**
   * Verifica se o formulário é válido (sem erros)
   */
  const isValid = computed(() => {
    return Object.values(errors).every((error) => error === '');
  });

  /**
   * Verifica se algum campo tem erro
   */
  const hasErrors = computed(() => {
    return Object.values(errors).some((error) => error !== '');
  });

  /**
   * Valida um valor com base em uma regra
   *
   * @param {*} value - Valor a validar
   * @param {Object} rule - Regra de validação
   * @returns {boolean} true se válido, false se inválido
   */
  const validateRule = (value, rule) => {
    switch (rule.rule) {
      case 'required':
        return value !== null && value !== undefined && value.toString().trim() !== '';

      case 'minLength':
        return value.toString().length >= (rule.value || 0);

      case 'maxLength':
        return value.toString().length <= (rule.value || Infinity);

      case 'min':
        return Number(value) >= (rule.value || -Infinity);

      case 'max':
        return Number(value) <= (rule.value || Infinity);

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value.toString());

      case 'url':
        try {
          new URL(value.toString());
          return true;
        } catch {
          return false;
        }

      case 'pattern':
        return rule.value instanceof RegExp && rule.value.test(value.toString());

      case 'date':
        return !isNaN(Date.parse(value));

      case 'futureDate':
        const date = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date >= today;

      case 'custom':
        return typeof rule.validator === 'function' && rule.validator(value);

      default:
        console.warn(`Regra de validação desconhecida: ${rule.rule}`);
        return true;
    }
  };

  /**
   * Valida um campo específico
   *
   * @param {string} fieldName - Nome do campo a validar
   * @returns {boolean} true se válido, false se inválido
   */
  const validateField = (fieldName) => {
    const fieldRules = validationRules[fieldName];
    if (!fieldRules || !Array.isArray(fieldRules)) {
      errors[fieldName] = '';
      return true;
    }

    const value = values[fieldName];

    // Valida cada regra em ordem
    for (const rule of fieldRules) {
      const isValid = validateRule(value, rule);
      if (!isValid) {
        errors[fieldName] = rule.message || 'Campo inválido';
        return false;
      }
    }

    // Se passou em todas as regras, limpa o erro
    errors[fieldName] = '';
    return true;
  };

  /**
   * Valida todos os campos do formulário
   *
   * @returns {boolean} true se todo o formulário é válido
   */
  const validate = () => {
    let formIsValid = true;

    Object.keys(values).forEach((fieldName) => {
      const fieldIsValid = validateField(fieldName);
      if (!fieldIsValid) {
        formIsValid = false;
      }
    });

    return formIsValid;
  };

  /**
   * Marca um campo como "tocado" e valida
   *
   * @param {string} fieldName - Nome do campo
   */
  const touchField = (fieldName) => {
    touched[fieldName] = true;
    validateField(fieldName);
  };

  /**
   * Reseta a validação (limpa erros e touched)
   */
  const resetValidation = () => {
    Object.keys(errors).forEach((key) => {
      errors[key] = '';
      touched[key] = false;
    });
  };

  /**
   * Reseta o formulário (valores, erros e touched)
   */
  const resetForm = () => {
    Object.keys(values).forEach((key) => {
      values[key] = initialValues[key];
      errors[key] = '';
      touched[key] = false;
    });
  };

  /**
   * Define valores do formulário
   *
   * @param {Object} newValues - Novos valores
   */
  const setValues = (newValues) => {
    Object.keys(newValues).forEach((key) => {
      if (key in values) {
        values[key] = newValues[key];
      }
    });
  };

  /**
   * Obtém se um campo deve mostrar erro
   * (foi tocado E tem erro)
   *
   * @param {string} fieldName - Nome do campo
   * @returns {boolean} true se deve mostrar erro
   */
  const shouldShowError = (fieldName) => {
    return touched[fieldName] && errors[fieldName] !== '';
  };

  return {
    values,
    errors,
    touched,
    isValid,
    hasErrors,
    validate,
    validateField,
    touchField,
    resetValidation,
    resetForm,
    setValues,
    shouldShowError,
  };
}

/**
 * Regras de validação pré-definidas para tarefas
 */
export const taskValidationRules = {
  title: [
    { rule: 'required', message: 'O título é obrigatório' },
    { rule: 'minLength', value: 3, message: 'O título deve ter no mínimo 3 caracteres' },
    { rule: 'maxLength', value: 255, message: 'O título deve ter no máximo 255 caracteres' },
  ],
  description: [
    { rule: 'maxLength', value: 1000, message: 'A descrição deve ter no máximo 1000 caracteres' },
  ],
  due_date: [
    { rule: 'date', message: 'Data inválida' },
    // Removido futureDate para permitir datas passadas se necessário
    // { rule: 'futureDate', message: 'A data não pode ser no passado' },
  ],
  priority: [
    { rule: 'required', message: 'A prioridade é obrigatória' },
  ],
};
