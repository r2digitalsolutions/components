import type { Meta, StoryObj } from '@storybook/svelte';
import CartItemStory from './CartItemStory.svelte';

const meta = {
	title: 'Molecules/CartItem',
	component: CartItemStory,
	tags: ['autodocs']
} satisfies Meta<typeof CartItemStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
