import './index';
import type { Meta, StoryObj } from '@storybook/web-components-vite';


const render = () => {
  const element = document.createElement('brote-app');
  return element;
}

const meta = {
  title: 'App/Brote App',
  tags: ['autodocs'],
  render,
} satisfies Meta<any>;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render
};
