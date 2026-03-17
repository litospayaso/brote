import { html, css } from 'lit';
import { state } from 'lit/decorators.js';
import Page from '../../shared/page';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { Camera } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { loadCss } from '../../shared/functions';

export class PageCodeScanner extends Page {
  @state() hasPermission: boolean | null = null;
  @state() error: string | null = null;
  @state() scanning: boolean = false;

  private html5QrCode: Html5Qrcode | null = null;

  static styles = [
    Page.styles,
    css`
      :host {
        display: block;
        height: 100%;
        width: 100%;
        min-height: 100vh;
        min-width: 100vw;
        background: black;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;
        z-index: 9999;
      }

      #reader {
        width: 100% !important;
        height: 100% !important;
        background: black;
        position: absolute;
        top: 0;
        left: 0;
      }

      #reader video {
        object-fit: cover !important;
        width: 100% !important;
        height: 100% !important;
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
      }

      #reader img {
        display: none !important;
      }

      .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        pointer-events: none;
        z-index: 10;
      }

      .controls {
        position: fixed;
        bottom: 25px;
        left: 0;
        width: 100%;
        display: flex;
        justify-content: center;
        pointer-events: auto;
        z-index: 20;
      }

      .back-btn {
        border: none;
        background-color: var(--group-button-active-bg, var(--palette-green));
        color: var(--group-button-active-text, #fff);
        padding: 10px 20px;
        border-radius: 20px;
        font-weight: bold;
        cursor: pointer;
      }

      .error-msg {
        color: white;
        background: rgba(255, 0, 0, 0.8);
        padding: 10px;
        border-radius: 5px;
        margin-bottom: 20px;
        text-align: center;
        pointer-events: auto;
      }

      .permission-request {
        color: white;
        text-align: center;
        padding: 20px;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background: black;
        z-index: 30;
      }
    `
  ];

  async firstUpdated() {
    PageCodeScanner.styles.forEach((style, i) => {
      loadCss(String(style), `page-code-scanner-styles-${i}`);
    });
    setTimeout(() => this.startScanning(), 100);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.stopScanning();
  }

  private async checkCameraPermission(): Promise<boolean> {
    if (Capacitor.isNativePlatform()) {
      let permission = await Camera.checkPermissions();
      
      if (permission.camera !== 'granted') {
        permission = await Camera.requestPermissions();
      }
      
      return permission.camera === 'granted';
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        stream.getTracks().forEach(track => track.stop());
        return true;
      } catch (err) {
        console.error("Web camera permission error:", err);
        return false;
      }
    }
  }

  async startScanning() {
    this.error = null;
    try {
      const hasPermission = await this.checkCameraPermission();
      
      if (!hasPermission) {
        this.hasPermission = false;
        this.error = this.translations.cameraError || "Camera access denied or error starting scanner. Please check permissions.";
        return;
      }

      this.html5QrCode = new Html5Qrcode("reader");

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        formatsToSupport: [
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.EAN_8,
          Html5QrcodeSupportedFormats.UPC_A,
          Html5QrcodeSupportedFormats.UPC_E,
          Html5QrcodeSupportedFormats.QR_CODE
        ]
      };

      await this.html5QrCode.start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          console.log(`Scan result: ${decodedText}`);
          this.stopScanning();
          this.triggerPageNavigation({ page: 'food', code: decodedText });
        },
        () => {
        }
      );

      this.hasPermission = true;
      this.scanning = true;

    } catch (err) {
      console.error("Error starting scanner:", err);
      this.hasPermission = false;
      this.error = this.translations.cameraError || "Camera access denied or error starting scanner. Please check permissions.";
    }
  }

  async stopScanning() {
    if (this.html5QrCode && this.html5QrCode.isScanning) {
      try {
        await this.html5QrCode.stop();
        this.html5QrCode.clear();
      } catch (err) {
        console.error("Failed to stop scanner", err);
      }
    }
    this.scanning = false;
  }

  handleBack() {
    this.stopScanning();
    this.triggerPageNavigation({ page: 'search' });
  }

  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <div id="reader"></div>
      
      ${this.hasPermission === false ? html`
        <div class="permission-request">
          <h2>${this.translations.cameraPermissionRequired}</h2>
          <p>${this.error || this.translations.cameraPermissionDesc}</p>
          <button class="back-btn" @click="${() => this.startScanning()}">${this.translations.retry}</button>
          <br><br>
          <button class="back-btn" @click="${this.handleBack}">${this.translations.goBack}</button>
        </div>
      ` : ''}

      <div class="overlay">
        ${this.error && this.hasPermission !== false ? html`<div class="error-msg">${this.error}</div>` : ''}
      </div>

      <div class="controls">
        <button class="back-btn" @click="${this.handleBack}">${this.translations.cancel}</button>
      </div>
    `;
  }
}
