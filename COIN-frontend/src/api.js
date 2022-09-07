export function postLogin (obj) {
  return fetch(`http://localhost:3000/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify(obj)
  })
  .then(res => res.json())
  .then(obj => {
    if (obj.payload) {
      return obj.payload;
    };
    if (obj.error) {
      if (obj.error == 'Invalid password') {
        throw new Error('пытаемся войти с неверным паролем');
      }
      if (obj.error == 'No such user') {
        throw new Error('пользователя с таким логином не существует');
      }
      else {
        throw new Error('Что-то пошло не так, попробуйте перезагрузить страницу');
      }
    }
  })
};

export function postTransferFunds (obj, token) {
  return fetch(`http://localhost:3000/transfer-funds/`, {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json',
    Authorization: `Basic ${token}`
    },
    body: JSON.stringify(obj)
  })
  .then(res => res.json())
  .then(obj => {
    if (obj.payload) {
      return obj.payload;
    }
    if (obj.error) {
      if (obj.error == 'Invalid account from') {
        throw new Error('не указан адрес счёта списания, или этот счёт не принадлежит нам');
      }
      if (obj.error == 'Invalid account to') {
        throw new Error('не указан счёт зачисления, или этого счёта не существует');
      }
      if (obj.error == 'Invalid amount') {
        throw new Error('не указана сумма перевода, или она отрицательная');
      }
      if (obj.error == 'Overdraft prevented') {
        throw new Error('мы попытались перевести больше денег, чем доступно на счёте списания');
      }
      else {
        throw new Error('Что-то пошло не так, попробуйте перезагрузить страницу');
      }
    }
  });
};

export function postCurrencyBuy (obj, token) {
  return fetch(`http://localhost:3000/currency-buy/`, {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json',
    Authorization: `Basic ${token}`
    },
    body: JSON.stringify(obj)
  })
  .then(res => res.json())
  .then(obj => {
    if (obj.payload) {
      return obj.payload;
    }
    if (obj.error) {
      if (obj.error == 'Unknown currency code') {
        throw new Error('передан неверный валютный код');
      }
      if (obj.error == 'Invalid amount') {
        throw new Error('не указана сумма перевода, или она отрицательная');
      }
      if (obj.error == 'Not enough currency') {
        throw new Error('на валютном счёте списания нет средств');
      }
      if (obj.error == 'Overdraft prevented') {
        throw new Error('попытка перевести больше, чем доступно на счёте списания');
      }
      else {
        throw new Error('Что-то пошло не так, попробуйте перезагрузить страницу');
      }
    }
  });
};

export function getListScore (token) {
  return fetch(`http://localhost:3000/accounts/`, {
    // method: 'POST',
    headers: {
      'Content-Type': 'application/json',
       Authorization: `Basic ${token}`,
    },
  })
  .then(res => res.json())
  .then(obj => {
    return obj.payload;
  })
};

export function getInfoAboutScore (id, token) {
  return fetch(`http://localhost:3000/account/${id}`, {
    // method: 'POST',
    headers: {
      'Content-Type': 'application/json',
       Authorization: `Basic ${token}`,
    },
    // body: JSON.stringify(obj)
  })
  .then(res => res.json())
  .then(obj => obj.payload)
};

export function postCreateAccount (token) {
  return fetch(`http://localhost:3000/create-account/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${token}`,
    },
    // body: JSON.stringify(obj)
  }).then(res => res.json());
};

export function getBanks (token) {
  return fetch(`http://localhost:3000/banks/`, {
    headers: {
      'Content-Type': 'application/json',
       Authorization: `Basic ${token}`,
    },
  })
  .then(res => res.json())
  .then(obj => {
    return obj.payload;
  })
}

export function getCurrencies (token) {
  return fetch(`http://localhost:3000/currencies/`, {
    headers: {
      'Content-Type': 'application/json',
       Authorization: `Basic ${token}`,
    },
  })
  .then(res => res.json())
  .then(obj => {
    return obj.payload;
  })
}

export function getAllCurrencies (token) {
  return fetch(`http://localhost:3000/all-currencies/`, {
    headers: {
      'Content-Type': 'application/json',
       Authorization: `Basic ${token}`,
    },
  })
  .then(res => res.json())
  .then(obj => {
    return obj.payload;
  })
}

export function webSocketCurrencyFeed (container) {
  return new WebSocket(`ws://localhost:3000/currency-feed`);
}
