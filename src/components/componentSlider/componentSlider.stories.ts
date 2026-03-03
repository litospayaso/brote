import { html } from 'lit';
import './componentSlider';

export default {
  title: 'Components/ComponentSlider',
  component: 'component-slider',
  argTypes: {
    steps: { control: 'number' },
    minTag: { control: 'text' },
    maxTag: { control: 'text' },
    min: { control: 'number' },
    max: { control: 'number' },
    value: { control: 'number' },
    theme: {
      control: 'radio',
      options: ['light', 'dark']
    }
  },
};

const Template = (args: any) => html`
  <component-slider 
    data-theme="${args.theme === 'dark' ? 'dark' : 'light'}"
    steps="${args.steps}"
    minTag="${args.minTag}"
    maxTag="${args.maxTag}"
    min="${args.min}"
    max="${args.max}"
    value="${args.value}"
    style="--primary-color: #4CAF50; --primary-color-dark: #9c27b0; --background-secondary: #e0e0e0; --background-secondary-dark: #424242; width: 300px; padding: 20px;"
  ></component-slider>
`;

export const Default = Template.bind({});
(Default as any).args = {
  steps: 1,
  minTag: 'Min',
  maxTag: 'Max',
  min: 0,
  max: 100,
  value: 50,
  theme: 'light'
};

export const DarkMode = Template.bind({});
(DarkMode as any).args = {
  steps: 10,
  minTag: 'Low',
  maxTag: 'High',
  min: 0,
  max: 100,
  value: 70,
  theme: 'dark'
};
