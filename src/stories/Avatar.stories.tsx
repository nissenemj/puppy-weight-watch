import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from '../components/design-system/Avatar';

const meta: Meta<typeof Avatar> = {
  title: 'DesignSystem/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
  },
  args: {
    alt: 'Puppy',
  },
  argTypes: {
    size: {
      control: {
        type: 'select',
        options: ['sm', 'md', 'lg'],
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const WithImage: Story = {
  args: {
    src: 'https://placekitten.com/200/200',
    size: 'md',
  },
};

export const WithFallback: Story = {
  args: {
    src: undefined,
    fallback: 'A',
    size: 'md',
  },
};

export const LargeAvatar: Story = {
  args: {
    src: 'https://placekitten.com/300/300',
    size: 'lg',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <Avatar size="sm" src="https://placekitten.com/200/200" alt="Small puppy" />
      <Avatar size="md" src="https://placekitten.com/200/200" alt="Medium puppy" />
      <Avatar size="lg" src="https://placekitten.com/200/200" alt="Large puppy" />
    </div>
  ),
};

export const WithFallbackText: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <Avatar size="sm" fallback="🐕" />
      <Avatar size="md" fallback="P" />
      <Avatar size="lg" fallback="🐾" />
    </div>
  ),
};