import {el, setChildren} from 'redom';
import './css/account-block.scss';
import Choices from 'choices.js';
import './css/choices.scss';
import {getInfoAboutScore} from './api.js';
import {skeletonForVeiwScore} from './skeleton.js';
import {createVeiwScorePage} from './viewScore.js';
import {setLocalStorageAuthorisationInfo, getLocalStorage} from './localStorage'
import Navigo from 'navigo'


export function sortScore(array) {
  let sortArray = [...array];
  function sortForScore () {
    let newArr = sortArray.sort(function (a, b) {
      return b.account - a.account;
    });
    return newArr;
  }
  function sortForBalance () {
    let newArr = sortArray.sort(function (a, b) {
      return b.balance - a.balance;
    });
    return newArr;
  }
  function sortForDateTransaction() {
    let newArr = sortArray.sort(function (a, b) {

      if (a.transactions.length === 0) {
        a.transactions.push( {date: new Date(0), transactions: false})
      }
      if (b.transactions.length === 0) {
        b.transactions.push({date: new Date(0), transactions: false})
      }
       let dateA =  new Date(a.transactions[0].date);
       let dateB = new Date(b.transactions[0].date);
       return dateB - dateA;
      })

    newArr.forEach(obj => {
      if (obj.transactions[0].transactions === false) {
        obj.transactions = [];
      }
    })
    return newArr
  }
  return {sortForScore, sortForBalance, sortForDateTransaction}
}


export function btnNewScore () {
  const btn = el('button.account__btn-new-score', el('span', ''), 'Создать новый счет');
  return btn
}

export function createSortSelect () {
  const select = el('select.account__select.display-none', [el('option', 'Сортировка'), el('option', 'По номеру'), el('option', 'По балансу'), el('option', 'По последней транзакции')]);
  return select
}

export function createTitle() {
  const title =  el('h1.account__title')
  return title;
}

export function createTitleContainer() {
  const titleContainer = el('div.account');
  return titleContainer;
}

export function accountFirstLine () {
  const btnCreateScore = btnNewScore();
  const select = createSortSelect();
  const title = createTitle();
  title.textContent = 'Ваши счета'
  const titleContainer = createTitleContainer();

  titleContainer.append(title, select, btnCreateScore);
  const choiceSelect = titleContainer.querySelector('select');
  const choices = new Choices(choiceSelect);
  return titleContainer;
}

export function createListScoreTranzaction (array, container) {
  const router = new Navigo('/');
  const token = getLocalStorage('token');

  const list = el('ul.account__list');
  for (let i of array) {
    const lastTranzaction = el('div.account__tranzaction', 'Последняя тразакция:')
    for (let j of i.transactions) {
      const date = new Date(j.date).toLocaleDateString('ru', {year: 'numeric', month: 'long', day: 'numeric'});
      const tranzDate =  el('div.account__tranz-info', date);
      lastTranzaction.append(tranzDate);
    }
    const btnOpenInfo = el('button.account__btn-info', 'Открыть', {
      onclick () {
        window.history.pushState({}, '', `/viewScore`);
          setLocalStorageAuthorisationInfo('id', i.account);
          const id = getLocalStorage('id');
          container.innerHTML = '';
          const skeletonLoader = skeletonForVeiwScore();
          container.append(skeletonLoader);
          getInfoAboutScore(id, token)
          .then(obj => {
            createVeiwScorePage(obj, container);
          })
          .finally(() => {
            skeletonLoader.remove();
        });
      }
    });
    const bottomLine = el('div.account__bottom-line', [lastTranzaction, btnOpenInfo]);
    const ruble = el('span');
    ruble.innerHTML = '&#8381;';
    const numberScore = el('div.account__number-score', i.account);
    const balance = el('div.account__balance', `${i.balance}`);
    balance.append(ruble);
    const li = el('li.account__list-child', numberScore, balance, bottomLine);
    list.append(li);
  }
  router.resolve();
  return list;
}
