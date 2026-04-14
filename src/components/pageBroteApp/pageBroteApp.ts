import { html, css } from 'lit';
import Page from '../../shared/page';
import { state } from 'lit/decorators.js';
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { StatusBar } from '@capacitor/status-bar';
import { loadCss, variableStyles } from '../../shared/functions';
import type { UserProfile } from '../../shared/db';
import type { GroupButtonOption } from '../componentGroupButton/componentGroupButton';
import packageJson from '../../../package.json';

export default class PageBroteApp extends Page {
  private _notificationTimeout: any = null;

  static styles = [
    Page.styles,
    css`
      :host {
        display: block;
      }
      .group-button-container {
        position: fixed;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        z-index: 1000;
        padding: 0 0 2rem 0;
        display: flex;
        justify-content: center;
        width: fit-content;
      }
      .app-container {
        display: grid;
        grid-template-columns: 100%;
        grid-template-rows: 100%;
        padding-top: env(safe-area-inset-top);
        padding-bottom: 80px; 
        touch-action: pan-y;
        overflow-x: hidden;
      }
      .page-container {
        background-color: var(--background-color);
        padding: 0 12px;
      }
      .page-wrapper {
        grid-area: 1 / 1 / 2 / 2;
        width: 100%;
        margin-bottom: 24px;
        background-color: var(--background-color, #fff); /* Fallback to prevent transparency issues */
      }
      .page-enter-forward {
        animation: slideInRight 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
      }
      .page-leave-forward {
        animation: slideOutLeft 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
      }
      .page-enter-backward {
        animation: slideInLeft 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
      }
      .page-leave-backward {
        animation: slideOutRight 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
      }
      @keyframes slideInRight {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
      }
      @keyframes slideOutLeft {
        from { transform: translateX(0); }
        to { transform: translateX(-100%); }
      }
      @keyframes slideInLeft {
        from { transform: translateX(-100%); }
        to { transform: translateX(0); }
      }
      @keyframes slideOutRight {
        from { transform: translateX(0); }
        to { transform: translateX(100%); }
      }
    `
  ];

  @state() page: string = 'home';
  @state() previousPage: string | null = null;
  @state() transitionDirection: 'forward' | 'backward' | null = null;
  private _transitionTimeout: any = null;

  @state() groupButtonOptions: GroupButtonOption[] = [
    { text: 'home', id: 'home', active: true, emoji: true, forcedsvg: true },
    { text: 'search', id: 'search', active: false, emoji: true, forcedsvg: true },
    { text: 'user', id: 'user', active: false, emoji: true, forcedsvg: true },
  ];

  createRenderRoot() {
    return this;
  }



  private _getTabIndex(page: string): number {
    const tabs = ['home', 'search', 'user'];
    return tabs.indexOf(page);
  }

  private _animateIfNeeded(newPage: string) {
    const oldIndex = this._getTabIndex(this.page);
    const newIndex = this._getTabIndex(newPage);

    if (this.page !== newPage && oldIndex !== -1 && newIndex !== -1) {
      this.transitionDirection = newIndex > oldIndex ? 'forward' : 'backward';
      this.previousPage = this.page;
      if (this._transitionTimeout) clearTimeout(this._transitionTimeout);
      this._transitionTimeout = setTimeout(() => {
        this.previousPage = null;
        this.transitionDirection = null;
        this.requestUpdate();
      }, 300);
    }
  }

  navigateToPage(params: { [key: string]: string }, maintainParams: boolean = true): void {
    delete (params.isTrusted);
    const currentParams = Object.fromEntries(this.getQueryParamsURL());
    maintainParams = params.maintainParams === 'false' ? false : maintainParams;
    const oldPage = this.page;
    const newPage = params.page || 'home';

    this._animateIfNeeded(newPage);

    if (params.page) {
      this.page = newPage;
    }
    if (maintainParams) {
      params = { ...currentParams, ...params };
    }
    delete params.maintainParams;

    const isTab = ['home', 'search', 'user'].includes(newPage);
    const wasTab = ['home', 'search', 'user'].includes(oldPage);
    let usePushState = (!isTab && wasTab) || (!isTab && !wasTab && oldPage !== newPage);

    if (params.replaceState === 'true') {
      usePushState = false;
      delete params.replaceState;
    }

    this.setQueryParamsURL(params, usePushState);
    this.updateGroupButtonOptions();
    this.requestUpdate();
  }

