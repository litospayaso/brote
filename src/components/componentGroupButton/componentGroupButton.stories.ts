import type { Meta, StoryObj } from '@storybook/web-components';
import './index'; // Import the component

const meta: Meta = {
  title: 'Components/GroupButton',
  component: 'component-group-button',
  argTypes: {
    options: { control: 'object' },
    'group-button-click': { action: 'group-button-click' },
  },
};

export default meta;

type Story = StoryObj;

const defaultOptions = [
  { text: 'Option 1', id: '1', active: true },
  { text: 'Option 2', id: '2', active: false },
  { text: 'Option 3', id: '3', active: false },
];

export const Default: Story = {
  render: (args: any) => {
    const element = document.createElement('component-group-button');
    element.setAttribute('options', JSON.stringify(args.options));
    element.addEventListener('group-button-click', (button: any) => {
      args.options.map((option: any) => {
        if (option.id === button.detail.id) {
          option.active = true;
        } else {
          option.active = false;
        }
        return option;
      });
      element.setAttribute('options', JSON.stringify(args.options));
    });
    return element;
  },
  args: {
    options: defaultOptions,
  },
};


