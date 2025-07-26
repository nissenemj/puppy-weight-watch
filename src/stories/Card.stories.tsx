import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/design-system/Card';

const meta: Meta<typeof Card> = {
  title: 'DesignSystem/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Puppy Info</CardTitle>
      </CardHeader>
      <CardContent>
        <p>This card can contain any content. It is useful for grouping information.</p>
      </CardContent>
      <CardFooter>
        <span className="text-sm text-muted-foreground">Footer content</span>
      </CardFooter>
    </Card>
  ),
};

export const WithoutFooter: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Simple Card</CardTitle>
      </CardHeader>
      <CardContent>
        <p>A card without a footer section.</p>
      </CardContent>
    </Card>
  ),
};

export const CompactCard: Story = {
  render: () => (
    <Card className="w-64">
      <CardContent className="p-4">
        <p className="text-sm">Compact card with minimal padding.</p>
      </CardContent>
    </Card>
  ),
};