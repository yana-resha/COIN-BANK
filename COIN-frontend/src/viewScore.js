import {el} from 'redom';
import './css/account-block.scss';
import './css/view-score.scss';
import './css/choices.scss';
import {postTransferFunds} from './api.js';
import {getAndCreateListScore} from './index.js';
import {createTitle} from './accountBlock.js';
import {errorContainer} from './autorizationBlock.js';
import autoComplete from '@tarekraafat/autocomplete.js';
import { setLocalStorage, getLocalStorage } from './localStorage';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import Navigo from 'navigo';
const router = new Navigo('/');


export function btnGoBack () {
  const btn = el('button.view__btn-back', el('span', ''), 'Вернуться назад');
  return btn
}


export function viewScoreFirstLine(obj) {
  const btnToBack = btnGoBack ();
  const title = createTitle();
  const topContainer = el('div.view__title-top-container', [title, btnToBack])
  title.textContent = 'Просмотр счета';
  const blockNumberScore = el('div.view__number-score', `№ ${obj.account}`);
  const blockBalance = el('div.view__balance', el('span', 'Баланс'), `${obj.balance}`);
  const bottomContainer = el('div.view__title-bottom-container', [blockNumberScore, blockBalance]);
  const titleContainer = el('div.view', [topContainer, bottomContainer]);
  return titleContainer;
}

export function createFormtoNewTranzaction () {

  const errorText = errorContainer();
  const inputScore = el('input.enter-container__input.default-border#number-score', {type: 'number', placeholder: ''});
  const inputSum = el('input.enter-container__input.default-border#amount', {type: 'number', placeholder: 'Сумма перевода'});
  const btnSubmit = el('button.enter-container__btn.view__btn-submit', 'Отправить', {type: 'submit'});
  const form = el('form.enter-container__form.view__score-form', [el('label.view__label', 'Номер счёта получателя', inputScore ), el('label.view__label', 'Сумма перевода', inputSum), btnSubmit, errorText]);


  const allInput = form.querySelectorAll('input');
  allInput.forEach((el) => {
    el.addEventListener('input', () => {
      errorText.innerHTML = '';
      el.classList.remove('success-border');
      el.classList.remove('error-border');

    });
  });
  allInput.forEach((el) => {
    el.addEventListener('blur', () => {
      if (el.value.length > 0) {
        el.classList.add('success-border');
      }
      else {
        el.classList.add('error-border');
      }
    });
  });
  return form;
}

export function createFormBlock (form) {
  const formScoreContainer = el('div.view__form-block', [el('h2.view__title-block', 'Новый перевод'), form])
  return formScoreContainer;
}

export function createDynamicsBalanceBlock () {
  const title = el('h2.view__title-block', 'Динамика баланса')
  const dynamicBlock = el('canvas#myChart');
  const containerForChart = el('div.view__dynamic-block', dynamicBlock)
  const containerBlock = el('div.view__chart-block',[title ,containerForChart])

  return containerBlock;
}

