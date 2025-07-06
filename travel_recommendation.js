let loadedSearchData = {};

const resultDiv = document.getElementById('search-results');
const noResult = document.getElementById('no-result');
const invalidKeyWord = document.getElementById('invalid-result');

// fetch JSON data
fetch('./travel_recommendation_api.json')
.then(response => response.json())
.then(data => {
    loadedData = data;
})
.catch(error => console.error('Error loading data: ', error));

// initialize event listeners
initializeEventListeners();

function initializeEventListeners(){
    document.getElementById('searchButton').addEventListener('click', doSearch);

    // event listeners for Enter key
    document.getElementById('searchBarInput').addEventListener('keydown', function(event){
        if (event.key === 'Enter'){
            doSearch();
        }
    });

    document.getElementById('clearButton').addEventListener('click', clearSearch);
}

// control visibility of elements
function initializeVisibility(){
    resultDiv.style.visibility = "hidden";
    noResult.style.visibility = "hidden";
    invalidKeyWord.style.visibility = "hidden";
}

function doSearch(){
    // pull query from user input
    const search = getQuery();

    // handle case where query is empty
    if (search === ''){
        showEmptyQuery();
        return;
    }
}

// clears search and hides no result messages
function clearSearch(){
    document.getElementById('searchBarInput').value = '';
    resultDiv.style.visibility = "hidden";
    noResult.style.visibility = "hidden";
    invalidKeyWord.style.visibility = "hidden";
    resultDiv.innerHTML = '';
}

function showEmptyQuery(){
    resultDiv.style.visibility = "visible";
    noResult.style.visibility = "hidden";
    invalidKeyWord.style.visibility = "visible";
    resultDiv.innerHTML = '';
}

// convert upper case entries to lower case 
function getQuery(){
    return document.getElementById('searchBarInput').value.trim().toLowerCase();
}

function searchResults(query){
    let results = [];

    // check for beach or temple to return all corresponding results
    if (query.includes('beach')){
        results = results.concat(loadedSearchData.beaches);
    }

    if (query.includes('temple')){
        results = results.concat(loadedSearchData.temples);
    }

    // use countr to return cities
    if (query.includes('countr')){
        results = results.concat(searchAllCities());
    }else{
        // if not country, search specific cities and countries
        results = results.concat(searchCitiesAndCountries(query));
        // if not, look for beaches and temples within that country
        results = results.concat(searchBeachesAndTemplesInCountry(query));
    }

    return results;
}

function searchAllCities(){
    let allCityList = [];

    // for every result returned in search data, add city to list and return modified list
    loadedSearchData.countries.forEach(country => {
        country.cities.forEach(city => {
            allCityList.push({
                name: `${city.name}`,
                description: city.description,
                imageUrl: city.imageUrl
            });
        });
    });

    return allCityList;
}

function searchCitiesAndCountries(query){
    let results = [];

    loadedSearchData.countries.forEach(country => {
        if (country.name.toLowerCase().includes(query)){
            // if country matches, include cities
            country.cities.forEach(city => {
                results.push({
                    name: `${city.name}`,
                    description: city.description,
                    imageUrl: city.imageUrl
                });
            });
        } else{
            // check for city match inside country
            country.cities.forEach(city => {
                if (city.name.toLowerCase().includes(query)){
                    results.push({
                        name: `${city.name}`,
                        description: city.description,
                        imageUrl: city.imageUrl
                    });
                }
            });
        }
    });

    return results;
}

function searchBeachesAndTemplesInCountry(query){
    let results = [];

    // check for country in beaches
    loadedSearchData.beaches.forEach(beach => {
        if (beach.name.toLowerCase().includes(query)){
            results.push(beach);
        }
    });

    // check for country in temples
    loadedSearchData.temples.forEach(temple => {
        if (temple.name.toLowerCase().includes(query)){
            results.push(temple);
        }
    });

    return results;
}

function handleResultVisibility(){
    resultDiv.style.visibility = "visible";

    // if we have results
    if (results.length > 0){
        displaySearchResults();
        noResult.style.visibility = "hidden";
    } else{
        noResult.style.visibility = "visible";
        resultDiv.innerHTML = '';
    }
}

function displaySearchResults(queryResults){
    resultDiv.innerHTML = '';

    queryResults.forEach(item => {
        const searchItem = createItem(item);
        resultDiv.appendChild(searchItem);
    });
}

function createItem(item){
    const resultItem = document.createElement('div');
    resultItem.classList.add(item);

    resultItem.innerHTML = `
    <span class="result-image"><img src="${item.imageUrl}" alt="${item.name}" /></span>
    <div class="res-txt"> 
    <h3>${item.name}</h3>
    <p>${item.description}</p>
    </div>
    `;

    return resultItem;
}
