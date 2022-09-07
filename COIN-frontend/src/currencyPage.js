import {el} from 'redom';
import './css/currencyPage.scss';
import {getCurrencies, webSocketCurrencyFeed, getAllCurrencies, postCurrencyBuy} from './api.js';
import {errorContainer} from './autorizationBlock.js';
import Choices from 'choices.js';
import './css/choices.scss';
import {setLocalStorageWebsocketArr, getLocalStorage} from './localStorage.js';


function createLeftContainer () {
  const container = el('div.currency__left-container')
  return container
}

function createContainerForCurrencyDynamicList () {
  const container = el('div.currency__dynamic-block', el('h2.currency__block-title', 'Изменение курсов в реальном времени'))
  return container
}

function createDynamycList () {
  const list = el('ul.currency__list');
  return list
}

function createDynamycListElement (obj) {
  const borderDecorate = el('span.currency__decorate');
  const redColor = '#FD4E5D';
  const greenColor = '#76CA66';
  const treangle = el('span', '')
  if (obj.change === 1) {
    borderDecorate.style.borderColor = greenColor;
    treangle.classList.add('treangle-green');
  }
  if (obj.change === -1) {
    borderDecorate.style.borderColor = redColor;
    treangle.classList.add('treangle-red');
  }
  const li = el('li',[el('span.currency__name-currency', `${obj.from}/${obj.to}`), borderDecorate, el('span.currency__amount', `${obj.rate}`, treangle)]);
  return li
}

function createCurrencyList (obj) {
  const list = el('ul.currency__list');

  for (let i of Object.values(obj)) {
    const li = el('li',[el('span.currency__name-currency', `${i.code}`), el('span.currency__decorate'), el('span.currency__amount', `${i.amount}`)]);
    list.append(li)
  }
  return list
}

function createContainerForCurrencyList () {
  const container = el('div.currency__left-top-container', el('h2.currency__block-title', 'Ваши валюты'))
  return container
}

function pageTitle () {
  const title =  el('h1.currency__title', 'Валютный обмен')
  return title;
}

function createFormCurrency (arr, error, token, topLeftContainer) {
  const form = el('form.currency__form');
  const selectFrom = el('select#from', {onchange () {
    error.innerHTML = '';
  }});
  const selectTo = el('select#to', {onchange () {
    error.innerHTML = '';
  }});
  const labelTo = el('label', 'в', selectTo);
  const labelFrom = el('label','Из', selectFrom);
  const inputSum = el('input.currency__input.default-border', {type: 'number', placeholder: 'Placeholder',
  oninput () {
    error.innerHTML = '';
    inputSum.classList.remove('success-border');
    inputSum.classList.remove('error-border');

  },
  onblur() {
    if (this.value.includes(' ') || this.value <= 0 || this.value.length < 1) {
      inputSum.classList.add('error-border');
      error.textContent = 'Введите корректную сумму';
    }
    else {
      // inputSum.setAttribute('data-value', 'true');
      inputSum.classList.add('success-border');

    }
  }
});
  const labelSum = el('label','Сумма', inputSum);
  const flexContainer = el('div.currency__form-flex', [labelFrom, labelTo, labelSum]);
  const btnSubmit = el('button.currency__btn-sbm', 'Обменять', {type: 'submit'});

  arr.forEach(cur => {
    const optionFrom = el('option', `${cur}`);
    const optionTo = el('option', `${cur}`);
    selectFrom.append(optionFrom);
    selectTo.append(optionTo);
  })
  form.append(flexContainer, btnSubmit, error);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (inputSum.value.length <= 0) {
      inputSum.classList.add('error-border');
      error.textContent = 'Введите сумму';
      return
    }
    if (selectFrom.value === selectTo.value) {
      error.textContent = 'Для перевода указаны одинаковые валюты, операция не будет выполнена';
      return
    }
    error.textContent = '';
    const obj = {from : selectFrom.value, to: selectTo.value, amount: inputSum.value};
    postCurrencyBuy(obj, token)
      .then(el => {
        topLeftContainer.children[1].remove();
        const list = createCurrencyList(el);
        topLeftContainer.append(list);
        inputSum.value = '';
        inputSum.classList.remove('success-border');
        inputSum.classList.remove('error-border');
      })
      .catch(err => error.textContent = `${err.message}`);
  })
  return form
}