export function createBalanceChart (arrChart = [], countMonth = 6) {

  const ctx = document.getElementById('myChart').getContext("2d");

  Chart.defaults.font.family = "Ubuntu";
  Chart.defaults.font.size = 20;
  Chart.defaults.font.weight = 700;
  let labelChart = [];
  let dataChart = [];

  if (arrChart.length == 0) {
    for (let i = 0; i < countMonth; ++i) {
      let month = new Date().toLocaleDateString('ru', {year: 'numeric', month: 'long'})
      labelChart.push(month.substr(0,3))
      dataChart.push(0)
    }
  }
  else if (arrChart.length < countMonth && arrChart.length > 0) {
    for (let i = 0; i < arrChart.length; ++i) {
      let getMonth = arrChart[i].date.split(' ');
      labelChart.push(getMonth[0].substr(0,3))
      dataChart.push(arrChart[i].balance)
    }
  }
  else {
    for (let i = 0; i < countMonth; ++i) {
      let getMonth = arrChart[i].date.split(' ');
      labelChart.push(getMonth[0].substr(0,3))
      dataChart.push(arrChart[i].balance)
    }
  }

  const maxValue = Math.max.apply(null, dataChart);
  const minValue = Math.min.apply(null, dataChart);


  let dataFirst = {
    data: dataChart.reverse(),
    borderColor: "transporent",
    backgroundColor: "#116ACC",
    borderWidth: 0,
    fontSize: 20,
    fontWeith: 700,
    categoryPercentage: 0.5,
    // minBarLength: 0,
    yAxisID: "y-axis-gravity",
    xAxisID: "x-axis-density",
  };

  let dataSecond = {
    data: dataChart,
    borderColor: "transporent",
    backgroundColor: "#116ACC",
    borderWidth: 0,
    fontSize: 20,
    fontWeith: 700,
    categoryPercentage: 0.5,
    minBarLength: 0,
    yAxisID: "y",
    xAxisID: "x",
  };

  let speedData = {
    labels: labelChart.reverse(),
    datasets: [dataFirst]
  };

  let speedData2 = {
    labels: labelChart,
    datasets: [dataSecond]
  };

  const myChart = new Chart(ctx, {
    type: 'bar',
    data: speedData, speedData2,
    options: {
      responsive: true,
      scales: {
        "x-axis-density": {
          padding: 0,
          grid: {
            drawBorder: true,
            borderColor: 'black',
            color: "transparent",
            tickColor: "transparent",
          },

          ticks: {
            display: true,
            fontFamily: 'Ubuntu',
            color: 'black',
          },
          title: {
            padding: 0,
            display: false,
          },
          position: 'bottom',
        },
        "y-axis-gravity": {
          type: 'logarithmic',
          grid: {
            drawBorder: true,
            color: "transparent",
            tickColor: "transparent",
            borderColor: "black",
          },
          ticks: {
            display: true,
            max: maxValue,
            min: 0,
            stepSize: 1,
            color: 'black',
            font: {
              weight: 500,
            },
            align: 'bottom',
            callback: function(value, index, values) {
              if (index == (values.length -1)) return Math.round(maxValue);
              else if (index === 0) return Math.round(minValue);
              // else return '';
            }
            },
          position: 'right',
          },
          "x": {
            padding: 0,
            grid: {
              drawBorder: true,
              borderColor: 'black',
              color: "transparent",
              tickColor: "transparent",
            },

            ticks: {
              display: false,
              fontFamily: 'Ubuntu',
              color: 'black',
            },
            title: {
              padding: 0,
              display: false,
              text: '3000',
              align: 'start',
            },
            position: 'top',
          },
          "y": {
            type: 'logarithmic',
            grid: {
              drawBorder: true,
              color: "transparent",
              tickColor: "transparent",
              borderColor: "black",
            },
            ticks: {
              display: false,
            },

            position: 'left',

            },
          },
          plugins: {
            title: {
              display: false,
              text: 'Динамика баланса',
              fontColor: 'black',
              font: {
                size: 20,
                family: 'Ubuntu'
              },

            },
            legend: {
              display: false,
              boxWidth: 0,
            },
          },

      }
  })
}

