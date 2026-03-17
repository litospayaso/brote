import { html, css } from 'lit';
import { state } from 'lit/decorators.js';
import Page from '../../shared/page';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { Camera } from '@capacitor/camera';
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
        height: 100vh;
        width: 100vw;
        background: black;
        position: relative;
        overflow: hidden;
      }

      #reader {
        width: 100%;
        height: 100%;
        background: black;
      }

      /* Hide html5-qrcode built-in UI elements we don't want */
      #reader video {
        object-fit: cover;
        width: 100% !important;
        height: 100% !important;
      }

      .overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        pointer-events: none;
      }

      .controls {
        position: absolute;
        bottom: 85px;
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

  async startScanning() {
    this.error = null;
    try {
      // Check/request camera permission using Capacitor Camera plugin
      const permission = await Camera.requestPermissions();
      
      if (permission.camera !== 'granted') {
        this.hasPermission = false;
        this.error = this.translations.cameraError || "Camera access denied or error starting scanner. Please check permissions.";
        return;
      }

      this.html5QrCode = new Html5Qrcode("reader");

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: window.innerWidth / window.innerHeight,
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
        <!-- Visual guide only, logic handled by qrbox -->
        ${this.scanning ? html`<div class="scan-area"></div>` : ''}
      </div>

      <div class="controls">
        <button class="back-btn" @click="${this.handleBack}">${this.translations.cancel}</button>
      </div>
    `;
  }
}
