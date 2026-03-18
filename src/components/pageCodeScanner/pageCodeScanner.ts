import { html, css } from 'lit';
import { state } from 'lit/decorators.js';
import Page from '../../shared/page';
import { Capacitor } from '@capacitor/core';
import { loadCss } from '../../shared/functions';

export class PageCodeScanner extends Page {
  @state() hasPermission: boolean | null = null;
  @state() error: string | null = null;
  @state() scanning: boolean = false;

  private html5QrCode: any = null;

  static styles = [
    Page.styles,
    css`
      :host {
        display: block;
        height: 100vh;
        width: 100vw;
        background: black;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;
        z-index: 9999;
      }

      #scanner-container {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: black;
      }

      #qr-reader {
        width: 100% !important;
        height: 100% !important;
        background: black;
        position: absolute;
        top: 0;
        left: 0;
        border: none !important;
      }

      /* Fix internal html5-qrcode video element */
      #qr-reader video {
        width: 100% !important;
        height: 100% !important;
        object-fit: cover !important;
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
        z-index: 10;
      }

      .scan-area {
        width: 250px;
        height: 250px;
        border: 2px solid rgba(255, 255, 255, 0.5);
        border-radius: 12px;
        box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.4);
        position: relative;
        background: transparent;
      }

      .scan-line {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: var(--palette-green, #4fb9ad);
        box-shadow: 0 0 8px var(--palette-green, #4fb9ad);
        animation: scan 2s linear infinite;
      }

      @keyframes scan {
        0% { top: 0; }
        100% { top: 100%; }
      }

      .controls {
        position: fixed;
        bottom: 40px;
        left: 0;
        width: 100%;
        display: flex;
        justify-content: center;
        pointer-events: auto;
        z-index: 20;
      }

      .back-btn {
        border: none;
        background-color: var(--palette-green, #4fb9ad);
        color: white;
        padding: 12px 24px;
        border-radius: 25px;
        font-weight: bold;
        cursor: pointer;
        font-size: 1rem;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
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
        background: #121212;
        z-index: 30;
      }

      .permission-request h2 {
        color: var(--palette-green, #4fb9ad);
        margin-bottom: 15px;
      }

      .permission-request p {
        margin-bottom: 25px;
        max-width: 80%;
        line-height: 1.5;
        opacity: 0.8;
      }
    `
  ];

  firstUpdated() {
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
      try {
        const { Camera } = await import('@capacitor/camera');
        const permission = await Camera.checkPermissions();
        
        if (permission.camera === 'granted') return true;
        
        const request = await Camera.requestPermissions();
        return request.camera === 'granted';
      } catch (err) {
        console.error("Native permission check error:", err);
        // Fallback: try to let getUserMedia handle it if plugin fails
        return true; 
      }
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
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
    this.hasPermission = null;
    
    try {
      const hasPermission = await this.checkCameraPermission();
      
      if (!hasPermission) {
        this.hasPermission = false;
        this.error = this.translations.cameraError || "Camera access denied. Please check permissions.";
        return;
      }

      this.hasPermission = true;
      await this.setupScanner();
      this.scanning = true;

    } catch (err) {
      console.error("Error starting scanner:", err);
      this.hasPermission = false;
      this.error = this.translations.cameraError || "Error starting scanner.";
    }
  }

  private async setupScanner() {
    console.log('setupScanner - starting');
    const { Html5Qrcode, Html5QrcodeSupportedFormats } = await import("html5-qrcode");
    
    const qrReader = this.querySelector('#qr-reader') as HTMLElement;
    if (qrReader) {
      qrReader.style.display = 'block';
    }
    
    this.html5QrCode = new Html5Qrcode("qr-reader");
    
    const isNative = Capacitor.isNativePlatform();
    const config = {
      fps: isNative ? 15 : 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: isNative ? 1.0 : window.innerWidth / window.innerHeight,
      formatsToSupport: [
        Html5QrcodeSupportedFormats.EAN_13,
        Html5QrcodeSupportedFormats.EAN_8,
        Html5QrcodeSupportedFormats.UPC_A,
        Html5QrcodeSupportedFormats.UPC_E,
        Html5QrcodeSupportedFormats.QR_CODE
      ]
    };

    try {
      await this.html5QrCode.start(
        { facingMode: "environment" },
        config,
        (decodedText: string) => {
          console.log(`Scan result: ${decodedText}`);
          this.stopScanning();
          this.triggerPageNavigation({ page: 'food', code: decodedText });
        },
        () => {} // Ignore scan errors
      );
      
      // Ensure video fills the screen after start
      this.fixVideoStyles();
      console.log('Scanner started successfully');
    } catch (err) {
      console.error("Error starting scanner implementation:", err);
      this.hasPermission = false;
      this.error = String(err);
    }
  }

  private fixVideoStyles() {
    if (!Capacitor.isNativePlatform()) return;
    setTimeout(() => {
      const video = this.querySelector('#qr-reader video') as HTMLVideoElement;
      if (video) {
        video.style.cssText = 'width: 100% !important; height: 100% !important; object-fit: cover !important; position: absolute; top: 0; left: 0;';
        
        // Hide internal dashboard and other elements if present
        const dashboard = this.querySelector('#qr-reader__dashboard');
        if (dashboard) (dashboard as HTMLElement).style.display = 'none';
        
        const region = this.querySelector('#qr-reader__scan_region');
        if (region) {
            (region as HTMLElement).style.width = '100%';
            (region as HTMLElement).style.height = '100%';
        }
      }
    }, 300);
  }

  async stopScanning() {
    this.scanning = false;
    
    if (this.html5QrCode) {
      try {
        if (this.html5QrCode.isScanning) {
            await this.html5QrCode.stop();
        }
        this.html5QrCode.clear();
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
      this.html5QrCode = null;
      
      const qrReader = this.querySelector('#qr-reader') as HTMLElement;
      if (qrReader) {
        qrReader.style.display = 'none';
      }
    }
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
      <div id="scanner-container">
        <div id="qr-reader"></div>
        
        ${this.hasPermission === false ? html`
          <div class="permission-request">
            <h2>${this.translations.cameraPermissionRequired || 'Camera Permission Required'}</h2>
            <p>${this.error || this.translations.cameraPermissionDesc || 'Camera access is needed to scan barcodes.'}</p>
            <button class="back-btn" @click="${() => this.startScanning()}">${this.translations.retry || 'Retry'}</button>
            <br><br>
            <button class="back-btn" @click="${this.handleBack}">${this.translations.goBack || 'Go Back'}</button>
          </div>
        ` : ''}

        <div class="overlay">
          ${this.error && this.hasPermission !== false ? html`<div class="error-msg">${this.error}</div>` : ''}
          ${this.scanning ? html`
            <div class="scan-area">
              ${Capacitor.isNativePlatform() ? html`<div class="scan-line"></div>` : ''}
            </div>
          ` : ''}
        </div>

        <div class="controls">
          <button class="back-btn" @click="${this.handleBack}">${this.translations.cancel || 'Cancel'}</button>
        </div>
      </div>
    `;
  }
}