export function creatAmountChart (arrChart = [], countMonth = 6) {

  const ctx = document.getElementById('myChartAmount').getContext("2d");
  let purple_orange_gradient = ctx.createLinearGradient(0, 0, 0, 600);
  purple_orange_gradient.addColorStop(0, 'orange');
  purple_orange_gradient.addColorStop(1, 'purple');


  Chart.defaults.font.family = "Ubuntu";
  Chart.defaults.font.size = 20;
  Chart.defaults.font.weight = 700;
  let labelChart = [];
  let dataChartPositive = [];
  let dataChartNegative = [];
  let dataChart = [];

  // negativeAmount: 14032223, positiveAmount: 15346085

  if (arrChart.length <= 0) {
    for (let i = 0; i < countMonth; ++i) {
      let month = new Date().toLocaleDateString('ru', {year: 'numeric', month: 'long'})
      arrChart.push({balance: 0,'date': month, negativeAmount: 0, positiveAmount: 0})
    }
  }

  for (let i = 0; i < countMonth; ++i) {
    let getMonth = arrChart[i].date.split(' ');
    labelChart.push(getMonth[0].substr(0,3))
    dataChartPositive.push(arrChart[i].positiveAmount)
    dataChartNegative.push(arrChart[i].negativeAmount)
    dataChart.push(arrChart[i].balance)
  }
  const maxValue = Math.max.apply(null, dataChart);
  const minValue = Math.min.apply(null, dataChart);

  const maxValueNegativeAmount = Math.max.apply(null, dataChartNegative);
  const maxValuePositiveAmount = Math.max.apply(null, dataChartPositive);
  const maxValueAmount = Math.max.apply(null, [maxValueNegativeAmount, maxValuePositiveAmount]);

  const data = {
    labels: labelChart.reverse(),
    datasets: [
      {
        label: 'Dataset 2',
        data:  dataChartNegative.reverse(),
        backgroundColor: '#FD4E5D',
        categoryPercentage: 0.5,
        stack: 'Stack 0',
      },
      {
        label: 'Dataset 1',
        data: dataChartPositive.reverse(),
        backgroundColor: '#76CA66',
        categoryPercentage: 0.5,
        stack: 'Stack 0',
      },
      {
        label: 'Dataset 3',
        stack: 'Stack 0',
        data: dataChart.reverse(),
        backgroundColor: '#116ACC',
        yAxisID: "y-axis-gravity",
        xAxisID: "x-axis-density",
        categoryPercentage: 0.5,
      },
    ]
  };

  const myChart = new Chart(ctx, {
    type: 'bar',
    data: data,
    options: {
      responsive: true,
      scales: {
        "x-axis-density": {
          stacked: true,
          padding: 0,
          grid: {
            drawBorder: true,
            borderColor: 'black',
            color: "transparent",
            tickColor: "transparent",
          },

          ticks: {
            display: true,
            fontFamily: 'Ubuntu',
            color: 'black',
          },
          title: {
            padding: 0,
            display: false,
          },
          position: 'bottom',
        },
        "y-axis-gravity": {
          stacked: true,
          type: 'logarithmic',
          grid: {
            drawBorder: true,
            color: "transparent",
            tickColor: "transparent",
            borderColor: "black",
          },
          ticks: {
            display: true,
            max: maxValue,
            min: 0,
            // stepSize: 1,
            color: 'black',
            font: {
              weight: 500,
            },
            align: 'bottom',

            callback: function(value, index, values) {

              if (index == (values.length -1)) return Math.round(maxValue);
              if (index == 19) return Math.round(maxValueAmount);
              else if (index === 0) return Math.round(minValue);
              // else return '';
            }
            },
          position: 'right',
          },
          "x": {
            stacked: true,
            padding: 0,
            grid: {
              drawBorder: true,
              borderColor: 'black',
              color: "transparent",
              tickColor: "transparent",
            },

            ticks: {
              display: false,
              fontFamily: 'Ubuntu',
              color: 'black',
            },
            title: {
              padding: 0,
              display: false,
              text: '3000',
              align: 'start',
            },
            position: 'top',
          },
          "y": {
            stacked: true,
            type: 'logarithmic',
            grid: {
              drawBorder: true,
              color: "transparent",
              tickColor: "transparent",
              borderColor: "black",
            },
            ticks: {

              display: false,
            },

            position: 'left',

            },
          },
          plugins: {
            title: {
              display: false,
              text: 'Динамика баланса',
              fontColor: 'black',
              font: {
                size: 20,
                family: 'Ubuntu'
              },

            },
            legend: {
              display: false,
              boxWidth: 0,
            },
          },

      }
  })


  }
