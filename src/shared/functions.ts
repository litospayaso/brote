import { css } from "lit";

/**
 * Function to import a external url script
 * @param {string} url to import
 * @param {function} callback Function to call once the url is imported
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const loadScript = (url: string, callback: any): void => {
  const head = document.getElementsByTagName('head')[0];
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = url;

  // @ts-ignore
  script['onreadystatechange'] = callback;
  script.onload = callback;

  head.appendChild(script);
};

/**
 * Function to import css string into the page
 * @param styleString css string
 * @param id id of the style tag will be created (this prevent to create twice the same stylesheet)
 */
export const loadCss = (styleString: string, id: string): void => {
  if (!document.getElementById(id)) {
    const style = document.createElement('style');
    style.textContent = styleString;
    document.head.append(style);
  }
};

/**
 * Function to register a web-component in the DOM
 * @param {string} tag tag name of the web-component
 * @param {CustomElementConstructor} component class of the web-component
 */
export const register = (tag: string, component: CustomElementConstructor) => {
  if (document.createElement(tag).constructor === HTMLElement) {
    const newComponent: any = component;
    const classVersion = () =>
      class Version extends newComponent {
        constructor() {
          super();
        }
      };
    window.customElements.define(tag, (classVersion() as unknown) as CustomElementConstructor);
  }
};

export const variableStyles = css`
  :root {
    --palette-lightgrey: #cdcdcd;
    --palette-grey: #a19fa2;
    --palette-green: #4fb9ad;
    --palette-purple: #a285bb;
    --palette-blue: #a9afe9;
    --palette-black: #191c25;

    --protein-color: #24d9c4;
    --fat-color: #f484c7eb;
    --carbs-color: #ca96f8eb;
    --calories-color: #707bde;

    --energy-color: #cdcd31;
    --satiety-color: #4fb9ad;
    --sleep-hours-color:#fe9696;

    --counter-border-width: 2px;

    --background-color: #fff;
    --text-color: #191c25;

    --card-background: #fff;
    --card-text: #191c25;
    --card-border: var(--palette-green);

    --input-background: transparent;
    --input-text: #191c25;
    --input-border: #a19fa2;
    --input-grey-button: #a19fa2;
    --input-placeholder: #757575;

    --button-icon-color: #fff;
    --section-background: #f5f5f5;

    --spinner-track-color: rgba(0, 0, 0, 0.1);
    --spinner-active-color: #4fb9ad;

    --group-button-active-bg: var(--palette-green);
    --chart-line-color: var(--palette-green);
    --group-button-active-text: #fff;
    --group-button-hover-bg: rgba(0, 0, 0, 0.05);
  }

  [data-theme="dark"] {
    --background-color: #191c25;
    --text-color: #fff;

    --card-background: #191c25;
    --card-text: #fff;
    --card-border: #a285bb;

    --input-background: rgba(255, 255, 255, 0.1);
    --input-text: #fff;
    --input-border: #a285bb;
    --input-placeholder: #ccc;
    --section-background: rgba(255, 255, 255, 0.05);

    --spinner-track-color: rgba(255, 255, 255, 0.1);
    --spinner-active-color: #a9afe9;

    --group-button-active-bg: var(--palette-purple);
    --chart-line-color: var(--palette-purple);
    --group-button-active-text: #fff;
    --group-button-hover-bg: rgba(255, 255, 255, 0.1);
  }

  body {
    font-family: 'Inter', sans-serif;
    background-color: var(--background-color);
    color: var(--text-color);
  }
    `;
