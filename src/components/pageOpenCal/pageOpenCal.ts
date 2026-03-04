import { html, css } from 'lit';
import Page from '../../shared/page';
import { state } from 'lit/decorators.js';
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { loadCss, variableStyles } from '../../shared/functions';
import type { UserProfile } from '../../shared/db';
import type { GroupButtonOption } from '../componentGroupButton/componentGroupButton';

export default class PageOpenCal extends Page {
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
        padding: 0 0 1rem 0;
        display: flex;
        justify-content: center;
        width: fit-content;
      }
      .app-container {
       padding-bottom: 60px; 
      }
    `
  ];

  @state() page: string = 'home';
  @state() groupButtonOptions: GroupButtonOption[] = [
    { text: '🏠', id: 'home', active: true },
    { text: '🔍', id: 'search', active: false },
    { text: '👤', id: 'user', active: false },
  ];

  createRenderRoot() {
    return this;
  }



  navigateToPage(params: { [key: string]: string }, maintainParams: boolean = true): void {
    delete (params.isTrusted);
    const currentParams = Object.fromEntries(this.getQueryParamsURL());
    maintainParams = params.maintainParams === 'false' ? false : maintainParams;
    if (params.page) {
      this.page = params.page || 'home';
    }
    if (maintainParams) {
      params = { ...currentParams, ...params };
    }
    delete params.maintainParams;
    this.setQueryParamsURL(params);
    this.requestUpdate();
  }

  onPageInit(): void {
    const style = document.createElement('style');
    style.textContent = variableStyles.cssText;
    this.applyTheme();
    document.head.appendChild(style);

    PageOpenCal.styles.forEach((style, i) => {
      loadCss(String(style), `page-open-cal-styles-${i}`);
    });

    this._setupNotifications();

    window.addEventListener('notification-settings-changed', () => {
      this._setupNotifications();
    });

    LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
      console.log('Notification action performed', notification);
      this.navigateToPage({ page: 'home', openStatus: 'true' }, false);
    });
  }

  private async _setupNotifications() {
    try {
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
      console.error('LocalNotifications error in PageOpenCal', e);
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
    const params = this.getQueryParamsURL();
    this.page = params.get('page') || 'home';
    this.updateGroupButtonOptions();

    switch (this.page) {
      case 'search':
        return html`<page-search 
          @page-navigation="${({ detail }: CustomEvent<{ [key: string]: string }>) => this.navigateToPage(detail)}"
        ></page-search>`;
      case 'home':
        return html`<page-home
          @page-navigation="${({ detail }: CustomEvent<{ [key: string]: string }>) => this.navigateToPage(detail)}"
        ></page-home>`;
      case 'food':
        return html`<page-food 
          @page-navigation="${({ detail }: CustomEvent<{ [key: string]: string }>) => this.navigateToPage(detail)}"
        ></page-food>`;
      case 'user':
        return html`<page-user></page-user>`;
      case 'scanner':
        return html`<page-code-scanner 
          @page-navigation="${({ detail }: CustomEvent<{ [key: string]: string }>) => this.navigateToPage(detail)}"
        ></page-code-scanner>`;
      case 'meal':
        return html`<page-meal 
          @page-navigation="${({ detail }: CustomEvent<{ [key: string]: string }>) => this.navigateToPage(detail)}"
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
        @group-button-click="${this.handleGroupButtonClick}">
      </component-group-button>
    </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'page-opencal': PageOpenCal;
  }
}