export function createArrayForChartBar (obj, count = 18) {
  let allTransactions = obj.transactions;


  if (allTransactions.length > 0) {
  let earliestTrans = allTransactions.reduce(function (pre, cur) {
    return Date.parse(pre.date) > Date.parse(cur.date) ? cur : pre;
  });

  let lastTrans = allTransactions.reduce(function (pre, cur) {
    return Date.parse(pre.date) < Date.parse(cur.date) ? cur : pre;
  });


  let arrTransactionsDate = [];
  for (let i=0; i <= count; i++){
    var dateObj = new Date();
    dateObj.setMonth(dateObj.getMonth() - i);
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var year = dateObj.getUTCFullYear();
    let newdate = new Date(year + "-" + month).toLocaleDateString('ru', {year: 'numeric', month: 'long'})
    arrTransactionsDate.push(newdate);
  }

  let balanceForEveryMonth = [];

  let arr = arrTransactionsDate
    .forEach(date => {
      balanceForEveryMonth.push({date: date, transactions: []});
    })


  let date;
  allTransactions.forEach(el => {
    date = new Date(el.date).toLocaleDateString('ru', {year: 'numeric', month: 'long'});
    for (let x of balanceForEveryMonth) {
      if (x.date == date) {
        x.transactions.push(el);
      };
    }
  })


  let account = obj.account;
  let balance = obj.balance;

  balanceForEveryMonth[0]['balance'] = obj.balance;


  for (let i = 0; i < balanceForEveryMonth.length -1; ++i) {
    let negativeAmount = 0;
    let positiveAmount = 0;
    if (balanceForEveryMonth[i].transactions.length > 0) {
      for (let j of balanceForEveryMonth[i].transactions) {
        if (j.to === account) {
          balance = Math.round((balance - j.amount) * 100) / 100;
          positiveAmount += j.amount;
        }
        if (j.to !== account) {
          balance = Math.round((balance + j.amount) * 100) / 100;
          negativeAmount += j.amount;
        }
      balanceForEveryMonth[i]['negativeAmount'] = Math.round(negativeAmount);
      balanceForEveryMonth[i]['positiveAmount'] =   Math.round(positiveAmount);
      }
    }
    balanceForEveryMonth[i]['negativeAmount'] = Math.round(negativeAmount);
    balanceForEveryMonth[i]['positiveAmount'] = Math.round(positiveAmount);
    balanceForEveryMonth[i + 1]['balance'] = balance;
  }
  console.log(balanceForEveryMonth)
    return balanceForEveryMonth;
  }
  if (allTransactions.length === 0) {
    return [];
  }
}

export function createTableContainer () {
  const bottomContainer = el('div.view__bottom-container', el('h2.view__title-block', 'История переводов'));
  return bottomContainer;
}

export function createTableTransactions (trans, countTrans = 10, indexForCycle = 1) {
  const tableBody = el('tbody');
  const table = el('table.table#table', el('thead', el('tr.table__title-row', [el('th', 'Счёт отправителя'), el('th', 'Счёт получателя'), el('th', 'Сумма'), el('th', 'Дата')])),tableBody);

  const containerForTable = el('div.view__table-container', [table])
  const myUrl = new URL(window.location.href);
  const account = myUrl.searchParams.get('id');
  if (trans.length === 0) {
    table.textContent = 'По вашему счету еще не было переводов';
  }
  else if (trans.length > 0 && trans.length < countTrans) {

    for (let i = trans.length-1; i >= 0; --i) {
      const date = new Date(trans[i].date).toLocaleDateString('ru', {year: 'numeric', month: 'numeric', day: 'numeric'});
      const amount = trans[i].amount;
      const to = trans[i].to;
      const row = el('tr', [el('td', `${trans[i].from}`), el('td', `${to}`), el('td.col'), el('td.col', `${date}`)]);

      tableBody.append(row);
      if (to === account) {
        row.children[2].textContent = `+ ${amount}`
        row.children[2].classList.add('success-color');
      }
      else {
        row.children[2].textContent = `- ${amount}`
        row.children[2].classList.add('error-color');
      }
    }
  }
  else if (trans.length >= countTrans) {
    for (let i = trans.length - indexForCycle; i > (trans.length - indexForCycle - countTrans); --i) {
      const date = new Date(trans[i].date).toLocaleDateString('ru', {year: 'numeric', month: 'numeric', day: 'numeric'});
      const amount = trans[i].amount;
      const to = trans[i].to;
      const row = el('tr', [el('td', `${trans[i].from}`), el('td', `${to}`), el('td.col'), el('td.col', `${date}`)]);

      tableBody.append(row);
      if (to === account) {
        row.children[2].textContent = `+ ${amount}`
        row.children[2].classList.add('success-color');
      }
      else {
        row.children[2].textContent = `- ${amount}`
        row.children[2].classList.add('error-color');
      }
    }
  }
  return containerForTable;
}

