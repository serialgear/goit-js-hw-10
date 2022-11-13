import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import fetchCountries from './fetchCountries';

const inputEl = document.querySelector('#search-box');
const ulEl = document.querySelector('.country-list');
const divEl = document.querySelector('.country-info');
const DEBOUNCE_DELAY = 300;

inputEl.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

inputEl.insertAdjacentHTML('beforebegin', '<h1>Country Finder</h1>');
inputEl.placeholder = 'country name';

function onSearch(e) {
  e.preventDefault();
  const nameInput = e.target.value.trim();
  if (nameInput.length === 0) {
    clearItem(ulEl);
    clearItem(divEl);
    return;
  }
  fetchCountries(nameInput).then(render).catch(onFetchError);
}

function render(items) {
  if (items.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
    clearItem(ulEl);
    clearItem(divEl);
  } else if (items.length >= 2 && items.length <= 10) {
    clearItem(ulEl);
    clearItem(divEl);
    return (ulEl.innerHTML = items
      .map(
        item =>
          `<li><img src="${item.flags.svg}" alt="${item.name.common}"/>${item.name.common}</li>`
      )
      .join(''));
  } else {
    clearItem(ulEl);
    clearItem(divEl);
    return (divEl.innerHTML = items.map(
      item =>
        `<h2><img src="${item.flags.svg}" alt="${item.name.official}" /> ${
          item.name.official
        }</h2>
        <ul class = 'list'>
        <li><b>Capital:</b>  ${item.capital}</li>
         <li><b>Population:</b>  ${item.population}</li>
          <li><b>Languages:</b>  ${Object.values(item.languages).join(
            ', '
          )}</li>
        </ul>`
    ));
  }
}
function clearItem(output) {
  output.innerHTML = '';
}
function onFetchError(error) {
  Notiflix.Notify.failure('Oops, there is no country with that name');
  clearItem(ulEl);
  clearItem(divEl);
}
