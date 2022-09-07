import {el, list, setChildren} from 'redom';
import './css/autorization.scss';

export function errorContainer () {
  const errorContainer = el('div.enter-container__error-container');
  return errorContainer;
}

export function createForm () {

  const inputLogin = el('input.enter-container__input.default-border', {type: 'text', placeholder: 'Логин',
    onblur() {
      if (this.value.includes(' ') || this.value.length < 6) {
        inputLogin.setAttribute('data-value', 'false');
      }
      else {
        inputLogin.setAttribute('data-value', 'true');
      }
    }
  });
  const inputKey = el('input.enter-container__input.default-border', {type: 'text', placeholder: 'Пароль',
    onblur() {
      if (this.value.includes(' ') || this.value.length < 6) {
        inputKey.setAttribute('data-value', 'false');
      }
      else {
        inputKey.setAttribute('data-value', 'true');

      }
    }
  });
  const btnSubmit = el('button.enter-container__btn', 'Войти', {type: 'submit'});
  const form = el('form.enter-container__form', [el('label.enter-container__label', 'Логин', inputLogin, ), el('label.enter-container__label', 'Пароль', inputKey), btnSubmit]);

  const allInput = form.querySelectorAll('input');
  allInput.forEach((el) => {
    el.addEventListener('input', () => {
      errorContainer.innerHTML = '';
      el.classList.remove('success-border');
      el.classList.remove('error-border');
    });
  });
  allInput.forEach((el) => {
    el.addEventListener('blur', () => {
      if (el.dataset.value === 'true') {
        el.classList.add('success-border');
      }
      else {
        el.classList.add('error-border');
      }
      if (Array.from(allInput).every((el) => el.dataset.value === 'true')) {
        btnSubmit.disabled = false;
      }
    });
  });
  return form;
}

export function createAutorizationBlock (form) {
  const enterContainer = el('div.enter-container', [el('h1.enter-container__title', 'Вход в аккаунт'), form])
  return enterContainer
}
