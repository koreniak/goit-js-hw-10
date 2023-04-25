import './css/styles.css';
import { fetchCounties } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
const debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;

const refs = {
    input: document.querySelector('input#search-box'),
    list: document.querySelector('.country-list'),
    infoField: document.querySelector('.country-info')
}

refs.input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
    const inputValue = e.target.value;
    const trimInputValue = inputValue.trim();
    
    if (trimInputValue) {
        clearCountriesInfo();
        getCountryInfo(trimInputValue);
    };
};

function getCountryInfo(countriesResp) {
    fetchCounties(countriesResp)
        .then((countries) => {
            serchCountries(countries)
        }).catch((error) => Notify.failure('Oops, there is no country with that name'));
};

function serchCountries(countriesData) {
    if (countriesData.length > 10) {
        Notify.info('Too many matches found. Please enter a more specific name.');
    } else if (countriesData.length >= 2) {
        renderCountriesListMarkup(countriesData);
    } else {
        renderCountryInfoMarkup(countriesData);
    };
};

function renderCountriesListMarkup(countriesArray){
    const markup = countriesArray.map(({flags, name}) => {
        return `<li class="country-item">
                    <img src="${flags.svg}" alt="${flags.alt}" width="80" />
                    <p class="country-name">${name.official}</p>
                </li>`;
    }).join('');
    refs.list.insertAdjacentHTML('beforeend', markup);
}

function renderCountryInfoMarkup(country){
    const markup = country.map(({flags, name, capital, population, languages}) => {
        return `<div class="country-head">
                    <img src="${flags.svg}" alt="${flags.alt}" width="80" />
                    <h1 class="country-title">${name.official}</h1>
                </div>
                <ul>
                    <li><span class="country-prop">Capital</span>: ${capital}</li>
                    <li><span class="country-prop">Population</span>: ${population}</li>
                    <li><span class="country-prop">Languages</span>: ${Object.values(languages).join(', ')}</li>
                </ul>`;
    }).join('');
    refs.infoField.insertAdjacentHTML('beforeend', markup);
}

function clearCountriesInfo() {
    refs.list.innerHTML = '';
    refs.infoField.innerHTML = '';
}

