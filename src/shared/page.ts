import { type CSSResultGroup, css, LitElement } from 'lit';
import { translations } from './translations';
import { dbService, DBService } from './db';
import { variableStyles } from './functions';

export default class Page<api = {}> extends LitElement {
  /**
   * It will be overrided with api decorator.
   */
  api!: api;

  translations: { [key: string]: string } = translations.en;

  protected db: DBService = dbService;

  constructor() {
    super();
    this.translations = translations[this.getLanguage() as keyof typeof translations] || translations.en;
  }

  static styles = [
    variableStyles,
    css`
    .card {
      background: var(--card-background);
      color: var(--card-text);
      border: 1px solid var(--card-border);
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 1rem;
    }
    h2 {
      margin-top: 0;
      border-bottom: 2px solid var(--palette-green, #4fb9ad);
      padding-bottom: 0.5rem;
      margin-bottom: 1rem;
    }
    h1 {
      border-bottom: 2px solid var(--palette-green, #4fb9ad);
      padding-bottom: 0.5rem;
      margin-bottom: 1rem;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: bold;
    }
    input, select, textarea {
      width: 100%;
      padding: 0.5rem;
      background-color: var(--input-background);
      color: var(--input-text);
      border: 1px solid var(--input-border, #a19fa2);
      border-radius: 4px;
      font-size: 1rem;
      box-sizing: border-box;
    }
    option {
      background-color: var(--card-background);
      color: var(--card-text);
    }
    input[type="checkbox"] {
      appearance: none;
      -webkit-appearance: none;
      width: 20px;
      height: 20px;
      border: 1px solid var(--input-border, #a19fa2);
      border-radius: 4px;
      margin-right: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      position: relative;
      background-color: var(--input-background, transparent);
      transition: all 0.2s ease;
      flex-shrink: 0;
    }
    input[type="checkbox"]:checked {
      background-color: var(--group-button-active-bg, #4fb9ad);
      border-color: var(--group-button-active-bg, #4fb9ad);
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'%3E%3C/polyline%3E%3C/svg%3E");
      background-size: 14px;
      background-repeat: no-repeat;
      background-position: center;
    }
    label.checkbox-label {
      display: flex;
      align-items: center;
      cursor: pointer;
      font-weight: normal;
      margin-bottom: 0.8rem;
    }
    input[type="radio"] {
      appearance: none;
      -webkit-appearance: none;
      width: 20px;
      height: 20px;
      border: 1px solid var(--input-border, #a19fa2);
      border-radius: 50%;
      margin-right: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      position: relative;
      background-color: var(--input-background, transparent);
      transition: all 0.2s ease;
      flex-shrink: 0;
    }
    input[type="radio"]:checked {
      border-color: var(--group-button-active-bg, #4fb9ad);
    }
    input[type="radio"]:checked::after {
      content: '';
      width: 10px;
      height: 10px;
      background-color: var(--group-button-active-bg, #4fb9ad);
      border-radius: 50%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    label.radio-label {
      display: flex;
      align-items: center;
      cursor: pointer;
      font-weight: normal;
      margin-bottom: 0.8rem;
    }
    .theme-toggles {
      display: flex;
      gap: 1rem;
    }
    button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      background: var(--palette-green, #a19fa2);
      color: white;
      transition: background 0.3s;
    }
    button.active {
      background: var(--palette-purple, #a285bb);
    }
    button:hover {
      opacity: 0.9;
    }
    .btn {
      width: 100%;
      padding: 12px;
      border: none;
      background-color: var(--group-button-active-bg, var(--palette-green));
      color: var(--group-button-active-text, #fff);
      border-radius: 20px;
      font-weight: bold;
      cursor: pointer;
      font-size: 1rem;
    }
    .btn-danger {
      background-color: var(--palette-red, #f44336);
      color: white;
      width: 100%;
      padding: 12px;
      border: none;
      border-radius: 20px;
      font-weight: bold;
      cursor: pointer;
      font-size: 1rem;
    }
    .btn:hover {
      opacity: 0.9;
    }
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
      backdrop-filter: blur(2px);
    }
    .modal {
      background: var(--card-background);
      color: var(--card-text);
      padding: 24px;
      border-radius: 12px;
      max-width: 90%;
      width: 400px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      text-align: center;
      border: 1px solid var(--card-border);
      position: relative;
      max-height: 90vh;
      overflow-y: auto;
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .modal-header h3 {
      margin: 0;
      font-size: 1.5rem;
      color: var(--palette-green);
    }
    :host-context([data-theme="dark"]) .modal-header h3 {
      color: var(--palette-purple);
    }
    .close-btn {
      background: none;
      border: none;
      font-size: 28px;
      cursor: pointer;
      color: var(--card-text);
      padding: 0;
      line-height: 1;
      width: auto;
      opacity: 0.7;
      transition: opacity 0.2s;
    }
    .close-btn:hover {
      opacity: 1;
    }
    .modal-buttons {
      display: flex;
      gap: 12px;
      margin-top: 24px;
      justify-content: center;
    }
    .modal-buttons .btn, .modal-buttons .btn-danger {
      flex: 1;
      max-width: 150px;
    }
    ` as CSSResultGroup];