export function createAutoComplete (id, array) {
  const autoCompleteJS = new autoComplete({
    selector: id,
    placeHolder: "Номер счета",
    data: {
        src: array,
        cache: true,
    },
    resultsList: {
        element: (list, data) => {
            if (!data.results.length) {
                // Create "No Results" message element
                const message = document.createElement("div");
                // Add class to the created element
                message.setAttribute("class", "no_result");
                // Add message text content
                message.innerHTML = `<span>Found No Results for "${data.query}"</span>`;
                // Append message element to the results list
                list.prepend(message);
            }
        },
        noResults: true,
    },
    resultItem: {
        highlight: true
    },
    events: {
        input: {
            selection: (event) => {
                const selection = event.detail.selection.value;
                autoCompleteJS.input.value = selection;
            }
        }
    }
    });
}

export function createPagination (trans, noteOnPAge = 25) {
  const paginationList = el('div.pagination-list');
  let countPage = Math.round(trans.length/noteOnPAge)

  if (countPage < 7) {
    for (let i = 1; i <= countPage; ++i) {
      const btn = el('button.pagination-btn', `${i}`);
      paginationList.append(btn)
    }
  }
  else {
    const buttonBack = el('button.pagination-btn', `<`);
    buttonBack.disabled = true;
    paginationList.append(buttonBack)
    for (let i = 1; i < 7; ++i) {
      const btn = el('button.pagination-btn-number', `${i}`);
      paginationList.append(btn);
    }
    const buttonNext = el('button.pagination-btn', `>`);
    paginationList.append(buttonNext);
    const allBtn = paginationList.querySelectorAll('.pagination-btn-number');
    Array.from(allBtn).forEach(btn => {
      btn.addEventListener('click', () => {
        btn.classList.add('active-btn-pagination');
        const activeBtn = btn;
        Array.from(allBtn).forEach(button => {
          if (button !== activeBtn && button.classList.contains('active-btn-pagination')) {
            button.classList.remove('active-btn-pagination')
          }
      })
        let index = Number(btn.textContent) * noteOnPAge;
        const newTable = createTableTransactions(trans, noteOnPAge, index);
        table.replaceWith(newTable);
      })
    })
    buttonNext.addEventListener('click', () => {
      Array.from(allBtn).forEach(btn => {
        if (btn.classList.contains('active-btn-pagination')) {
          btn.classList.remove('active-btn-pagination')
        }
        let count = Number(btn.textContent) + 6;
        btn.textContent = count;
        if (allBtn[0].textContent > 1) {
          buttonBack.disabled = false;
        }
        if (allBtn[5].textContent == countPage) {
          buttonNext.disabled = true;
        }
      })
    });
    buttonBack.addEventListener('click', () => {
      Array.from(allBtn).forEach(btn => {
        if (btn.classList.contains('active-btn-pagination')) {
          btn.classList.remove('active-btn-pagination')
        }
        let count = Number(btn.textContent) - 6;
        btn.textContent = count;
        if (allBtn[0].textContent == 1) {
          buttonBack.disabled = true;
        }
        if (allBtn[5].textContent < countPage) {
          buttonNext.disabled = false;
        }
      })
    })
  }
  return paginationList;
}