  onPageInit(): void {
    const style = document.createElement('style');
    style.textContent = variableStyles.cssText;
    this.applyTheme();
    document.head.appendChild(style);

    this._setupStatusBar();
    this._setupNotifications();

    PageBroteApp.styles.forEach((style, i) => {
      loadCss(String(style), `page-brote-styles-${i}`);
    });

    window.addEventListener('theme-changed', () => {
      // Removed _updateStatusBarColor call as per instruction
    });

    window.addEventListener('notification-settings-changed', () => {
      this._setupNotifications();
    });

    LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
      console.log('Notification action performed', notification);
      this.navigateToPage({ page: 'home', openStatus: 'true' }, false);
    });

    window.addEventListener('popstate', () => {
      const params = this.getQueryParamsURL();
      const newPage = params.get('page') || 'home';
      this._animateIfNeeded(newPage);
      this.page = newPage;
      this.updateGroupButtonOptions();
      this.requestUpdate();
    });
  }

  private async _setupStatusBar() {
    try {
      if (Capacitor.isNativePlatform()) {
        console.log('forcing status bar opacity...');
        await new Promise(resolve => setTimeout(resolve, 500));
        await StatusBar.setOverlaysWebView({ overlay: false });

        await StatusBar.setBackgroundColor({ color: localStorage.getItem('theme') === 'dark' ? '#212429' : '#ebebeb' });
      }
    } catch (e) {
      console.error('Error configuring StatusBar', e);
    }
  }


  private async _setupNotifications() {
    try {
      if (Capacitor.isNativePlatform()) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      if (this._notificationTimeout) {
        clearTimeout(this._notificationTimeout);
        this._notificationTimeout = null;
      }

      const savedProfile = localStorage.getItem('user_profile');
      if (!savedProfile) return;

      const profile: UserProfile = JSON.parse(savedProfile);
      const notificationsEnabled = !!profile.notificationsEnabled;
      const notificationTime = profile.notificationTime || '20:00';

      const platform = Capacitor.getPlatform();

      const permission = await LocalNotifications.requestPermissions();
      if (permission.display !== 'granted' && notificationsEnabled) {
        return;
      }

      await LocalNotifications.cancel({ notifications: [{ id: 1 }] });

      if (notificationsEnabled) {
        const [hour, minute] = notificationTime.split(':').map(Number);

        if (platform === 'web') {
          const now = new Date();
          const scheduledTime = new Date();
          scheduledTime.setHours(hour, minute, 0, 0);

          if (scheduledTime <= now) {
            scheduledTime.setDate(scheduledTime.getDate() + 1);
          }

          const delay = scheduledTime.getTime() - now.getTime();
          this._notificationTimeout = setTimeout(() => this._triggerBrowserNotification(), delay);
        } else {
          await LocalNotifications.schedule({
            notifications: [
              {
                title: this.translations.dailyStatusReminder || 'Daily Status Reminder',
                body: this.translations.fillYourStatusMsg || 'Remember to fill your daily status!',
                id: 1,
                schedule: {
                  on: { hour, minute },
                  repeats: true,
                  allowWhileIdle: true
                }
              }
            ]
          });
        }
      }
    } catch (e) {
      console.error('LocalNotifications error in PageBroteApp', e);
    }
  }

  private async _triggerBrowserNotification() {
    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: this.translations.dailyStatusReminder || 'Daily Status Reminder',
            body: this.translations.fillYourStatusMsg || 'Remember to fill your daily status!',
            id: 1
          }
        ]
      });
      this._setupNotifications();
    } catch (e) {
      console.error('Error triggering browser notification', e);
    }
  }

  pageRender() {
    return html`
      ${this.previousPage ? html`
        <div class="page-wrapper page-leave-${this.transitionDirection}">
          ${this._renderPageContent(this.previousPage)}
        </div>
      ` : ''}
      <div class="page-wrapper ${this.previousPage ? `page-enter-${this.transitionDirection}` : ''}">
        ${this._renderPageContent(this.page)}
      </div>
    `;
  }

  private _renderPageContent(pageName: string) {
    switch (pageName) {
      case 'search':
        return html`<page-search 
          @page-navigation="${({ detail }: CustomEvent<{ [key: string]: string }>) => this.navigateToPage(detail)}"
          class="page-container"
        ></page-search>`;
      case 'home':
        return html`<page-home
          @page-navigation="${({ detail }: CustomEvent<{ [key: string]: string }>) => this.navigateToPage(detail)}"
          class="page-container"
        ></page-home>`;
      case 'food':
        return html`<page-food 
          @page-navigation="${({ detail }: CustomEvent<{ [key: string]: string }>) => this.navigateToPage(detail)}"
          class="page-container"
        ></page-food>`;
      case 'user':
        return html`<page-user 
          .version="${packageJson.version}"
          @page-navigation="${({ detail }: CustomEvent<{ [key: string]: string }>) => this.navigateToPage(detail)}"
          class="page-container"
        ></page-user>`;
      case 'scanner':
        return html`<page-code-scanner 
          @page-navigation="${({ detail }: CustomEvent<{ [key: string]: string }>) => this.navigateToPage(detail)}"
          class="page-container"
        ></page-code-scanner>`;
      case 'meal':
        return html`<page-meal 
          @page-navigation="${({ detail }: CustomEvent<{ [key: string]: string }>) => this.navigateToPage(detail)}"
          class="page-container"
        ></page-meal>`;
      default:
        return html`<page-home></page-home>`;
    }
  }

  handleGroupButtonClick(event: CustomEvent) {
    this.updateGroupButtonOptions();
    this.navigateToPage({ page: event.detail.id }, false);
    this.requestUpdate();
  }

  updateGroupButtonOptions() {
    this.groupButtonOptions = this.groupButtonOptions.map(option => {
      option.active = option.id === this.page;
      return option;
    });
  }

  render() {
    return html`
    <div class="app-container">
      ${this.pageRender()}
    </div>
    <div class="group-button-container">
      <component-group-button 
        .options="${this.groupButtonOptions}" 
        size="l"
        @group-button-click="${this.handleGroupButtonClick}">
      </component-group-button>
    </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'brote-app': PageBroteApp;
  }
}