export function createCurrencyPage (container, token) {
  const title = pageTitle ();
  const topLeftContainer = createContainerForCurrencyList();
  const bottomLeftContainer = createContainerForCurrencyList();
  const dynamycBlock = createContainerForCurrencyDynamicList ();
  const dynamycList  = createDynamycList();
  dynamycBlock.append(dynamycList)
  const error = errorContainer();
  const leftContainer = createLeftContainer();
  leftContainer.append(topLeftContainer, bottomLeftContainer);
  bottomLeftContainer.children[0].textContent = 'Обмен валюты';
  const flexContainer = el('div.currency__page-flex', [leftContainer, dynamycBlock]);
  container.append(title, flexContainer);


  const arrLocalCurrency = getLocalStorage('socket');
  if (arrLocalCurrency === null || arrLocalCurrency.length <= 0) {
    const socketArr = [];
    setLocalStorageWebsocketArr(socketArr);
  }
  if (arrLocalCurrency.length > 0) {
    arrLocalCurrency.forEach(obj => {
      const li =  createDynamycListElement(obj);
      dynamycList.append(li)
    })
  }
  getCurrencies(token)
    .then(arr => {
      const list = createCurrencyList(arr);
      topLeftContainer.append(list);
    })

  getAllCurrencies(token)
    .then(arr => {
      const form = createFormCurrency(arr, error, token, topLeftContainer);
      bottomLeftContainer.append(form, error);
      const choiceSelectFrom = container.querySelector('#from');
      const choiceSelectTo = container.querySelector('#to');
      const choices = new Choices(choiceSelectFrom);
      const choices2 = new Choices(choiceSelectTo);
    })




    let arrSocketMessageLocal = getLocalStorage('socket');
    let arrSocketMessage = [...arrSocketMessageLocal];
    const socket = webSocketCurrencyFeed();
    socket.onmessage = function (e) {
      const newData = JSON.parse(e.data);
      if (arrSocketMessage.length === 0) {
        arrSocketMessage.push(newData);
        setLocalStorageWebsocketArr(arrSocketMessage);
      };
      const searchIncludes = arrSocketMessage.every(obj => obj.to !== newData.to && obj.from !== newData.from);
      if (searchIncludes === true && newData.change !== 0) {
        arrSocketMessage.push(newData);
        setLocalStorageWebsocketArr(arrSocketMessage);
        dynamycList.innerHTML = '';
        const arrList = getLocalStorage('socket');
        arrList.forEach(obj => {
          const li =  createDynamycListElement(obj);
          dynamycList.append(li)
        })
      }
      if (searchIncludes === false && newData.change !== 0) {
        arrSocketMessage.forEach((obj, index, arr) => {
          if (obj.to === newData.to && obj.from === newData.from) {
            arr[index].rate = newData.rate;
            arr[index].change = newData.change;
            setLocalStorageWebsocketArr(arrSocketMessage);
            dynamycList.innerHTML = '';
            const arrList = getLocalStorage('socket');
            arrList.forEach(obj => {
              const li =  createDynamycListElement(obj);
              dynamycList.append(li)
            })
          }
        })
      }
    };
    socket.onclose = function (e) {
      const arrSocketLocal = getLocalStorage('socket');
      if (arrSocketLocal.length === 0) {
        dynamycList.style.color = 'red';
        dynamycList.innerHTML = 'Сервис временно недоступен, попробуйте перезагрузить страницу';
      }
    }

    socket.onerror = function (e) {
      const arrSocketLocal = getLocalStorage('socket');
      if (arrSocketLocal.length === 0) {
        dynamycList.style.color = 'red';
        dynamycList.innerHTML = 'Сервис временно недоступен, попробуйте перезагрузить страницу';
      }
    }
}
