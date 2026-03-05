import type { HttpRequestInterface, QueryParams } from './http.interfaces';

const isJsonString = (input: string) => {
  try {
    JSON.parse(input);
  } catch (e) {
    return false;
  }
  return true;
};

const handleResponse = async (response: Response) => {
  return new Promise((resolve, reject) => {
    if (response.ok) {
      response
        .text()
        .then(result => {
          const res = isJsonString(result) ? JSON.parse(result) : result;
          resolve(res);
        })
        .catch(err => {
          resolve(err);
        });
    } else {
      response.text().then(result => {
        reject(isJsonString(result) ? JSON.parse(result) : result);
      });
    }
  });
};

/**
 * Function to make a http request
 * @param {string} url url to fetch the query without the API
 * @param {HttpRequestInterface} http http parameters for the request
 * @returns a HTTP response with the data requested.
 */
export const request = async (url: string, http?: HttpRequestInterface): Promise<any> => {
  const lang = localStorage.getItem('language') || 'en';
  const subdomain = lang === 'en' ? 'world' : lang;
  const domain = `https://${subdomain}.openfoodfacts.org`;
  const method = http?.method ? http.method : 'GET';

  const options = {
    method,
    mode: 'cors',
    headers: {
      'User-Agent': 'Brote - Android/iOS/Web - Version 1.0 - https://github.com/litospayaso/brote'
    },
    cache: 'no-cache',
    credentials: 'omit',
  } as RequestInit;

  if (http?.body) {
    if (http.body instanceof URLSearchParams) {
      options.body = http.body;
    } else {
      options.body = JSON.stringify(http.body);
    }
  }

  const response = await fetch(`${domain}/${url}`, options);
  return handleResponse(response);
};

/**
 * Function to unify query parameters in a URL.
 * @param url url for concat the query parameters
 * @param {QueryParams} queryParams parameters to attach to the request
 * @returns {string} returns the url with the queryParams attached to it.
 */
export const setQueryParams = (url: string, queryParams?: QueryParams): string => {
  const queryString = Object.keys(queryParams || {})
    // @ts-ignore
    .map(
      key =>
        `${key}=${
        // @ts-ignore
        typeof queryParams[key] === 'string' ? queryParams[key] : JSON.stringify(queryParams[key])
        }`
    )
    .join('&');
  return url.concat(`?${queryString}`);
};
