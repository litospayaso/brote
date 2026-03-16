import type { Result } from 'axe-core';
import { loadScript } from './functions';
import type { AxePlugin, AxeResults } from 'axe-core';
// import removed
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable @typescript-eslint/no-empty-function */
type CreateComponentType = (component: ComponentData) => Promise<ComponentObject>;

/**
 * Object to create component function for test a web-component
 *
 * @interface ComponentData
 * @member {Class} class Class of the webcomponent to test, if will create a random uuid for the webcomponent name, if is empty it will use the name property
 * @member {String} name Name of the webcomponent to create.
 * @member {any} properties Object using the key as property name and value as the value of the property
 * @member {any} listeners Object using the key as listener name and value as the callback function that will be call on listener
 * @member {String} route route to mock the location.href of the page for the web-component
 * @member {any} mock Object using the key as class properties to override and value as the value of the override
 * @member {any} api Object using the key as API calls to override and value as the mock api function to override
 * @member {HTMLElement[]} slot Arrays of elements to append inside of the webcomponent as slot
 */
export interface ComponentData {
  class?: any;
  name: string;
  properties?: {
    [key: string]: string;
  };
  listeners?: {
    [key: string]: (...args: any) => unknown;
  };
  slot?: HTMLElement[] | string;
  api?: { [key: string]: any };
  mock?: { [key: string]: any };
  route?: string;
}

export interface ComponentObject {
  element: HTMLElement;
  shadow: ShadowRoot;
  state: (state: string) => any;
  uid: string;
}

const generateNewId = (): string => {
  return String(crypto.randomUUID()).replace(/[0-9]/gi, c => {
    return ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'][(c as unknown) as number];
  });
};

/**
 * Function to mock a route in storybook or web-test-runner
 * @param {string} route Last part of the URL to mock in location.href
 */
export const mockQueryParams = (element: any, queryParams: { [key: string]: string }): void => {
  element.getQueryParamsURL = () => {
    let url = 'http://example-url.com?'
    Object.entries(queryParams).forEach(([key, value]) => {
      url = url.concat(`${key}=${value}&`)
    });
    const href = new URL(url.slice(0, -1));
    return href.searchParams;
  };
};

/**
 * Function to trigger a event from html element.
 * @param {HTMLElement} elem element to dispatch the event
 * @param {string} name event name
 * @param {value} value data to dispatch in the event
 */
export const dispatchFromElement = (elem: HTMLElement, name: string, value: any): void => {
  elem.dispatchEvent(new CustomEvent(name, { detail: { value } }));
};

/**
 * Function to defer the next code block from executing in the test plan
 * @param callback Function to call after the defer
 */
export const defer = (callback: Function): void => {
  setTimeout(() => callback(), navigator.userAgent.includes('AppleWebKit') ? 600 : 350);
};

export const waitForElement = (selector: () => HTMLElement | null, timeout: number = 3000) => {
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      if (selector()) {
        clearInterval(interval);
        resolve(selector());
      }
    }, 100);
    setTimeout(() => {
      clearInterval(interval);
      reject(new Error('Element not found'));
    }, timeout);
  });
}
/**
 * Function to create a web-component in the browser to test the behaviour
 * @param {CreateComponentType} component component to test
 * @param {Class} component.class Class of the webcomponent to test, if will create a random uuid for the webcomponent name, if is empty it will use the name property
 * @param {String} component.name Name of the webcomponent to create.
 * @param {any} component.properties Object using the key as property name and value as the value of the property
 * @param {any} component.listeners Object using the key as listener name and value as the callback function that will be call on listener
 * @param {String} component.route route to mock the location.href of the page for the web-component
 * @param {any} component.api Object using the key as API calls to override and value as the mock api function to override
 * @param {HTMLElement[] | string} component.slot Arrays of elements to append inside of the webcomponent as slot
 * @returns {ComponentObject} An object as Element as HTMLElement, shadow as shadow root and uid as uuid of the new component
 */
export const createComponent: CreateComponentType = async component => {
  const uid = generateNewId();
  if (component.api) {
    if (!component.class.prototype.api) {
      component.class.prototype.api = {};
    }
    Object.keys(component.api).forEach(key => {
      component.class.prototype.api[key] = (component.api as any)[key];
    });
  }
  if (component.route) {
    component.class.prototype['getHref'] = (): string => `localhost:8000${component.route}`;
  }
  if (component.mock) {
    Object.keys(component.mock).forEach(key => {
      component.class.prototype[key] = (component.mock as any)[key];
    });
  }
  if (component.class) {
    component.class.prototype.testingUid = uid;
    window.customElements.define(uid, class NewElem extends component.class { });
  }
  const element = document.createElement(component.class ? uid : component.name);
  if (component.properties) {
    Object.keys(component.properties).forEach(property => {
      element.setAttribute(property, component.properties ? component.properties[property] : '');
    });
  }
  if (component.listeners) {
    Object.keys(component.listeners).forEach(listener => {
      element.addEventListener(
        listener,
        component.listeners ? component.listeners[listener] : (): void => { }
      );
    });
  }
  if (component.slot) {
    if (Array.isArray(component.slot)) {
      component.slot.forEach(slot => {
        element.append(slot);
      });
    } else {
      element.append(component.slot);
    }
  }

  await document.body.append(element);
  const elem = document.querySelector(component.class ? uid : component.name) as HTMLElement;
  return {
    element: elem,
    shadow: elem?.shadowRoot as ShadowRoot,
    uid,
    state: (state: string): any => ((elem as unknown) as any)[`__${state}`],
  };
};

/**
 * Function to check accesibility testing on a htmlElement. It is asynchronous so remember to wait for the result of the promise in your test.
 * @param {HTMLElement} element on which execute accessibility testing. If empty will execute the accessibility testing on html tag.
 * @returns true if there is no accessibility issues, other case will throw an error and console log every accessibility issue.
 */
export const accessibilityCheck = async (element?: HTMLElement): Promise<Result[]> => {
  return new Promise(resolve => {
    loadScript('node_modules/axe-core/axe.min.js', () => {
      setTimeout(() => {
        ((window as any).axe as AxePlugin).run(
          element ? element : (document.querySelector('body') as HTMLElement),
          {
            runOnly: ['cat.forms', 'wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'],
          },
          (_errors: any, results: AxeResults) => {
            if (results.violations.length > 0) {
              results.violations.forEach(violation => {
                console.error('\n<-----------  [ACCESSIBILITY ERROR]  ----------->');
                console.error('ERROR --->', violation.description);
                console.error('PATH  --->', violation.nodes[0].html);
                console.error('<----------------------------------------------->\n');
              });
              // console.table(results.violations);
            }
            resolve(results.violations ? results.violations : []);
          }
        );
      }, 1000);
    });
  });
};

/**
 * Function to override http page API request object in an http page HTML element.
 * @param {HTMLElement} element http request page html element.
 * @param {[key: string]: Function} api api functions to override.
 */
export const overrideApi = (element: HTMLElement, api: { [key: string]: any }) => {
  (element as any)['api'] = api;
  (element as any)['navigate'] = (route: string) => {
    // @ts-ignore
    element['infoNotification'](`[DEV] Redirect to: ${route}`);
  };
};
