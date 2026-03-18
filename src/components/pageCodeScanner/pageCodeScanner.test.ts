import { expect } from '@esm-bundle/chai';
import { createComponent } from '../../shared/test-helper';

import './index';
import { PageCodeScanner } from './pageCodeScanner';

describe('PageCodeScanner Spec:', () => {
  let element: HTMLElement;
  let component: PageCodeScanner;

  beforeEach(async () => {
    const comp = await createComponent({
      class: PageCodeScanner,
      name: 'page-code-scanner',
      mock: {
        startScanning: () => Promise.resolve(),
        stopScanning: () => Promise.resolve()
      }
    });
    element = comp.element;
    component = element as PageCodeScanner;
  });

  afterEach(() => {
    if (element && element.parentNode) {
      document.body.removeChild(element);
    }
  });

  it('should render reader element', async () => {
    await component.updateComplete;
    const reader = element.querySelector('#qr-reader');
    expect(reader).to.exist;
  });

  it('should render overlay element', async () => {
    await component.updateComplete;
    const overlay = element.querySelector('.overlay');
    expect(overlay).to.exist;
  });

  it('should render controls with back button', async () => {
    await component.updateComplete;
    const controls = element.querySelector('.controls');
    expect(controls).to.exist;
    
    const backButton = element.querySelector('.back-btn');
    expect(backButton).to.exist;
    expect(backButton?.textContent).to.equal(component.translations.cancel);
  });

  it('should have default state values', () => {
    expect(component.hasPermission).to.be.null;
    expect(component.scanning).to.be.false;
    expect(component.error).to.be.null;
  });

  it('should handle handleBack to navigate to search', async () => {
    let navigated = false;
    component.triggerPageNavigation = (params: any) => {
      if (params.page === 'search') {
        navigated = true;
      }
    };
    
    component.handleBack();
    
    expect(navigated).to.be.true;
  });

  it('should render error message when error is set', async () => {
    component.error = 'Test error message';
    component.hasPermission = true;
    await component.updateComplete;
    
    const errorMsg = element.querySelector('.error-msg');
    expect(errorMsg).to.exist;
    expect(errorMsg?.textContent).to.equal('Test error message');
  });

  it('should render permission request when hasPermission is false', async () => {
    component.hasPermission = false;
    component.error = 'Camera error';
    await component.updateComplete;
    
    const permissionRequest = element.querySelector('.permission-request');
    expect(permissionRequest).to.exist;
    
    const heading = permissionRequest?.querySelector('h2');
    expect(heading).to.exist;
    
    const retryButton = permissionRequest?.querySelector('.back-btn');
    expect(retryButton).to.exist;
  });

  it('should not render permission request when hasPermission is true', async () => {
    component.hasPermission = true;
    component.error = null;
    await component.updateComplete;
    
    const permissionRequest = element.querySelector('.permission-request');
    expect(permissionRequest).to.not.exist;
  });

  it('should not render error message when hasPermission is false', async () => {
    component.hasPermission = false;
    component.error = 'Test error';
    await component.updateComplete;
    
    const errorMsg = element.querySelector('.error-msg');
    expect(errorMsg).to.not.exist;
  });

  it('should show scan area when scanning is true', async () => {
    component.scanning = true;
    await component.updateComplete;
    
    const scanArea = element.querySelector('.scan-area');
    expect(scanArea).to.exist;
  });

  it('should not show scan area when scanning is false', async () => {
    component.scanning = false;
    await component.updateComplete;
    
    const scanArea = element.querySelector('.scan-area');
    expect(scanArea).to.not.exist;
  });

  it('should call stopScanning on handleBack', async () => {
    let stopCalled = false;
    component.stopScanning = () => {
      stopCalled = true;
      return Promise.resolve();
    };
    
    component.handleBack();
    
    expect(stopCalled).to.be.true;
  });

  it('should render back button in permission request', async () => {
    component.hasPermission = false;
    await component.updateComplete;
    
    const buttons = element.querySelectorAll('.permission-request .back-btn');
    expect(buttons?.length).to.equal(2);
  });

  it('should have translations available', () => {
    expect(component.translations).to.exist;
    expect(component.translations.cancel).to.exist;
    expect(component.translations.cameraError).to.exist;
  });

  it('should have createRenderRoot returning this', () => {
    const renderRoot = component.createRenderRoot();
    expect(renderRoot).to.equal(component);
  });

  it('should render permission heading text', async () => {
    component.hasPermission = false;
    await component.updateComplete;
    
    const heading = element.querySelector('.permission-request h2');
    expect(heading?.textContent).to.equal(component.translations.cameraPermissionRequired);
  });

  it('should render go back button in permission request', async () => {
    component.hasPermission = false;
    await component.updateComplete;
    
    const buttons = element.querySelectorAll('.permission-request .back-btn');
    expect(buttons[1]?.textContent).to.equal(component.translations.goBack);
  });

  it('should render retry button in permission request', async () => {
    component.hasPermission = false;
    await component.updateComplete;
    
    const buttons = element.querySelectorAll('.permission-request .back-btn');
    expect(buttons[0]?.textContent).to.equal(component.translations.retry);
  });

  it('should render permission description in permission request', async () => {
    component.hasPermission = false;
    await component.updateComplete;
    
    const description = element.querySelector('.permission-request p');
    expect(description?.textContent).to.equal(component.error || component.translations.cameraPermissionDesc);
  });

  it('should handle click on retry button', async () => {
    component.hasPermission = false;
    await component.updateComplete;
    
    let startCalled = false;
    component.startScanning = async () => {
      startCalled = true;
    };
    
    const retryButton = element.querySelector('.permission-request .back-btn') as HTMLButtonElement;
    retryButton?.click();
    
    expect(startCalled).to.be.true;
  });

  it('should handle click on go back button in permission request', async () => {
    component.hasPermission = false;
    await component.updateComplete;
    
    let navigated = false;
    component.triggerPageNavigation = () => {
      navigated = true;
    };
    
    const buttons = element.querySelectorAll('.permission-request .back-btn');
    (buttons[1] as HTMLButtonElement)?.click();
    
    expect(navigated).to.be.true;
  });
});
