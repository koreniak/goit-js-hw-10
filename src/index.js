import './css/styles.css';
import { fetchCounties } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
const debounce = require('lodash.debounce')

const DEBOUNCE_DELAY = 300;

const refs = {
    input: document.querySelector('input#search-box'),
    list: document.querySelector('.country-list'),
    infoField: document.querySelector('.country-info')
}

refs.input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY))

function onInput(e) {
    const inputValue = e.target.value
    const trimInputValue = inputValue.trim()
    
    if (trimInputValue) {
        clearCountriesInfo()
        getCountryInfo(trimInputValue)
    }
}

function getCountryInfo(countriesResp) {
    fetchCounties(countriesResp)
        .then((countries) => {
            if (countries.length > 10) {
                Notify.info('Too many matches found. Please enter a more specific name.')
            } else if (countries.length >= 2) {
                renderCountriesListMarkup(countries)
            } else {
                renderCountriesInfoMarkup(countries)
            }
    }).catch((error) => Notify.failure('Oops, there is no country with that name'))
}

function renderCountriesListMarkup(countriesArray){
    const markup = countriesArray.map(({flags, name}) => {
        return `<li class="country-item">
                    <img src="${flags.svg}" alt="${flags.alt}" width="60" />
                    <p class="name-country">${name.official}</p>
                </li>`
    }).join('');
    refs.list.insertAdjacentHTML('beforeend', markup);
}

function renderCountriesInfoMarkup(country){
    const markup = country.map(({flags, name, capital, population, languages}) => {
        return `<div class="country-title">
                    <img src="${flags.svg}" alt="${flags.alt}" width="160" />
                    <h1 class="title-country">${name.official}</h1>
                </div>
                <p><span class="country-prop">Capital</span>: ${capital}</p>
                <p><span class="country-prop">Population</span>: ${population}</p>
                <p><span class="country-prop">Languages</span>: ${Object.values(languages).join(", ")}</p>`
    }).join('');
    refs.infoField.insertAdjacentHTML('beforeend', markup);
}

function clearCountriesInfo(){
    refs.list.innerHTML = '';
    refs.infoField.innerHTML = '';
}

