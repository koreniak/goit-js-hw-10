export function fetchCounties(name) {
    return fetch(`https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`).then(
        resp => {
            if (!resp.ok) {
                throw new Error(resp.ok);
            }
                return resp.json();
        }
    );
}