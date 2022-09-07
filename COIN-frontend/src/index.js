import {el, setChildren} from 'redom';
import './css/index.scss';
import {createAutorizationBlock, createForm, errorContainer} from './autorizationBlock.js';
import {postLogin, getListScore, postCreateAccount, getBanks, getInfoAboutScore} from './api.js';
import {skeletonAccountBlock} from './skeleton.js';
import {accountFirstLine, sortScore, createListScoreTranzaction} from './accountBlock.js';
import {createVeiwScorePage, createDetailesPage} from './viewScore'
import {createBanksPage} from './mapTerminal';
import {createCurrencyPage} from './currencyPage';
import {setLocalStorageAuthorisationInfo, getLocalStorage} from './localStorage'
import Navigo from 'navigo';


const router = new Navigo('/');

function createContentContainer () {
  const container = el('div.container.content-container');
  return container
}



export function navMenu () {
  const btnTerminal = el('button.nav__btn#terminal', 'Банкоматы',{onclick() {
    window.history.pushState({}, '', `terminal`);
    router.navigate('/terminal');
  }});
  const btnScore = el('button.nav__btn#score', 'Cчета', {onclick() {
    window.history.pushState({}, '', `account`);
    router.navigate('/account');

  }});
  const btnCurrency = el('button.nav__btn#currency', 'Валюта', {onclick() {
    window.history.pushState({}, '', `currency`);
    router.navigate('/currency');

  }});
  const btnExit = el('button.nav__btn', 'Выйти', {onclick () {
    window.history.pushState({}, '', 'authorisation');
    router.navigate('/authorisation');
  }});

  let navList = el('nav.nav.display-none', el('ul.nav__list', [
    el('li.list__part', btnTerminal),
    el('li.list__part', btnScore),
    el('li.list__part', btnCurrency),
    el('li.list__part', btnExit)
   ]));

  const allButton = navList.querySelectorAll('button')
  Array.from(allButton).forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.add('active-btn');
      const activeBtn = btn;
      Array.from(allButton).forEach(button => {
        if (button !== activeBtn && button.classList.contains('active-btn')) {
          button.classList.remove('active-btn')
        }
      })
      if (btn === btnExit) {
        Array.from(allButton).forEach(button => {
          button.classList.remove('active-btn')
        })
      }
    })
  });
  return navList;
}



const contentContainer = createContentContainer();
const firstLineAccountBlock = accountFirstLine();
const select = firstLineAccountBlock.querySelector('select');
const navList = navMenu();

function createHeader () {
  let header = el('header.header', el('div.container.header-container', [el('a.for-link.logo', 'Coin'), navList]))
  return header;
}


const header = createHeader();

export function getAndCreateListScore() {
  contentContainer.innerHTML = '';
  const skeletonLoader = skeletonAccountBlock();
  contentContainer.append(skeletonLoader);
  const token = getLocalStorage('token');
  getListScore(token)
  .then(arr => {
    const navList = document.querySelector('.nav');
    navList.classList.remove('display-none');
    contentContainer.append(firstLineAccountBlock);
    select.classList.remove('display-none');
    const listAboutScore = createListScoreTranzaction(arr, contentContainer);
    contentContainer.append(listAboutScore);
    let sort = sortScore(arr);
    select.addEventListener('change', () => {
      const listToReplace = document.querySelector('.account__list');
      listToReplace.remove();
      let sortArr = null;
      select.value === 'По номеру' ? sortArr = sort.sortForScore()
      : select.value === 'По балансу' ? sortArr = sort.sortForBalance()
      : select.value === 'По последней транзакции' ? sortArr = sort.sortForDateTransaction() : sortArr = arr;
      let newList = createListScoreTranzaction(sortArr, contentContainer)
      contentContainer.append(newList);
    })
  })
  .finally(() => {
    skeletonLoader.remove();
  })
}

setChildren(window.document.body, header, contentContainer);

function runSystem () {
  const formErrorBlock = errorContainer();
  const form = createForm();
  const btnCreateNewAccount = firstLineAccountBlock.querySelector('button');

  form.append(formErrorBlock);
  const autorizationBlock = createAutorizationBlock(form);
  setChildren(contentContainer, autorizationBlock);

  form.addEventListener('submit', (e) => {
  e.preventDefault();
  const inputForm = form.querySelectorAll('input')
  const enterValue = {login: inputForm[0].value, password: inputForm[1].value};
  const getToken = postLogin(enterValue)
    .then(obj => {
      setLocalStorageAuthorisationInfo('token', obj.token);
      const token = getLocalStorage('token');
      window.history.pushState({}, '', `/account`);
      getAndCreateListScore(token);
      btnCreateNewAccount.addEventListener('click', () => {
        postCreateAccount(token).then(getAndCreateListScore());
      })
    })
    .catch(err => {
      formErrorBlock.textContent = err.message;
    });
  });
}

runSystem()



router.on('/terminal', function () {
  const token = getLocalStorage('token');
  contentContainer.innerHTML = '';
  navList.classList.remove('display-none');
  navList.querySelector('#terminal').classList.add('active-btn')
  getBanks(token).then((arr) => createBanksPage(arr));

});

router.on('/account', function () {
  const token = getLocalStorage('token');
  contentContainer.innerHTML = '';
  navList.classList.remove('display-none');
  navList.querySelector('#score').classList.add('active-btn')
  getAndCreateListScore();
});



router.on('/currency', function () {
  const token = getLocalStorage('token');
  contentContainer.innerHTML = '';
  navList.classList.remove('display-none');
  navList.querySelector('#currency').classList.add('active-btn')
  const currencyPage = createCurrencyPage(contentContainer, token);
});

router.on('/viewScore', function () {
  const token = getLocalStorage('token');
  const id = getLocalStorage('id');
  contentContainer.innerHTML = '';
  navList.classList.remove('display-none');
  navList.querySelector('#score').classList.add('active-btn')
  getInfoAboutScore(id, token)
  .then(obj => {
    createVeiwScorePage(obj, contentContainer);
  })
});

router.on('/viewScoreDetails', function () {
  const token = getLocalStorage('token');
  const id = getLocalStorage('id');
  contentContainer.innerHTML = '';
  navList.classList.remove('display-none');
  navList.querySelector('#score').classList.add('active-btn')
  getInfoAboutScore(id, token)
  .then(obj => {
    createDetailesPage(obj, contentContainer);
  })
});



router.on('/authorisation', function () {
  navList.classList.add('display-none');
  window.history.pushState({}, '', '?');
  runSystem();
});

router.resolve();