  /**
   * Function to navigate to another url.
   * If the string starts with / will concat string to the current url.
   * If it starts with http the whole location will be replaced.
   * Other case it will use the same origin to concat the url.
   * @param {string} url location to navigate
   */
  navigate(url: string): void {
    if (url.startsWith('/')) {
      window.location.href = window.location.href.concat(url);
    } else if (url.startsWith('http')) {
      window.location.href = url;
    } else {
      window.location.href = `${window.location.origin}/${url}`;
    }
  }

  /**
   * Function to get language from local storage.
   * @returns language
   */
  getLanguage(): string {
    const language = localStorage.getItem('language');
    if (language) {
      return language;
    } else {
      localStorage.setItem('language', 'en');
      return 'en';
    }
  }

  /**
   * Function to set language in local storage.
   * @param {string} language language to set
   */
  setLanguage(language: string): void {
    localStorage.setItem('language', language);
    this.translations = translations[language as keyof typeof translations] || translations.en;
    this.requestUpdate();
  }

  /**
   * Function to set theme in local storage.
   * @param {string} theme theme to set
   */
  setTheme(theme: 'light' | 'dark'): void {
    localStorage.setItem('theme', theme);
    this.applyTheme();
  }

  /**
   * Function to apply theme.
   */
  applyTheme() {
    const theme = localStorage.getItem('theme') || 'light';
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.style.background = '#191c25';
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.style.background = 'white';
    }
  }

  /**
   * Function to open a url in a new tab.
   * @param {string} url to open in a new tab
   */
  openNewTab(url: string): void {
    window.open(url, '_blank');
  }

  /**
   * Function to get current url where the webcomponent is located
   * @returns window.location.href
   */
  getHref(): string {
    return window.location.href;
  }

  /**
   * Function to get hostname of current url
   * @returns window.location.hostname
   */
  getHostname(): string {
    return window.location.hostname;
  }

  /**
   * Function to get queryparams from current url
   * @returns url.searchParams: URLSearchParams
   */
  getQueryParamsURL(): URLSearchParams {
    const url: URL = new URL(this.getHref());
    return url.searchParams;
  }

  /**
   * Function to set queryparams in current url
   * @param queryParams object with key value pairs
   */
  setQueryParamsURL(queryParams: { [key: string]: string }): void {
    const queryParamsString = Object.entries(queryParams)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    window.history.replaceState(null, null as unknown as string, `?${queryParamsString}`);
  }

  triggerPageNavigation(queryParams: { [key: string]: string }) {
    this.dispatchEvent(new CustomEvent('page-navigation', {
      detail: { ...queryParams },
      bubbles: true,
      composed: true
    }));
  }

  connectedCallback() {
    super.connectedCallback();
    this.onPageInit();
  }

  /**
   * It will be called after the Page component is loaded.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onPageInit(): void { }
}

