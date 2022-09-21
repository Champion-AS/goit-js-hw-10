export const BASE_URL = 'https://restcountries.com/v3.1/name';

export const fetchCountries = url => {
return fetch(`${BASE_URL}/${url}?fields=languages,name,capital,population,flags`).then(response => {
      if (!response.ok) {
        throw new Error();
      }
      return response.json();
    })
}