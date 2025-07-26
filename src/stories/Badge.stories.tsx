import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '../components/design-system/Badge';

const meta: Meta<typeof Badge> = {
  title: 'DesignSystem/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  args: {
    children: 'New',
  },
  argTypes: {
    variant: {
      control: {
        type: 'select',
        options: ['default', 'success', 'warning', 'danger'],
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    variant: 'default',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Online',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'Expiring',
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Error',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      <Badge variant="default">Default</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="danger">Danger</Badge>
    </div>
  ),
};