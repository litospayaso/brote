import { type CSSResultGroup, css, LitElement } from 'lit';
import { translations } from './translations';
import { dbService, DBService } from './db';
import { variableStyles } from './functions';
import { Capacitor } from '@capacitor/core';

export default class Page<api = {}> extends LitElement {
  protected get isNative(): boolean {
    return Capacitor.isNativePlatform();
  }
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
    .btn-cancel {
      background-color: var(--input-grey-button, #a19fa2);
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
    .switch {
      position: relative;
      display: inline-block;
      width: 48px;
      height: 24px;
      flex-shrink: 0;
      margin-top: 7px;
    }

    .switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      transition: .4s;
      border-radius: 24px;
    }

    .slider:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: .4s;
      border-radius: 50%;
    }

    input:checked + .slider {
      background-color: var(--group-button-active-bg);
    }

    input:focus + .slider {
      box-shadow: 0 0 1px var(--group-button-active-bg);
    }

    input:checked + .slider:before {
      transform: translateX(24px);
    }
    .warning-message {
      margin-top: 16px;
      padding: 12px;
      background: var(--warning-background, #fff3e0);
      border: 1px solid var(--warning-border, #ffb74d);
      border-radius: 8px;
      font-size: 0.85rem;
      line-height: 1.4;
      color: var(--warning-text, #e65100);
      text-align: justify;
    }
    .warning-icon {
      font-size: 1rem;
      margin-bottom: 4px;
      display: block;
      text-align: center;
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
    window.dispatchEvent(new CustomEvent('theme-changed', { detail: { theme } }));
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
   * @param usePushState if true it will use pushState instead of replaceState
   */
  setQueryParamsURL(queryParams: { [key: string]: string }, usePushState = false): void {
    const queryParamsString = Object.entries(queryParams)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    if (usePushState) {
      window.history.pushState(null, null as unknown as string, `?${queryParamsString}`);
    } else {
      window.history.replaceState(null, null as unknown as string, `?${queryParamsString}`);
    }
  }

  /**
   * Trigger a page navigation event.
   * @param queryParams object with key value pairs
   */
  triggerPageNavigation(queryParams: { [key: string]: string }) {
    this.dispatchEvent(new CustomEvent('page-navigation', {
      detail: { ...queryParams },
      bubbles: true,
      composed: true
    }));
  }

  private _touchStartX: number = 0;
  private _touchStartY: number = 0;

  /**
   * Function to handle touch start event.
   * @param e TouchEvent
   */
  private _handleTouchStart = (e: TouchEvent) => {
    this._touchStartX = e.changedTouches[0].screenX;
    this._touchStartY = e.changedTouches[0].screenY;
  };

  /**
   * Function to handle touch end event.
   * @param e TouchEvent
   */
  private _handleTouchEnd = (e: TouchEvent) => {
    // Check if we are inside a modal
    const path = e.composedPath();
    const isModalOpen = path.some(el => el instanceof HTMLElement && el.classList.contains('modal-overlay'));

    if (isModalOpen) {
      return;
    }

    const touchEndX = e.changedTouches[0].screenX;
    const touchEndY = e.changedTouches[0].screenY;

    const diffX = touchEndX - this._touchStartX;
    const diffY = touchEndY - this._touchStartY;

    // Check if it's primarily a horizontal swipe
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 30) {
      this.handleSwipe(diffX, diffY, e);
    }
  };

  /**
   * Called when a swipe is detected.
   * Can be overridden by subclasses to implement custom swipe logic.
   */
  protected handleSwipe(_diffX: number, _diffY: number, _event: TouchEvent): void {
    // To be overridden
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('touchstart', this._handleTouchStart);
    this.addEventListener('touchend', this._handleTouchEnd);
    this.onPageInit();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('touchstart', this._handleTouchStart);
    this.removeEventListener('touchend', this._handleTouchEnd);
  }

  /**
   * It will be called after the Page component is loaded.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onPageInit(): void { }
}