export function createDetailesPage (obj, container) {
  const containerVeiwScorePage = el('div');
  const titleLine = viewScoreFirstLine(obj);
  const title = titleLine.querySelector('h1');
  const backBtn = titleLine.querySelector('button');
  const dynamycBlock = createDynamicsBalanceBlock();
  const dynamycAmountBlock = createDynamicsBalanceBlock();
  const dynamycAmountBlockTitle = dynamycAmountBlock.querySelector('h2');
  dynamycAmountBlockTitle.textContent = 'Соотношение входящих исходящих транзакций'
  dynamycBlock.style.marginBottom = '50px';
  dynamycBlock.style.paddingBottom = '45px';
  dynamycAmountBlock.style.marginBottom = '50px';
  dynamycAmountBlock.style.paddingBottom = '45px';

  const dynamClick = dynamycBlock.querySelector('.view__dynamic-block');
  const dynamClickAmount = dynamycAmountBlock.querySelector('.view__dynamic-block');
  dynamClickAmount.style.cursor = 'default'


  dynamClick.style.cursor = 'default';
  dynamycBlock.style.width = '100%';
  dynamycAmountBlock.style.width = '100%';
  containerVeiwScorePage.append(dynamycBlock, dynamycAmountBlock);

  const canvasAmount = dynamycAmountBlock.querySelector('canvas');
  canvasAmount.id = 'myChartAmount';

  const transactions = obj.transactions;
  const bottomContainer = createTableContainer();
  const table = createTableTransactions(transactions, 25);
  const pagination = createPagination(transactions, 25, bottomContainer)
  bottomContainer.append(table);
  table.style.cursor = 'default'
  containerVeiwScorePage.append(bottomContainer);
  if (transactions.length > 25) {
    bottomContainer.append(pagination)
  }
  container.append(titleLine,containerVeiwScorePage);

  const canvas = document.getElementById('myChart');
  canvas.setAttribute('width', '1000px');
  canvas.setAttribute('height', '165px');
  const canvas2 = document.getElementById('myChartAmount');
  canvas2.setAttribute('width', '1000px');
  canvas2.setAttribute('height', '165px');
  const arrChart = createArrayForChartBar(obj);
  const chart = createBalanceChart (arrChart, 12);
  const chartAmount = creatAmountChart(arrChart, 12);
  title.textContent = 'История баланса';
  backBtn.addEventListener('click', () => {
    container.innerHTML = '';
    createVeiwScorePage(obj, container);
  })

}

export function createVeiwScorePage(obj, container) {
  const containerVeiwScorePage = el('div');
  const title = viewScoreFirstLine(obj);

  const form = createFormtoNewTranzaction();

  const formBlock = createFormBlock (form);
  const dynamycBlock = createDynamicsBalanceBlock();
  const topContainer = el('div.view__top-container', [formBlock, dynamycBlock])
  containerVeiwScorePage.append(title, topContainer);
  container.append(containerVeiwScorePage);
  const canvas = document.getElementById('myChart');

  canvas.setAttribute('width', '510px');
  canvas.setAttribute('height', '165px');
  const arrChart = createArrayForChartBar(obj);
  const chart = createBalanceChart (arrChart);



  const transactions = obj.transactions;
  const bottomContainer = createTableContainer();
  const table = createTableTransactions(transactions);
  bottomContainer.append(table);
  container.append(bottomContainer);

  const backBtn = title.querySelector('button');

  backBtn.addEventListener('click', () => {
    window.history.pushState({}, '', `/account`);
    container.innerHTML = '';
    getAndCreateListScore();
  })

  const token = getLocalStorage('token');
  const errorBlock = form.querySelector('.enter-container__error-container');
  formBlock.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputForm = formBlock.querySelectorAll('input');
    if (inputForm[1].value == 0) {
      inputForm[1].classList.add('error-border');
      errorBlock.textContent = 'сумма перевода должна быть больше 0';
      return;
    }
    Array.from(inputForm).forEach(input => {
      if (input.value.length <= 0) {
        input.classList.add('error-border');
        errorBlock.textContent = 'заполните все поля ввода';
        return;
      }
      else {
        input.classList.add('success-border');
        errorBlock.textContent = '';
      }
    })
    const postObj = {from: `${obj.account}`, to: inputForm[0].value, amount: inputForm[1].value};
    const postAmount = postTransferFunds(postObj, token)
      .then(newObj => {
        container.innerHTML = '';
        createVeiwScorePage(newObj, container);
      })
      .catch(err => {
        errorBlock.textContent = err.message;
      });
    setLocalStorage('to', inputForm[0].value);
    setLocalStorage('amount', inputForm[1].value);
  })

  const getLocalStorageTo = getLocalStorage('to');
  const getLocalStorageAmount = getLocalStorage('amount');
  let arrayForComleteTo = [];
  let arrayForComleteAmount = [];

  if (getLocalStorageTo !== null) {
    arrayForComleteTo = [...getLocalStorageTo]
  }

  if (getLocalStorageAmount !== null) {
    arrayForComleteTo = [...getLocalStorageAmount]
  }

  createAutoComplete ('#number-score', arrayForComleteTo);


  const tableLink = table.querySelector('.table');

  [dynamycBlock, tableLink].forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      container.innerHTML = '';
      window.history.pushState({}, '', `/viewScoreDetails`);
      const detailPage = createDetailesPage(obj, container);
    })
  })
  return containerVeiwScorePage;
}

