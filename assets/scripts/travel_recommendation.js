let loadedSearchData = {};

const resultDiv = document.getElementById('search-results');
const noResult = document.getElementById('no-result');
const invalidKeyWord = document.getElementById('invalid-result');

// Load JSON data
fetch('assets/data/travel_recommendation_api.json')
  .then(response => response.json())
  .then(data => {
    loadedSearchData = data;
  })
  .catch(error => console.error('Error loading data:', error));

// Initialize event listeners after DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
  initializeEventListeners();
});

function initializeEventListeners() {
  document.getElementById('searchButton').addEventListener('click', doSearch);
  document.getElementById('searchBarInput').addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      doSearch();
    }
  });
  document.getElementById('clearButton').addEventListener('click', clearSearch);
}

function doSearch() {
  const query = getQuery();

  if (query === '') {
    showEmptyQuery();
    return;
  }

  const results = searchResults(query);
  handleResultVisibility(results);
}

function clearSearch() {
  document.getElementById('searchBarInput').value = '';
  resultDiv.style.visibility = 'hidden';
  noResult.style.visibility = 'hidden';
  invalidKeyWord.style.visibility = 'hidden';
  resultDiv.innerHTML = '';
}

function showEmptyQuery() {
  resultDiv.style.visibility = 'visible';
  noResult.style.visibility = 'hidden';
  invalidKeyWord.style.visibility = 'visible';
  resultDiv.innerHTML = '';
}

function getQuery() {
  return document.getElementById('searchBarInput').value.trim().toLowerCase();
}

function searchResults(query) {
  let results = [];

  if (query.includes('beach')) {
    results = results.concat(loadedSearchData.beaches);
  }

  if (query.includes('temple')) {
    results = results.concat(loadedSearchData.temples);
  }

  if (query.includes('countr')) {
    results = results.concat(searchAllCities());
  } else {
    results = results.concat(searchCitiesAndCountries(query));
    results = results.concat(searchBeachesAndTemplesInCountry(query));
  }

  return results;
}

function searchAllCities() {
  let allCityList = [];
  loadedSearchData.countries.forEach(country => {
    country.cities.forEach(city => {
      allCityList.push({
        name: city.name,
        description: city.description,
        imageUrl: city.imageUrl
      });
    });
  });
  return allCityList;
}

function searchCitiesAndCountries(query) {
  let results = [];

  loadedSearchData.countries.forEach(country => {
    if (country.name.toLowerCase().includes(query)) {
      country.cities.forEach(city => {
        results.push({
          name: city.name,
          description: city.description,
          imageUrl: city.imageUrl
        });
      });
    } else {
      country.cities.forEach(city => {
        if (city.name.toLowerCase().includes(query)) {
          results.push({
            name: city.name,
            description: city.description,
            imageUrl: city.imageUrl
          });
        }
      });
    }
  });

  return results;
}

function searchBeachesAndTemplesInCountry(query) {
  let results = [];

  loadedSearchData.beaches.forEach(beach => {
    if (beach.name.toLowerCase().includes(query)) {
      results.push(beach);
    }
  });

  loadedSearchData.temples.forEach(temple => {
    if (temple.name.toLowerCase().includes(query)) {
      results.push(temple);
    }
  });

  return results;
}

function handleResultVisibility(results) {
  resultDiv.style.visibility = 'visible';

  if (results.length > 0) {
    displaySearchResults(results);
    noResult.style.visibility = 'hidden';
    invalidKeyWord.style.visibility = 'hidden';
  } else {
    noResult.style.visibility = 'visible';
    invalidKeyWord.style.visibility = 'hidden';
    resultDiv.innerHTML = '';
  }
}

function displaySearchResults(results) {
  resultDiv.innerHTML = '';

  results.forEach(item => {
    const searchItem = createItem(item);
    resultDiv.appendChild(searchItem);
  });
}

function createItem(item) {
  const resultItem = document.createElement('div');
  resultItem.classList.add('result-item');

  resultItem.innerHTML = `
    <span class="result-image"><img src="${item.imageUrl}" alt="${item.name}" /></span>
    <div class="res-txt">
      <h3>${item.name}</h3>
      <p>${item.description}</p>
    </div>
  `;

  return resultItem;
}
