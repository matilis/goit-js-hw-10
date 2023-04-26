import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;
const searchEl = document.getElementById('search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

searchEl.addEventListener(
  'input',
  debounce(async event => {
    const countryName = event.target.value.trim();

    if (countryName === '') {
      countryListEl.innerHTML = '';
      countryInfoEl.innerHTML = '';
      return;
    }
    const countries = await fetchCountries(countryName);

    if (countries.length > 10) {
      Notiflix.Notify.info(
        'Too many matches found. Please enter a more specific name.'
      );
    } else if (countries.length > 1 && countries.length <= 10) {
      countryListEl.innerHTML = countries
        .map(
          country =>
            `<li><img src="${country.flags.png}"/>
            ${country.name.common}</li>`
        )
        .join('');
    } else if (countries.length === 1) {
      countryListEl.innerHTML = countries
        .map(
          country =>
            `<li><img src="${country.flags.png}"/>
            ${country.name.common}</li>`
        )
        .join('');
      countryInfoEl.innerHTML = `
      <p>Capital: ${countries[0].capital}</p>
      <p>Population: ${countries[0].population}</p>
      <p>Languages: ${Object.values(countries[0].languages).join(', ')}</p>`;
    } else {
      Notiflix.Notify.failure('Oops, there is no country with that name');
    }
  }, DEBOUNCE_DELAY)
);
