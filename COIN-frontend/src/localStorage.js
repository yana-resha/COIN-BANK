export function setLocalStorage (key, value) {

  let newArr = [];

  let arrayValues = JSON.parse(localStorage.getItem(key));

  if (arrayValues !== null && arrayValues.length > 0) {
    arrayValues.forEach(element => {
      newArr.push(element);
    });
    if (!newArr.includes(value)) {
      newArr.push(value);
    }
  } else {
    newArr.push(value)
  };


  localStorage.setItem(key, JSON.stringify(newArr));
}

export function setLocalStorageAuthorisationInfo(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getLocalStorage (key) {
  return JSON.parse(localStorage.getItem(key));
}

export function setLocalStorageWebsocketArr (socketArr) {
  localStorage.setItem('socket', JSON.stringify(socketArr));
}
