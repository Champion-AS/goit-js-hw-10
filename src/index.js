import './css/styles.css';
import lodash from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const searchEl = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchEl.addEventListener('input', debounce(getCantryData, DEBOUNCE_DELAY));

function getCantryData(evt) {
  let name = evt.target.value.trim();

  if (!name) {
    clearHtml();
    return;
  }

  fetchCountries(name)
    .then(obj => addCountries(obj))
    .catch(error => noCountryAlert());
}

function addCountries(obj) {
  if (obj.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
    return;
  }

  clearHtml();

  if (obj.length >= 2 && obj.length < 10) {
    const markup = addSmallCountryNames(obj);
    updatePege(countryList, markup);
  }

  if (obj.length === 1) {
    addLargeCountryName(obj);
  }
}

function clearHtml() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}

function noCountryAlert() {
  Notify.failure('There is no such country');
}

function addSmallCountryNames(arr) {
  return arr.map(({ flags: { svg }, name: { official } }) => {
    return `<li class="thumb thumb__margin"><img class='flag-img' src=${svg} alt="Country flag" width="40px"><span>${official}</span></li>`;
  }).join('');
}

function updatePege(element, markup = '') {
  element.innerHTML = markup;
}

function addLargeCountryName(arr) {
  const countryCapital = arr[0].capital.join('');
  const countryName = arr[0].name.official;
  const countryFlag = arr[0].flags.svg;
  const countryPopulation = arr[0].population;
  const countryLanguages = Object.values(arr[0].languages).join(', ');

  countryList.innerHTML = `<li><div class="thumb thumb__large-margin"><img class='flag-img' src=${countryFlag} alt="Country flag" width="40px"><span class='country-name'>${countryName}</span></div>
  <p class="main-text">Capital: <span class="secondary-text">${countryCapital}</span></p>
  <p class="main-text">Population: <span class="secondary-text">${countryPopulation}</span></p>
  <p class="main-text">Languages: <span class="secondary-text">${countryLanguages}</span></p></li>`;
}
