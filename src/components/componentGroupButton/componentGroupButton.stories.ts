import type { Meta, StoryObj } from '@storybook/web-components';
import './index'; // Import the component

const meta: Meta = {
  title: 'Components/GroupButton',
  component: 'component-group-button',
  argTypes: {
    options: { control: 'object' },
    size: {
      control: 'select',
      options: ['xs', 's', 'm', 'l', 'xl'],
      description: 'Size of the group button',
    },
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
    if (args.size) {
      element.setAttribute('size', args.size);
    }
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
    size: 'xs',
  },
};

export const ExtraSmall: Story = {
  ...Default,
  args: {
    options: defaultOptions,
    size: 'xs',
  },
};

export const Smaller: Story = {
  ...Default,
  args: {
    options: defaultOptions,
    size: 's',
  },
};

export const Medium: Story = {
  ...Default,
  args: {
    options: defaultOptions,
    size: 'm',
  },
};

export const Large: Story = {
  ...Default,
  args: {
    options: defaultOptions,
    size: 'l',
  },
};

export const ExtraLarge: Story = {
  ...Default,
  args: {
    options: defaultOptions,
    size: 'xl',
  },
};

const emojiOptions = [
  { text: 'apple', id: '1', active: true, emoji: true },
  { text: 'banana', id: '2', active: false, emoji: true },
  { text: 'cherry', id: '3', active: false, emoji: true },
];

export const WithEmoji: Story = {
  ...Default,
  args: {
    options: emojiOptions,
    size: 'sm',
  },
};


