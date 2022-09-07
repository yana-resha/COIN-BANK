import {el} from 'redom';
import ymaps from 'ymaps';
import './css/mapTerminal.scss';
import {createSkeletonMap} from './skeleton.js'


export function mapPageTitle () {
  const title =  el('h1.map__title', 'Карта банкоматов')
  return title;
}

export function containerForMap () {
  const container = el('div.container-map#map');
  return container
}
export function createYandexMap (arr) {
  const container = document.querySelector('#map');
  ymaps.load("https://api-maps.yandex.ru/2.1/?apikey=11eb3ace-b7a7-4f8d-a457-c0679f545196&lang=ru_RU").then(maps => {
    container.innerHTML = '';
    const map = new maps.Map('map', {
      center: [55.76, 37.64],
      zoom: 10,
    })

    function getAddress(coords, myPlacemark) {
      myPlacemark.properties.set('iconCaption', 'поиск...');
      maps.geocode(coords).then(function (res) {
          var firstGeoObject = res.geoObjects.get(0);
          myPlacemark.properties
              .set({
                  // Формируем строку с данными об объекте.
                  iconCaption: [
                      // Название населенного пункта или вышестоящее административно-территориальное образование.
                      firstGeoObject.getLocalities().length ? firstGeoObject.getLocalities() : firstGeoObject.getAdministrativeAreas(),
                      // Получаем путь до топонима, если метод вернул null, запрашиваем наименование здания.
                      firstGeoObject.getThoroughfare() || firstGeoObject.getPremise()
                  ].filter(Boolean).join(', '),
                  // В качестве контента балуна задаем строку с адресом объекта.
                  balloonContent: firstGeoObject.getAddressLine()
              });
      });
  }
    arr.forEach(obj => {
      const myPlacemark = new maps.GeoObject({
        geometry: {
            type: "Point", // тип геометрии - точка
            coordinates: [obj.lat, obj.lon] // координаты точки
        }
      });
      map.geoObjects.add(myPlacemark);
      myPlacemark.events.add('click', (e) => {
        const coords = e.get('coords');
        getAddress(coords, myPlacemark);
      })
    })
  });
}

export function createBanksPage (arr, container = document.querySelector('.content-container')) {
  const containerMap = containerForMap();
  const title = mapPageTitle();
  containerMap.append(createSkeletonMap())
  container.append(title, containerMap);
  const yandexMap = createYandexMap(arr);
}
