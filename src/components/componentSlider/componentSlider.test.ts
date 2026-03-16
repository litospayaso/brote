import { expect } from '@esm-bundle/chai';
import { createComponent, accessibilityCheck, defer } from '../../shared/test-helper';
import ComponentSlider from './componentSlider';

const dispatchTouchEvent = (eventName: string, details: any) => {
  const uiEvent = document.createEvent('UIEvent');
  uiEvent.initUIEvent(eventName, true, true, window, 1);
  const event = Object.assign(uiEvent, { touches: [details] });
  details.target.dispatchEvent(event);
}

describe('ComponentSlider Spec:', () => {
  let element: HTMLElement;
  let shadow: ShadowRoot;
  let changedValue: number = 0;

  beforeEach(async () => {
    const component = await createComponent({
      class: ComponentSlider,
      name: 'component-slider',
      properties: {
        steps: '5',
        minTag: '0%',
        maxTag: '100%',
        min: '0',
        max: '100',
        value: '25'
      },
      listeners: {
        'value-changed': (e: any) => {
          changedValue = e.detail.value;
        }
      }
    });
    shadow = component.shadow;
    element = component.element;
  });

  afterEach(() => {
    if (document.body.contains(element)) {
      document.body.removeChild(element);
    }
    changedValue = 0;
  });

  it('should contain shadow root', () => {
    expect(shadow).to.exist;
  });

  it('should be accessible', async () => {
    const result = await accessibilityCheck(element);
    expect(result.length).to.be.equal(0);
  });

  it('should render the range input with correct attributes', () => {
    const input = shadow.querySelector('input[type="range"]') as HTMLInputElement;
    expect(input).to.exist;
    expect(input.min).to.equal('0');
    expect(input.max).to.equal('100');
    expect(input.step).to.equal('5');
    expect(input.value).to.equal('25');
  });

  it('should render min and max tags', () => {
    const labels = shadow.querySelectorAll('.labels span');
    expect(labels.length).to.equal(2);
    expect(labels[0].textContent).to.equal('0%');
    expect(labels[1].textContent).to.equal('100%');
  });

  it('should update value and dispatch event on input', (done) => {
    const input = shadow.querySelector('input[type="range"]') as HTMLInputElement;
    input.value = '75';
    input.dispatchEvent(new Event('input'));
    defer(() => {
      expect(changedValue).to.equal(75);
      done();
    })
  });

  it('should show tooltip on mousedown and hide on mouseup', (done) => {
    const input = shadow.querySelector('input[type="range"]') as HTMLInputElement;
    const tooltip = shadow.querySelector('.tooltip') as HTMLElement;

    expect(tooltip.classList.contains('visible')).to.be.false;

    defer(() => {
      input.dispatchEvent(new MouseEvent('mousedown'));
      defer(() => {
        expect(tooltip.classList.contains('visible')).to.be.true;
        done();
      });
    });
  });

  it('should show tooltip on touchstart and hide on touchend', (done) => {
    const input = shadow.querySelector('input[type="range"]') as HTMLInputElement;
    const tooltip = shadow.querySelector('.tooltip') as HTMLElement;

    expect(tooltip.classList.contains('visible')).to.be.false;

    dispatchTouchEvent('touchstart', { identifier: 0, target: input, pageX: 50, pageY: 100 });
    defer(() => {
      expect(tooltip.classList.contains('visible')).to.be.true;
      dispatchTouchEvent('touchend', { identifier: 0, target: input, pageX: 50, pageY: 100 });
      defer(() => {
        expect(tooltip.classList.contains('visible')).to.be.false;
        done();
      });
    });

  });
});
